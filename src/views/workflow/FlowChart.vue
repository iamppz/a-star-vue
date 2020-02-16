<template>
    <div>
        <div id="toolbar">
            <el-button type="primary" @click="add">添加节点</el-button>
        </div>
        <div id="chart" @mousemove="handleChartMouseMove" @mouseup="handleChartMouseUp">
            <span id="position">{{cursorToChartOffset.x + ', ' + cursorToChartOffset.y}}</span>
            <canvas id="canvas" width="800" height="600" />
            <template v-for="node in nodes">
                <div
                    class="node"
                    :key="node.id"
                    :style="{top: node.y + 'px', left: node.x + 'px'}"
                    :name="'node-' + node.id"
                    @mousedown="handleNodeMouseDown(node, $event)"
                    @mouseup="handleNodeMouseUp(node)"
                >
                    <div class="node-header">{{node.name}}</div>
                    <div
                        class="node-connector node-connector-top"
                        @mouseup="handleNodeConnectorMouseUp(node, 'top', $event)"
                        @mousedown="handleNodeConnectorMouseDown(node, 'top', $event)"
                    ></div>
                    <div
                        class="node-connector node-connector-bottom"
                        @mouseup="handleNodeConnectorMouseUp(node, 'bottom', $event)"
                        @mousedown="handleNodeConnectorMouseDown(node, 'bottom', $event)"
                    ></div>
                    <div
                        class="node-connector node-connector-left"
                        @mouseup="handleNodeConnectorMouseUp(node, 'left', $event)"
                        @mousedown="handleNodeConnectorMouseDown(node, 'left', $event)"
                    ></div>
                    <div
                        class="node-connector node-connector-right"
                        @mouseup="handleNodeConnectorMouseUp(node, 'right', $event)"
                        @mousedown="handleNodeConnectorMouseDown(node, 'right', $event)"
                    ></div>
                </div>
            </template>
        </div>
    </div>
</template>
<script>
import { arrow2, clearCanvas } from "../../utils/canvas";
import { getOffsetLeft, getOffsetTop } from "../../utils/dom";

export default {
    data() {
        return {
            nodes: [
                {
                    id: 1,
                    x: 10,
                    y: 10,
                    name: "开始"
                },
                {
                    id: 2,
                    x: 100,
                    y: 100,
                    name: "结束"
                }
            ],
            connections: [],
            movingNode: {
                target: null,
                offsetX: null,
                offsetY: null
            },
            connectingInfo: {
                source: null,
                sourcePosition: null,
                sourceX: null,
                sourceY: null
            },
            cursorToChartOffset: {
                x: 0,
                y: 0
            }
        };
    },
    methods: {
        add() {},
        handleNodeMouseDown(node, event) {
            this.movingNode.target = node;
            this.movingNode.offsetX = event.offsetX;
            this.movingNode.offsetY = event.offsetY;
        },
        handleNodeMouseUp() {
            if (this.movingNode.target) {
                this.movingNode.target.x =
                    Math.round(Math.round(this.movingNode.target.x) / 10) * 10;
                this.movingNode.target.y =
                    Math.round(Math.round(this.movingNode.target.y) / 10) * 10;
                this.movingNode.target = null;
                this.movingNode.offsetX = null;
                this.movingNode.offsetY = null;
                let that = this;
                that.$nextTick(function() {
                    that.refresh();
                });
            }
        },
        handleChartMouseMove(event) {
            let element = document.getElementById("chart");
            this.cursorToChartOffset.x = event.pageX - getOffsetLeft(element);
            this.cursorToChartOffset.y = event.pageY - getOffsetTop(element);
            if (this.movingNode.target) {
                this.movingNode.target.x =
                    this.cursorToChartOffset.x - this.movingNode.offsetX;
                this.movingNode.target.y =
                    this.cursorToChartOffset.y - this.movingNode.offsetY;
                this.refresh();
            } else if (this.connectingInfo.source) {
                this.refresh();
                arrow2(
                    "canvas",
                    this.connectingInfo.sourceX,
                    this.connectingInfo.sourceY,
                    this.cursorToChartOffset.x,
                    this.cursorToChartOffset.y,
                    "#a3a3a3",
                    true,
                    this.connectingInfo.sourcePosition
                );
            }
        },
        handleChartMouseUp(event) {
            if (this.connectingInfo.source) {
                this.connectingInfo.source = null;
                this.connectingInfo.sourcePosition = null;
                this.connectingInfo.sourceX = null;
                this.connectingInfo.sourceY = null;
                this.refresh();
            }
        },
        handleNodeConnectorMouseDown(source, position, event) {
            event.stopPropagation();
            this.connectingInfo.source = source;
            this.connectingInfo.sourcePosition = position;
            let offset = this.getNodeConnectorOffset(source.id, position);
            this.connectingInfo.sourceX = offset.left;
            this.connectingInfo.sourceY = offset.top;
        },
        handleNodeConnectorMouseUp(destination, position, event) {
            if (this.connectingInfo.source) {
                this.connections.push({
                    source: {
                        id: this.connectingInfo.source.id,
                        position: this.connectingInfo.sourcePosition
                    },
                    destination: {
                        id: destination.id,
                        position: position
                    }
                });
                this.refresh();
            }
        },
        refresh() {
            clearCanvas("canvas");
            this.connections.forEach(conn => {
                let sourceOffset = this.getNodeConnectorOffset(
                    conn.source.id,
                    conn.source.position
                );
                let destinationOffset = this.getNodeConnectorOffset(
                    conn.destination.id,
                    conn.destination.position
                );
                arrow2(
                    "canvas",
                    sourceOffset.left,
                    sourceOffset.top,
                    destinationOffset.left,
                    destinationOffset.top,
                    "#a3a3a3",
                    true,
                    conn.source.position,
                    conn.destination.position
                );
            });
        },
        getNodeConnectorOffset(nodeId, connectorPosition) {
            let nodeElement = document.getElementsByName("node-" + nodeId)[0];
            let connector = nodeElement.querySelector(
                ".node-connector-" + connectorPosition
            );
            let chartElement = document.getElementById("chart");
            return {
                left: getOffsetLeft(connector) - getOffsetLeft(chartElement) + 3,
                top: getOffsetTop(connector) - getOffsetTop(chartElement) + 3
            };
        }
    }
};
</script>
<style scoped>
#toolbar {
    margin-bottom: 10px;
}

#canvas {
    border: 1px solid #a3a3a3;
    position: absolute;
}

#chart {
    position: relative;
    width: 800px;
    height: 600px;
    background-size: 10px 10px;
    background-image: linear-gradient(to right, #f1f1f1 1px, transparent 1px),
        linear-gradient(to bottom, #f1f1f1 1px, transparent 1px);
}

.node {
    width: 120px;
    height: 60px;
    position: absolute;
    border: 1px solid #a3a3a3;
    box-sizing: border-box;
    font-size: 12px;
    background-color: white;
    cursor: pointer;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.node-header {
    background-color: #f3f3f3;
    height: 20px;
    line-height: 20px;
    padding: 0 6px;
}

.node-connector {
    position: absolute;
    width: 5px;
    height: 5px;
    border-radius: 4px;
    box-sizing: border-box;
}

.node:hover .node-connector {
    display: block;
    border: 1px solid #a3a3a3;
    background-color: white;
}

.node-connector-top {
    top: -3px;
    left: 57px;
}

.node-connector-bottom {
    bottom: -3px;
    left: 57px;
}

.node-connector-left {
    top: 27px;
    left: -3px;
}

.node-connector-right {
    top: 27px;
    right: -3px;
}

#position {
    position: absolute;
    right: 0;
    top: 0;
}
</style>
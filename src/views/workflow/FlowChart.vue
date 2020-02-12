<template>
    <div>
        <div id="toolbar">
            <el-button type="primary" @click="add">添加节点</el-button>
        </div>
        <div id="chart" @mousemove="handleChartMouseMove">
            <span id="position">{{cursorToChartOffset.x + ', ' + cursorToChartOffset.y}}</span>
            <canvas id="canvas" width="800" height="600"/>
            <template v-for="node in nodes">
                <div class="node" :key="node.id" :style="{top: node.y + 'px', left: node.x + 'px'}"
                     @mousedown="handleNodeMouseDown(node, $event)" @mouseup="handleNodeMouseUp(node)">
                    <div class="node-header">
                        {{node.name}}
                    </div>
                    <div class="node-connector node-connector-top"
                         @mousedown="handleNodeConnectorMouseDown(node, 'top', $event)"></div>
                    <div class="node-connector node-connector-bottom"
                         @mousedown="handleNodeConnectorMouseDown(node, 'bottom', $event)"></div>
                    <div class="node-connector node-connector-left"
                         @mousedown="handleNodeConnectorMouseDown(node, 'left', $event)"></div>
                    <div class="node-connector node-connector-right"
                         @mousedown="handleNodeConnectorMouseDown(node, 'right', $event)"></div>
                </div>
            </template>
        </div>
    </div>
</template>
<script>
    import {arrowTo, clearCanvas} from "../../utils/canvas";
    import {getOffsetLeft, getOffsetTop} from "../../utils/dom";

    export default {
        data() {
            return {
                nodes: [
                    {
                        id: 1,
                        x: 10,
                        y: 10,
                        name: '开始'
                    },
                    {
                        id: 2,
                        x: 100,
                        y: 100,
                        name: '结束'
                    }
                ],
                movingNode: {
                    target: null,
                    offsetX: null,
                    offsetY: null
                },
                connectingInfo: {
                    source: null,
                    direction: null,
                    sourceX: null,
                    sourceY: null
                },
                cursorToChartOffset: {
                    x: 0,
                    y: 0
                }
            }
        },
        methods: {
            add() {
            },
            handleNodeMouseDown(node, event) {
                this.movingNode.target = node;
                this.movingNode.offsetX = event.offsetX;
                this.movingNode.offsetY = event.offsetY;
            },
            handleNodeMouseUp() {
                this.movingNode.target.x = Math.round(Math.round(this.movingNode.target.x) / 10) * 10;
                this.movingNode.target.y = Math.round(Math.round(this.movingNode.target.y) / 10) * 10;
                this.movingNode.target = null;
                this.movingNode.offsetX = null;
                this.movingNode.offsetY = null;
            },
            handleChartMouseMove(event) {
                let element = document.getElementById('chart');
                this.cursorToChartOffset.x = event.pageX - getOffsetLeft(element);
                this.cursorToChartOffset.y = event.pageY - getOffsetTop(element);
                if (this.movingNode.target) {
                    this.movingNode.target.x = this.cursorToChartOffset.x - this.movingNode.offsetX;
                    this.movingNode.target.y = this.cursorToChartOffset.y - this.movingNode.offsetY;
                } else if (this.connectingInfo.source) {
                    this.refresh();
                    arrowTo('canvas', this.connectingInfo.sourceX, this.connectingInfo.sourceY,
                        this.cursorToChartOffset.x, this.cursorToChartOffset.y, '#a3a3a3', true);
                }
            },
            handleNodeConnectorMouseDown(source, direction, event) {
                event.stopPropagation();
                this.connectingInfo.source = source;
                this.connectingInfo.direction = direction;
                let element = document.getElementById('chart');
                this.connectingInfo.sourceX = getOffsetLeft(event.currentTarget) - getOffsetLeft(element);
                this.connectingInfo.sourceY = getOffsetTop(event.currentTarget) - getOffsetTop(element);
            },
            refresh() {
                clearCanvas('canvas');
            }
        }
    }
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
        background-image: linear-gradient(to right, #f1f1f1 1px, transparent 1px), linear-gradient(to bottom, #f1f1f1 1px, transparent 1px);
    }

    .node {
        width: 120px;
        height: 60px;
        position: absolute;
        border: 1px solid #a3a3a3;
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
        display: none;
        position: absolute;
        color: white;
        border: 1px solid #a3a3a3;
        width: 5px;
        height: 5px;
        border-radius: 4px;
        background-color: white;
    }

    .node:hover .node-connector {
        display: block;
    }

    .node-connector-top {
        top: -4px;
        left: 58px;
    }

    .node-connector-bottom {
        bottom: -4px;
        left: 58px;
    }

    .node-connector-left {
        top: 28px;
        left: -4px;
    }

    .node-connector-right {
        top: 28px;
        right: -4px;
    }

    #position {
        position: absolute;
        right: 0;
        top: 0;
    }
</style>
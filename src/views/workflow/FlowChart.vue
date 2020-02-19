<template>
    <div>
        <div id="toolbar">
            <el-button type="primary" @click="add(10, 10)">添加节点</el-button>
        </div>
        <div
            id="chart"
            @mousemove="handleChartMouseMove"
            @mouseup="handleChartMouseUp"
            @dblclick="handleChartDblClick"
        >
            <span id="position">{{ cursorToChartOffset.x + ', ' + cursorToChartOffset.y }}</span>
            <canvas id="canvas" width="800" height="600" />
            <template v-for="node in nodes">
                <div
                    :class="{ node: true, active: currentNode && currentNode.id === node.id }"
                    :key="node.id"
                    :style="{ top: node.y + 'px', left: node.x + 'px' }"
                    :name="'node-' + node.id"
                    @mousedown="handleNodeMouseDown(node, $event)"
                    @dblclick.stop="handleNodeMouseDblClick(node, $event)"
                    @mouseup="handleNodeMouseUp(node)"
                >
                    <div class="node-header">{{ node.name }}</div>
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
        <drawer-wrapper
            :visible="nodeDialogVisible"
            @cancel="handleClickCancelSaveNode"
            @ok="handleClickSaveNode"
        >
            <template slot="body">
                <el-form ref="form" :model="nodeForm" label-width="80px">
                    <el-form-item label="名称">
                        <input type="hidden" v-model="nodeForm.id" />
                        <el-input v-model="nodeForm.name" />
                    </el-form-item>
                    <el-form-item label="类型">
                        <el-select
                            v-model="nodeForm.type"
                            placeholder="请选择"
                            style="width: 100%;"
                        >
                            <el-option
                                v-for="item in [
                                    { name: '开始', id: 'start' },
                                    { name: '结束', id: 'end' },
                                    { name: '审批', id: 'operation' }
                                ]"
                                :key="'node-type-' + item.id"
                                :label="item.name"
                                :value="item.id"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </template>
        </drawer-wrapper>
    </div>
</template>
<script>
import { lineTo, arrow2, clearCanvas, fillRect } from '../../utils/canvas';
import { getOffsetLeft, getOffsetTop } from '../../utils/dom';
import DrawerWrapper from '../../components/DrawerWrapper';
import '../../assets/flowchart.css';

export default {
    data() {
        return {
            nodes: [
                { id: 1, x: 140, y: 270, name: '开始', type: 'start' },
                { id: 2, x: 540, y: 270, name: '结束', type: 'end' }
            ],
            connections: [],
            movingInfo: { target: null, offsetX: null, offsetY: null },
            connectingInfo: { source: null, sourcePosition: null, sourceX: null, sourceY: null },
            currentNode: null,
            cursorToChartOffset: { x: 0, y: 0 },
            nodeDialogVisible: false,
            nodeForm: { name: null, id: null, type: null },
            connectionForm: { type: null }
        };
    },
    components: { DrawerWrapper },
    methods: {
        add(x, y) {
            this.nodes.push({ id: +new Date(), x: x, y: y, name: '新建节点' });
        },
        handleNodeMouseDown(node, event) {
            this.currentNode = node;
            this.movingInfo.target = node;
            this.movingInfo.offsetX = event.offsetX;
            this.movingInfo.offsetY = event.offsetY;
        },
        handleNodeMouseDblClick(node) {
            this.nodeForm.id = node.id;
            this.nodeForm.name = node.name;
            this.nodeForm.type = node.type;
            this.nodeDialogVisible = true;
        },
        handleNodeMouseUp() {
            if (this.movingInfo.target) {
                this.movingInfo.target.x =
                    Math.round(Math.round(this.movingInfo.target.x) / 10) * 10;
                this.movingInfo.target.y =
                    Math.round(Math.round(this.movingInfo.target.y) / 10) * 10;
                this.movingInfo.target = null;
                this.movingInfo.offsetX = null;
                this.movingInfo.offsetY = null;
                let that = this;
                that.$nextTick(function() {
                    that.refresh();
                });
            }
        },
        handleChartMouseMove(event) {
            let element = document.getElementById('chart');
            this.cursorToChartOffset.x = event.pageX - getOffsetLeft(element);
            this.cursorToChartOffset.y = event.pageY - getOffsetTop(element);
            if (this.movingInfo.target) {
                this.movingInfo.target.x = this.cursorToChartOffset.x - this.movingInfo.offsetX;
                this.movingInfo.target.y = this.cursorToChartOffset.y - this.movingInfo.offsetY;
                this.refresh();
                let expectX = Math.round(Math.round(this.movingInfo.target.x) / 10) * 10;
                let expectY = Math.round(Math.round(this.movingInfo.target.y) / 10) * 10;
                fillRect('canvas', expectX, expectY, 120, 60, '#d2e3fc');
                let guidelineDash = [5, 3];
                this.nodes.forEach(item => {
                    if (item.x === expectX) {
                        // vertical guideline
                        if (item.y < expectY) {
                            this.lineTo(item.x, item.y + 60, expectX, expectY, guidelineDash);
                        } else {
                            this.lineTo(expectX, expectY + 60, item.x, item.y, guidelineDash);
                        }
                    }
                    if (item.y === expectY) {
                        // horizontal guideline
                        if (item.x < expectX) {
                            this.lineTo(item.x + 120, item.y, expectX, expectY, guidelineDash);
                        } else {
                            this.lineTo(expectX + 120, expectY, item.x, item.y, guidelineDash);
                        }
                    }
                });
            } else if (this.connectingInfo.source) {
                this.refresh();
                this.arrowTo(
                    this.connectingInfo.sourceX,
                    this.connectingInfo.sourceY,
                    this.cursorToChartOffset.x,
                    this.cursorToChartOffset.y,
                    this.connectingInfo.sourcePosition
                );
            }
        },
        handleChartMouseUp() {
            if (this.connectingInfo.source) {
                this.connectingInfo.source = null;
                this.connectingInfo.sourcePosition = null;
                this.connectingInfo.sourceX = null;
                this.connectingInfo.sourceY = null;
                this.refresh();
            }
        },
        handleChartDblClick() {
            let element = document.getElementById('chart');
            let x = event.pageX - getOffsetLeft(element) - 60;
            let y = event.pageY - getOffsetTop(element) - 30;
            this.add(x, y);
        },
        handleNodeConnectorMouseDown(source, position, event) {
            event.stopPropagation();
            this.connectingInfo.source = source;
            this.connectingInfo.sourcePosition = position;
            let offset = this.getNodeConnectorOffset(source.id, position);
            this.connectingInfo.sourceX = offset.left;
            this.connectingInfo.sourceY = offset.top;
        },
        handleNodeConnectorMouseUp(destination, position) {
            if (this.connectingInfo.source) {
                this.connections.push({
                    source: {
                        id: this.connectingInfo.source.id,
                        position: this.connectingInfo.sourcePosition
                    },
                    destination: { id: destination.id, position: position }
                });
                this.refresh();
            }
        },
        refresh() {
            clearCanvas('canvas');
            this.connections.forEach(conn => {
                let sourceOffset = this.getNodeConnectorOffset(
                    conn.source.id,
                    conn.source.position
                );
                let destinationOffset = this.getNodeConnectorOffset(
                    conn.destination.id,
                    conn.destination.position
                );
                this.arrowTo(
                    sourceOffset.left,
                    sourceOffset.top,
                    destinationOffset.left,
                    destinationOffset.top,
                    conn.source.position,
                    conn.destination.position
                );
            });
        },
        getNodeConnectorOffset(nodeId, connectorPosition) {
            let nodeElement = document.getElementsByName('node-' + nodeId)[0];
            let connector = nodeElement.querySelector('.node-connector-' + connectorPosition);
            let chartElement = document.getElementById('chart');
            return {
                left: getOffsetLeft(connector) - getOffsetLeft(chartElement) + 3,
                top: getOffsetTop(connector) - getOffsetTop(chartElement) + 3
            };
        },
        handleClickSaveNode() {
            let that = this;
            let node = this.nodes.filter(item => item.id === that.nodeForm.id)[0];
            node.name = that.nodeForm.name;
            node.type = that.nodeForm.type;
            this.nodeDialogVisible = false;
        },
        handleClickCancelSaveNode() {
            this.nodeDialogVisible = false;
        },
        lineTo(x1, y1, x2, y2, dash) {
            lineTo('canvas', x1, y1, x2, y2, 1, '#a3a3a3', dash);
        },
        arrowTo(x1, y1, x2, y2, startPosition, endPosition) {
            arrow2('canvas', x1, y1, x2, y2, 1, '#a3a3a3', startPosition, endPosition);
        }
    },
    mounted() {
        let that = this;
        document.onkeydown = function(event) {
            switch (event.keyCode) {
                case 37:
                    if (that.currentNode != null) {
                        that.currentNode.x -= 10;
                    }
                    break;
                case 38:
                    if (that.currentNode != null) {
                        that.currentNode.y -= 10;
                    }
                    break;
                case 39:
                    if (that.currentNode != null) {
                        that.currentNode.x += 10;
                    }
                    break;
                case 40:
                    if (that.currentNode != null) {
                        that.currentNode.y += 10;
                    }
                    break;
                case 27:
                    if (that.currentNode) {
                        that.currentNode = null;
                    }
                    break;
                case 46:
                    if (that.currentNode) {
                        that.nodes.splice(that.nodes.indexOf(that.currentNode), 1);
                    }
                    break;
                default:
                    break;
            }
            that.$nextTick(function() {
                that.refresh();
            });
        };
    }
};
</script>

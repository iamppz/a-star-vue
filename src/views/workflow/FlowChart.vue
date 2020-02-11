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
                        Node
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                nodes: [
                    {
                        id: 1,
                        x: 10,
                        y: 10
                    }
                ],
                movingNode: {
                    target: null,
                    offsetX: null,
                    offsetY: null
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
            handleNodeMouseUp(node) {
                this.movingNode.target = null;
            },
            handleChartMouseMove(event) {
                let element = document.getElementById('chart');
                this.cursorToChartOffset.x = event.pageX - element.offsetLeft;
                this.cursorToChartOffset.y = event.pageY - element.offsetTop;
                if (this.movingNode.target) {
                    this.movingNode.target.x = this.cursorToChartOffset.x - this.movingNode.offsetX;
                    this.movingNode.target.y = this.cursorToChartOffset.y - this.movingNode.offsetY;
                }
            }
        }
    }
</script>
<style scoped>
    #toolbar {
        margin-bottom: 10px;
    }

    #canvas {
        border: 1px solid #e6e6e6;
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
        border: 1px solid #e6e6e6;
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

    #position {
        position: absolute;
        right: 0;
        top: 0;
    }
</style>
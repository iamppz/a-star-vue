<template>
    <div>
        <div id="toolbar">
            <el-button type="primary" @click="add(10, 10)">添加节点</el-button>
            <!-- {{ hoveredConnection }} -->
        </div>
        <div
                id="chart"
                @mousemove="handleChartMouseMove"
                @mouseup="handleChartMouseUp"
                @dblclick="handleChartDblClick($event)"
                :style="{ cursor: cursor }"
        >
            <span id="position">{{ cursorToChartOffset.x + ', ' + cursorToChartOffset.y }}</span>
            <canvas id="canvas" width="800" height="600"/>
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
                    <template v-for="position in ['top', 'bottom', 'left', 'right']">
                        <div
                                :key="'connection-' + position"
                                :class="{
                                'node-connector': true,
                                'node-connector-top': position === 'top',
                                'node-connector-bottom': position === 'bottom',
                                'node-connector-left': position === 'left',
                                'node-connector-right': position === 'right'
                            }"
                                @mouseup="handleNodeConnectorMouseUp(node, position, $event)"
                                @mousedown.stop="handleNodeConnectorMouseDown(node, position, $event)"
                                @mousemove.stop="handleNodeConnectorMouseMove(node, position, $event)"
                        ></div>
                    </template>
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
                        <el-input v-model="nodeForm.name"/>
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
        <el-dialog
                title="编辑"
                :visible.sync="connectionDialogVisible"
                width="440px"
                :before-close="handleClickCancelSaveConnection"
        >
            <el-form ref="form" :model="connectionForm" label-width="80px">
                <el-form-item label="类型">
                    <el-select
                            v-model="connectionForm.type"
                            placeholder="请选择"
                            style="width: 100%;"
                    >
                        <el-option
                                v-for="item in [
                                { name: '通过', id: 'pass' },
                                { name: '条件', id: 'condition' },
                                { name: '驳回', id: 'reject' }
                            ]"
                                :key="'connection-type-' + item.id"
                                :label="item.name"
                                :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClickCancelSaveConnection">取消</el-button>
                <el-button type="primary" @click="handleClickSaveConnection">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
  import {lineTo, arrow2, clearCanvas, fillRect} from '../../utils/canvas';
  import {getOffsetLeft, getOffsetTop} from '../../utils/dom';
  import {between, distanceOfPointToLine} from '../../utils/math';
  import DrawerWrapper from '../../components/DrawerWrapper';
  import '../../assets/flowchart.css';

  export default {
    data() {
      return {
        nodes: [
          {id: 1, x: 140, y: 270, name: '开始', type: 'start'},
          {id: 2, x: 540, y: 270, name: '结束', type: 'end'},
        ],
        connections: [
          {
            source: {id: 1, position: 'right'},
            destination: {id: 2, position: 'left'},
            id: 1,
            type: 'pass',
          },
        ],
        movingInfo: {target: null, offsetX: null, offsetY: null},
        connectingInfo: {source: null, sourcePosition: null, sourceX: null, sourceY: null},
        currentNode: null,
        /**
         * Mouse position(relative to chart div)
         */
        cursorToChartOffset: {x: 0, y: 0},
        nodeDialogVisible: false,
        nodeForm: {name: null, id: null, type: null},
        connectionDialogVisible: false,
        connectionForm: {
          type: null,
          sourceId: null,
          sourcePosition: null,
          destinationId: null,
          destinationPosition: null,
        },
        /**
         * lines of all connections
         */
        lines: [],
      };
    },
    components: {DrawerWrapper},
    methods: {
      add(x, y) {
        this.nodes.push({id: +new Date(), x: x, y: y, name: '新建节点', type: 'operation'});
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
          let offset = this.getNodeConnectorOffset(
              this.connectingInfo.source.id,
              this.connectingInfo.sourcePosition,
          );
          this.arrowTo(
              offset.x,
              offset.y,
              this.cursorToChartOffset.x,
              this.cursorToChartOffset.y,
              this.connectingInfo.sourcePosition,
          );
        }
      },
      handleChartMouseUp() {
        if (this.connectingInfo.source) {
          this.connectingInfo.source = null;
          this.connectingInfo.sourcePosition = null;
          this.refresh();
          return;
        }

        if (this.hoveredConnection != null) {
          this.$confirm('是否删除该连线?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            this.connections.splice(this.connections.indexOf(this.hoveredConnection), 1);
            this.refresh();
          });
        }
      },
      handleChartDblClick(event) {
        let element = document.getElementById('chart');
        let x = event.pageX - getOffsetLeft(element) - 60;
        let y = event.pageY - getOffsetTop(element) - 30;
        this.add(x, y);
      },
      handleNodeConnectorMouseDown(sourceNode, position) {
        if (sourceNode.type === 'end') {
          return;
        }
        this.connectingInfo.source = sourceNode;
        this.connectingInfo.sourcePosition = position;
      },
      handleNodeConnectorMouseMove(node, position) {
        if (this.connectingInfo.source) {
          this.refresh();
          let sourceOffset = this.getNodeConnectorOffset(
              this.connectingInfo.source.id,
              this.connectingInfo.sourcePosition,
          );
          let destinationOffset = this.getNodeConnectorOffset(node.id, position);
          this.arrowTo(
              sourceOffset.x,
              sourceOffset.y,
              destinationOffset.x,
              destinationOffset.y,
              this.connectingInfo.sourcePosition,
              position,
          );
        }
      },
      handleNodeConnectorMouseUp(destination, position) {
        if (this.connectingInfo.source) {
          if (this.connectingInfo.source.id !== destination.id) {
            // Node can't connect to itself
            let tempId = +new Date();
            this.connections.push({
              source: {
                id: this.connectingInfo.source.id,
                position: this.connectingInfo.sourcePosition,
              },
              destination: {id: destination.id, position: position},
              id: tempId,
            });
            this.refresh();

            this.connectionForm.sourceId = this.connectingInfo.source.id;
            this.connectionForm.sourcePosition = this.connectingInfo.sourcePosition;
            this.connectionForm.destinationId = destination.id;
            this.connectionForm.destinationPosition = position;
            this.connectionForm.id = tempId;
            this.connectionForm.type = 'pass';
            this.connectionDialogVisible = true;
          }
        }
      },
      refresh() {
        clearCanvas('canvas');
        this.lines = [];
        this.connections.forEach(conn => {
          let sourcePosition = this.getNodeConnectorOffset(
              conn.source.id,
              conn.source.position,
          );
          let destinationPosition = this.getNodeConnectorOffset(
              conn.destination.id,
              conn.destination.position,
          );
          let lines = this.arrowTo(
              sourcePosition.x,
              sourcePosition.y,
              destinationPosition.x,
              destinationPosition.y,
              conn.source.position,
              conn.destination.position,
              {
                pass: '#52c41a',
                reject: 'red',
                condition: 'orange',
              }[conn.type],
          );
          for (const line of lines) {
            this.lines.push({
              sourceX: line.sourceX,
              sourceY: line.sourceY,
              destinationX: line.destinationX,
              destinationY: line.destinationY,
              id: conn.id,
            });
          }
        });
      },
      getNodeConnectorOffset(nodeId, connectorPosition) {
        let nodeElement = document.getElementsByName('node-' + nodeId)[0];
        let connector = nodeElement.querySelector('.node-connector-' + connectorPosition);
        let chartElement = document.getElementById('chart');
        return {
          x: getOffsetLeft(connector) - getOffsetLeft(chartElement) + 3,
          y: getOffsetTop(connector) - getOffsetTop(chartElement) + 3,
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
      arrowTo(x1, y1, x2, y2, startPosition, endPosition, color) {
        return arrow2(
            'canvas',
            x1,
            y1,
            x2,
            y2,
            startPosition,
            endPosition,
            1,
            color || '#a3a3a3',
        );
      },
      handleClickSaveConnection() {
        let connection = this.connections.filter(conn => conn.id === this.connectionForm.id)[0];
        connection.type = this.connectionForm.type;
        this.refresh();
        this.connectionDialogVisible = false;
      },
      handleClickCancelSaveConnection() {
        this.connectionDialogVisible = false;
        let connection = this.connections.filter(conn => conn.id === this.connectionForm.id)[0];
        this.connections.splice(this.connections.indexOf(connection), 1);
        this.refresh();
      },
    },
    mounted() {
      let that = this;
      that.refresh();
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
    },
    computed: {
      hoveredConnection() {
        for (const line of this.lines) {
          let distance = distanceOfPointToLine(
              line.sourceX,
              line.sourceY,
              line.destinationX,
              line.destinationY,
              this.cursorToChartOffset.x,
              this.cursorToChartOffset.y,
          );
          if (
              distance < 5 &&
              between(line.sourceX - 2, line.destinationX + 2, this.cursorToChartOffset.x) &&
              between(line.sourceY - 2, line.destinationY + 2, this.cursorToChartOffset.y)
          ) {
            let connections = this.connections.filter(item => item.id === line.id);
            return connections.length > 0 ? connections[0] : null;
          }
        }
        return null;
      },
      cursor() {
        if (this.connectingInfo.source) {
          return 'crosshair';
        }
        return this.hoveredConnection != null ? 'pointer' : null;
      },
    },
  };
</script>

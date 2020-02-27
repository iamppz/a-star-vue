<template>
    <div>
        <flow-chart v-if="loaded" :nodes="nodes" :connections="connections"
                    @editnode="handleEditNode"
                    @save="handleChartSave"></flow-chart>
        <el-dialog title="编辑"
                   :visible.sync="nodeDialogVisible"
                   width="440px"
                   :before-close="handleClickCancelSaveNode"
        >
            <el-form ref="form" :model="nodeForm" label-width="80px">
                <el-form-item label="名称">
                    <el-input v-model="nodeForm.name"/>
                </el-form-item>
                <el-form-item label="类型">
                    <el-select v-model="nodeForm.type"
                               placeholder="请选择"
                               style="width: 100%;"
                    >
                        <el-option :key="'node-type-' + item.id"
                                   v-for="item in [ { name: '开始', id: 'start' }, { name: '结束', id: 'end' }, { name: '审批', id: 'operation' } ]"
                                   :label="item.name"
                                   :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClickCancelSaveNode">取消</el-button>
                <el-button type="primary" @click="handleClickSaveNode">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
  import FlowChart from '../../../components/FlowChart';
  import processService from '../../../service/processService';
  import {Message} from 'element-ui';

  export default {
    components: {FlowChart},
    data: function() {
      return {
        nodes: [],
        connections: [],
        loaded: false,
        nodeDialogVisible: false,
        nodeForm: {name: null, id: null, type: null},
        editingInfo: {
          target: null,
        },
      };
    },
    async mounted() {
      const response = await processService.getNodes(1);
      if (response.data.success) {
        this.nodes = response.data.data.map(item => {
          return {
            id: item.id,
            x: item.x || 0,
            y: item.y || 0,
            name: item.name,
            type: item.state,
            approverIds: item.approverIds,
          };
        });
        let that = this;
        response.data.data.forEach(item => {
          item.transitions.forEach(transition => {
            that.connections.push({
              source: {id: transition.source, position: transition.sourcePosition || 'right'},
              destination: {
                id: transition.destination,
                position: transition.destinationPosition || 'left',
              },
              id: transition.id,
              type: transition.type,
              name: transition.name,
              expression: transition.expression,
            });
          });
        });
        this.loaded = true;
      }
    },
    methods: {
      async handleChartSave(nodes, connections) {
        let data = nodes.map(node => {
          let result = {
            id: node.id,
            x: node.x || 0,
            y: node.y || 0,
            name: node.name,
            state: node.type,
            approverIds: node.approverIds,
            processDefinitionId: 1,
          };
          result.transitions = connections.filter(conn => conn.source.id === node.id).map(conn => {
            return {
              source: conn.source.id,
              destination: conn.destination.id,
              type: conn.type,
              sourcePosition: conn.source.position,
              destinationPosition: conn.destination.position,
              name: conn.name,
              expression: conn.expression,
            };
          });
          return result;
        });
        let resp = await processService.saveNodes(data);
        if (resp.data.success) {
          Message.success('保存成功');
        } else {
          Message.error('保存失败');
        }
      },
      handleEditNode(node) {
        this.nodeForm.id = node.id;
        this.nodeForm.name = node.name;
        this.nodeForm.type = node.type;
        this.nodeDialogVisible = true;
        this.editingInfo.target = node;
      },
      handleClickSaveNode() {
        let that = this;
        this.editingInfo.target.name = that.nodeForm.name;
        this.editingInfo.target.type = that.nodeForm.type;
        this.nodeDialogVisible = false;
      },
      handleClickCancelSaveNode() {
        this.nodeDialogVisible = false;
      },
    },
  };
</script>
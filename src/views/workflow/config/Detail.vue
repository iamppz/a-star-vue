<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/app/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>系统设置</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/app/workflow/config/list' }">
                流程设置
            </el-breadcrumb-item>
            <el-breadcrumb-item>详情</el-breadcrumb-item>
        </el-breadcrumb>
        <el-tabs v-model="tab" id="tab">
            <el-tab-pane label="表单设计" name="form">
                <dynamic-form :form-id="1"></dynamic-form>
            </el-tab-pane>
            <el-tab-pane label="流程设置" name="chart">
                <flow-chart v-if="loaded" :nodes="nodes" :connections="connections"
                            @editnode="handleEditNode" @editconnection="handleEditConnection"
                            @save="handleChartSave">
                </flow-chart>
                <flow-chart-node-dialog :visible.sync="nodeDialogVisible"
                                        :node.sync="editingInfo.target">
                </flow-chart-node-dialog>
                <flow-chart-connection-dialog :visible.sync="connectionDialogVisible"
                                              :connection.sync="connectionEditingInfo.target"
                                              :operation="connectionEditingInfo.operations">
                </flow-chart-connection-dialog>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
  import FlowChart from '../../../components/flowchart/joyce/general/FlowChart';
  import processService from '../../../service/processService';
  import {Message} from 'element-ui';
  import FlowChartNodeDialog from '../../../components/flowchart/joyce/FlowChartNodeDialog';
  import FlowChartConnectionDialog
    from '../../../components/flowchart/joyce/FlowChartConnectionDialog';
  import DynamicForm from '../../../components/form/DynamicForm';

  export default {
    components: {DynamicForm, FlowChartConnectionDialog, FlowChartNodeDialog, FlowChart},
    data: function() {
      return {
        nodes: [],
        connections: [],
        loaded: false,
        editingInfo: {target: null},
        connectionEditingInfo: {target: null},
        nodeDialogVisible: false,
        connectionDialogVisible: false,
        tab: 'form',
      };
    },
    async mounted() {
      const response = await processService.getNodes(this.$route.query.id);
      if (response.data.success) {
        this.nodes = response.data.data.map(item => {
          return {
            id: item.id,
            x: item.x || 0,
            y: item.y || 0,
            name: item.name,
            type: item.state,
            approvers: item.approvers,
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
            approvers: node.approvers,
            processDefinitionId: this.$route.query.id,
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
        this.editingInfo.target = node;
        this.nodeDialogVisible = true;
      },
      handleEditConnection(connection) {
        this.connectionEditingInfo.target = connection;
        this.connectionDialogVisible = true;
      },
    },
  };
</script>
<style>
    #tab {
        margin-top: 20px;
    }
</style>
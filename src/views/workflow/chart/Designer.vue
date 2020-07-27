<template>
  <div>
    <flowchart
      v-if="loaded"
      :nodes="nodes"
      :connections="connections"
      @editnode="handleEditNode"
      @editconnection="handleEditConnection"
      @save="handleChartSave"
    >
    </flowchart>
    <flow-chart-node-dialog
      :visible.sync="nodeDialogVisible"
      :node.sync="editingInfo.target"
    >
    </flow-chart-node-dialog>
    <flow-chart-connection-dialog
      :visible.sync="connectionDialogVisible"
      :connection.sync="connectionEditingInfo.target"
      :operation="connectionEditingInfo.operations"
    >
    </flow-chart-connection-dialog>
  </div>
</template>
<script>
import Vue from "vue";
import processService from "../../../service/processService";
import { Message } from "element-ui";
import FlowChartNodeDialog from "../../../components/flowchart/joyce/FlowChartNodeDialog";
import FlowChartConnectionDialog from "../../../components/flowchart/joyce/FlowChartConnectionDialog";
import Flowchart from "flowchart-vue";

Vue.use(Flowchart);

export default {
  components: {
    FlowChartConnectionDialog,
    FlowChartNodeDialog
  },
  data: function() {
    return {
      nodes: [],
      connections: [],
      loaded: false,
      editingInfo: { target: null },
      connectionEditingInfo: { target: null },
      nodeDialogVisible: false,
      connectionDialogVisible: false,
      tab: "form"
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
          approvers: item.approvers
        };
      });
      let that = this;
      response.data.data.forEach(item => {
        item.transitions.forEach(transition => {
          that.connections.push({
            source: {
              id: transition.source,
              position: transition.sourcePosition || "right"
            },
            destination: {
              id: transition.destination,
              position: transition.destinationPosition || "left"
            },
            id: transition.id,
            type: transition.type,
            name: transition.name,
            expression: transition.expression
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
          processDefinitionId: this.$route.query.id
        };
        result.transitions = connections
          .filter(conn => conn.source.id === node.id)
          .map(conn => {
            return {
              source: conn.source.id,
              destination: conn.destination.id,
              type: conn.type,
              sourcePosition: conn.source.position,
              destinationPosition: conn.destination.position,
              name: conn.name,
              expression: conn.expression
            };
          });
        return result;
      });
      let resp = await processService.saveNodes(data);
      if (resp.data.success) {
        Message.success("保存成功");
      } else {
        Message.error("保存失败");
      }
    },
    handleEditNode(node) {
      this.editingInfo.target = node;
      this.nodeDialogVisible = true;
    },
    handleEditConnection(connection) {
      this.connectionEditingInfo.target = connection;
      this.connectionDialogVisible = true;
    }
  },
  computed: {
    formDesignerHeight() {
      return window.innerHeight - 190 + "px";
    }
  }
};
</script>
<style>
#tab {
  margin-top: 20px;
}
</style>

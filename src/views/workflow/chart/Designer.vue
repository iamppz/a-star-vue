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
    <node-dialog :visible.sync="nodeDialogVisible" :node.sync="nodeForm.target">
    </node-dialog>
    <connection-dialog
      :visible.sync="connectionDialogVisible"
      :connection.sync="connectionForm.target"
      :operation="connectionForm.operation"
    >
    </connection-dialog>
  </div>
</template>
<script>
import Vue from "vue";
import processService from "../../../service/processService";
import { Message } from "element-ui";
import NodeDialog from "../../../components/NodeDialog";
import ConnectionDialog from "../../../components/ConnectionDialog";
import Flowchart from "flowchart-vue";

Vue.use(Flowchart);

export default {
  components: {
    NodeDialog,
    ConnectionDialog
  },
  data: function() {
    return {
      nodes: [],
      connections: [],
      loaded: false,
      nodeForm: { target: null },
      connectionForm: { target: null, operation: null },
      nodeDialogVisible: false,
      connectionDialogVisible: false
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
      this.nodeForm.target = node;
      this.nodeDialogVisible = true;
    },
    handleEditConnection(connection) {
      this.connectionForm.target = connection;
      this.connectionDialogVisible = true;
    }
  }
};
</script>

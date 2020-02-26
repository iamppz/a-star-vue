<template>
    <div>
        <flow-chart v-if="loaded" :nodes="nodes" :connections="connections"
                    @save="handleChartSave"></flow-chart>
    </div>
</template>
<script>
  import FlowChart from '../../../components/FlowChart';
  import processService from '../../../service/processService';

  export default {
    components: {FlowChart},
    data: function() {
      return {
        nodes: [],
        connections: [],
        loaded: false,
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
      handleChartSave(nodes, connections) {
        nodes.forEach(node => {
          node.transitions = connections.map(conn => {
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
        });
      },
    },
  };
</script>
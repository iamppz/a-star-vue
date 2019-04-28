<template>
    <div style="position: relative;">
        <div class="flow-design">
            <div class="zoom">
                <div class="zoom-out"></div>
                <span>100%</span>
                <div class="zoom-in"></div>
            </div>
            <div class="box-scale" id="box-scale" style="transform: scale(1); transform-origin: 50% 0px 0px;">
                <template v-if="nodes.length > 0">
                    <start-node :node="startNode"></start-node>
                </template>
            </div>
        </div>
    </div>
</template>
<script>
    import processService from "../../service/processService";
    import StartNode from "./StartNode";

    export default {
        components: {StartNode},
        async mounted() {
            let resp = await processService.getNodes(this.$route.query.def || 1);
            if (resp.data.success) {
                this.nodes = resp.data.data;
            }
        },
        data() {
            return {
                nodes: []
            };
        },
        computed: {
            startNode() {
                return this.nodes.find(node => node.state === 'start');
            }
        }
    }
</script>
<style scoped src="../../assets/flow-design.css"></style>
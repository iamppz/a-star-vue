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
                    <node :node="startNode"></node>
                </template>
                <div class="end-node">
                    <div class="end-node-circle"></div>
                    <div class="end-node-text">流程结束</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import processService from "../../service/processService";
    import Node from "./Node";

    export default {
        components: {Node},
        async mounted() {
            let resp = await processService.getNodes(1);
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
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
                    <start :node="startNode"></start>
                </template>
            </div>
        </div>
    </div>
</template>
<script>
    import processService from "../../service/processService";
    import Start from "./Start";
    import {pathing} from "../../utils/process";


    export default {
        components: {Start},
        async mounted() {
            let resp = await processService.getNodes(this.$route.query.def || 1);
            if (resp.data.success) {
                this.nodes = resp.data.data;
            }
            pathing(this.startNode);
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
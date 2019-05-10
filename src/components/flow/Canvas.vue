<template>
    <div style="position: relative;">
        <el-button @click="save">Save</el-button>
        <div class="flow-design">
            <div class="zoom">
                <div class="zoom-out"></div>
                <span>100%</span>
                <div class="zoom-in"></div>
            </div>
            <div class="box-scale" id="box-scale" style="transform: scale(1); transform-origin: 50% 0 0;">
                <template v-if="startNode">
                    <start :node="startNode"></start>
                </template>
            </div>
        </div>
    </div>
</template>
<script>
    import {Message} from "element-ui";

    import processService from "../../service/processService";
    import Start from "./Start";

    export default {
        components: {Start},
        async mounted() {
            let resp = await processService.getNodes(this.$route.query.def || 1);
            if (resp.data.success) {
                let nodes = resp.data.data;
                this.startNode = nodes.find(node => node.state === 'start');
                let setSrcAndDest = (transition) => {
                    for (let i = 0; i < transition.destination.transitions.length; i++) {
                        let nextTransition = transition.destination.transitions[i];
                        if (typeof nextTransition.source !== 'number') {
                            continue;
                        }

                        nextTransition.source = nodes.find(node => node.id === nextTransition.source);
                        nextTransition.destination = nodes.find(node => node.id === nextTransition.destination);
                        setSrcAndDest(nextTransition);
                    }
                };

                this.startNode.transitions.forEach(transition => {
                    transition.source = nodes.find(node => node.id === transition.source);
                    transition.destination = nodes.find(node => node.id === transition.destination);
                    if (transition.destination.transitions.length > 0) {
                        setSrcAndDest(transition);
                    }
                });
            }
        },
        data() {
            return {
                startNode: null
            };
        },
        methods: {
            async save() {
                let resp = await processService.saveNodes(this.startNode);
                if (resp.data.success) {
                    Message.success(resp.data.message);
                }
            }
        }
    }
</script>
<style scoped src="../../assets/flow-design.css"></style>
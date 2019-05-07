<template>
    <div style="position: relative;">
        <el-button @click="save">Save</el-button>
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

    export default {
        components: {Start},
        async mounted() {
            let resp = await processService.getNodes(this.$route.query.def || 1);
            if (resp.data.success) {
                this.nodes = resp.data.data;
            }
            let setFrom = (transition) => {
                if (transition.to.transitions.length > 0) {
                    for (let i = 0; i < transition.to.transitions.length; i++) {
                        let nextTransition = transition.to.transitions[i];
                        nextTransition.from = transition.to;
                        setFrom(nextTransition);
                    }
                }
            };

            this.startNode.transitions.forEach(transition => {
                transition.from = this.startNode;
                setFrom(transition);
            });
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
        },
        methods: {
            save() {
                console.log(JSON.stringify(this.startNode, function (key, value) {
                    if (key === 'from') {
                        return null;
                    }
                    return value;
                }));
            }
        }
    }
</script>
<style scoped src="../../assets/flow-design.css"></style>
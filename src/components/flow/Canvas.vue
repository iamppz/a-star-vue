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
    import _ from "lodash";


    export default {
        components: {Start},
        async mounted() {
            let resp = await processService.getNodes(this.$route.query.def || 1);
            if (resp.data.success) {
                this.nodes = resp.data.data;
            }

            this.pathing(this.startNode);
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
            pathing(node) {
                let func = (paths, basePath, transition) => {
                    basePath.push(transition.to);
                    // 基础路径
                    const basePathMirror = JSON.parse(JSON.stringify(basePath));
                    if (transition.to.transitions.length > 0) {
                        for (let i = 0; i < transition.to.transitions.length; i++) {
                            let next = transition.to.transitions[i];
                            let currentPath;
                            if (i > 0) {
                                // 从第二条路径起，需要重新克隆基础路径，并添加进路径结果集
                                currentPath = JSON.parse(JSON.stringify(basePathMirror));
                                paths.push(currentPath);
                            } else {
                                currentPath = basePath;
                            }
                            func(paths, currentPath, next);
                        }
                    }
                };

                const result = node.transitions.map(transition => {
                    let path = [transition.from];
                    let paths = [path];
                    func(paths, path, transition);
                    return paths;
                });
                console.log(_.flatten(result).map(path => path.map(node => node.id)));
                return _.flatten(result);
            }
        }
    }
</script>
<style scoped src="../../assets/flow-design.css"></style>
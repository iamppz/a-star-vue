<template>
    <div>
        <div class="branch-wrap">
            <div class="branch-box-wrap">
                <div class="branch-box">
                    <template v-for="(transition, index) in transitions">
                        <div class="col-box" v-bind:key="transition.id">
                            <condition :transition="transition"></condition>
                            <div :class="{'top-left-cover-line': index === 0, 'top-right-cover-line': index === transitions.length - 1}"></div>
                            <div :class="{'bottom-left-cover-line': index === 0, 'bottom-right-cover-line': index === transitions.length - 1}"></div>
                            <template v-if="transition.to.id !== innerIntersection.id">
                                <operation :node="transition.to" :intersection="innerIntersection"></operation>
                            </template>
                        </div>
                    </template>
                </div>
                <toolbar :btn-add-condition-visible="true" :source="endings" :destination="innerIntersection"></toolbar>
            </div>
        </div>
        <template v-if="innerIntersection.state === 'end'">
            <end></end>
        </template>
        <template v-else-if="intersection === null || intersection.id !== innerIntersection.id">
            <operation :node="innerIntersection" :intersection="intersection"></operation>
        </template>
    </div>
</template>
<script>
    import Toolbar from './Toolbar';
    import Condition from './Condition';
    import Operation from "./Operation";
    import End from "./End";
    import {pathing} from "../../utils/process";


    export default {
        components: {Toolbar, Condition, Operation, End},
        props: {
            transitions: {
                type: Array,
                default: () => []
            },
            intersection: {
                type: Object,
                default: null
            }
        },
        computed: {
            /**
             * 分支需计算出汇合点，将汇合点传递给分支中的节点
             * 以便在递归到该节点时，停止继续向下渲染
             * @returns 分支汇合点
             */
            innerIntersection() {
                // 对分支中的路径进行采样
                let paths = [];
                for (let i = 0; i < 2; i++) {
                    let transition = this.transitions[i],
                        path = [];
                    while (transition) {
                        path.push(transition.to);
                        transition = transition.to.transitions.length > 0 ? transition.to.transitions[0] : null;
                    }
                    paths.push(path);
                }

                // 两条路径中最早同时出现的节点即为汇合点
                // 如 1, 2, 3, 5 和 1, 3, 5，则 3 为汇合点
                return paths[0].find(t => {
                    let find = paths[1].find(r => r.id === t.id);
                    return find !== undefined && find !== null;
                });
            },
            endings() {
                let paths = pathing(this.transitions[0].from);
                let result = paths.map(path => {
                    let intersection = path.find(node => node.id === this.innerIntersection.id);
                    return path.slice().reverse().find(node => path.indexOf(node) < path.indexOf(intersection));
                });
                console.log("endings: ");
                console.log(result.map(n => n.id));
                return result;
            }
        }
    }
</script>
<style scoped src="../../assets/flow-design.css"></style>
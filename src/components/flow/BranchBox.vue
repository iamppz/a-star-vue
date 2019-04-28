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
                            <template v-if="transition.to.state !== 'end' && (intersection == null || transition.to.id !== intersection.id)">
                                <node :node="transition.to" :intersection="intersection"></node>
                            </template>
                        </div>
                    </template>
                </div>
                <button-box :btn-add-condition-visible="true"></button-box>
            </div>
        </div>
        <template v-if="intersection">
            <node :node="intersection" :intersection="parentIntersection"></node>
        </template>
    </div>
</template>
<script>
    import ButtonBox from './ButtonBox';
    import Condition from './Condition';
    import Node from "./Node";

    export default {
        components: {Node, ButtonBox, Condition},
        props: {
            transitions: {
                type: Array,
                default: () => []
            },
            parentIntersection: {
                type: Array,
                default: null
            }
        },
        computed: {
            intersection() {
                let paths = [];
                for (let i = 0; i < 2; i++) {
                    let transition = this.transitions[i],
                        path = [];
                    while (transition.to.state !== 'end') {
                        path.push(transition.to);
                        transition = transition.to.transitions[0];
                    }
                    paths.push(path);
                }

                return paths[0].find(t => {
                    let find = paths[1].find(r => r.id === t.id);
                    return find !== undefined && find !== null;
                });
            }
        }
    }
</script>
<style scoped src="../../assets/flow-design.css"></style>
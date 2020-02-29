<template>
    <div>
        <div class="branch-wrap">
            <div class="branch-box-wrap">
                <div class="branch-box">
                    <template v-for="(transition, index) in transitions">
                        <condition v-bind:key="transition.id" :transitions="transitions" :index="index"
                                   :intersection="innerIntersection" @onremove="onConditionRemove"></condition>
                    </template>
                </div>
                <toolbar :btn-add-condition-visible="true" :source="endings" :destination="[innerIntersection]"
                         @onnodecreated="onToolbarSave"></toolbar>
            </div>
        </div>
        <template v-if="innerIntersection.state === 'end'">
            <end></end>
        </template>
        <template v-else-if="intersection === null || intersection.id !== innerIntersection.id">
            <operation :node="innerIntersection" :intersection="intersection" @onremove="onNextRemove"></operation>
        </template>
    </div>
</template>
<script>
    import {Message} from "element-ui";

    import Toolbar from './Toolbar';
    import Condition from './Condition';
    import Operation from "./Operation";
    import End from "./End";
    import {getIntersection, pathing} from "../../../utils/process";
    import _ from 'lodash';

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
        methods: {
            onToolbarSave(node) {
                this.$set(node, 'transitions', [{
                    name: 'Default',
                    source: node,
                    destination: this.innerIntersection,
                    expression: null
                }]);
                this.endings.forEach(item => {
                    let root = this.transitions[0].source;
                    let transitions = item === root
                        ? item.transitions.filter(item => item.destination === this.innerIntersection)
                        : item.transitions;
                    transitions.forEach(item => {
                        item.destination = node;
                    });
                });
            },
            onConditionRemove(transition) {
                this.$emit('onconditionremove', transition);
            },
            onNextRemove() {
                if (this.innerIntersection.transitions.length > 1) {
                    Message.error('不可删除，分支条件无法直连分支条件');
                    return;
                }

                let innerIntersectionCopy = Object.assign({}, this.innerIntersection);
                this.endings.forEach(item => {
                    let root = this.transitions[0].source;
                    let transitions = item === root
                        ? item.transitions.filter(item => item.destination === this.innerIntersection)
                        : item.transitions;
                    transitions.forEach(item => {
                        item.destination = innerIntersectionCopy.transitions[0].destination;
                    });
                });
            }
        },
        computed: {
            innerIntersection() {
                return getIntersection(this.transitions);
            },
            endings() {
                let paths = pathing(this.transitions[0].source);
                let result = paths.map(path => {
                    let intersection = path.find(node => node.id === this.innerIntersection.id);
                    return path.slice().reverse().find(node => path.indexOf(node) < path.indexOf(intersection));
                });
                return _.uniqBy(result, item => item.id);
            }
        }
    }
</script>
<style scoped src="../../../assets/flow-design.css"></style>
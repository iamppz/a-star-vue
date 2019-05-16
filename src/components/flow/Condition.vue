<template>
    <div class="col-box">
        <div class="condition-node">
            <div class="condition-node-box">
                <div class="auto-judge">
                    <div class="title-wrapper">
                        <span class="editable-title">{{transition.name}}</span>
                        <span class="priority-title">{{'分支'}}</span>
                        <i class="anticon anticon-close close"></i>
                    </div>
                    <div class="content">{{transition.expression || '无条件'}}</div>
                </div>
                <toolbar :source="[transition.source]" :destination="[transition.destination]"
                         @onnodecreated="onToolbarSave"></toolbar>
            </div>
        </div>
        <div :class="{'top-left-cover-line': index === 0, 'top-right-cover-line': index === transitions.length - 1}"></div>
        <div :class="{'bottom-left-cover-line': index === 0, 'bottom-right-cover-line': index === transitions.length - 1}"></div>
        <template v-if="transition.destination.id !== intersection.id">
            <operation :node="transition.destination" :intersection="intersection" @onremove="onNextRemove"></operation>
        </template>
    </div>
</template>
<script>
    import {Message} from "element-ui";

    import Toolbar from "./Toolbar";
    import Operation from "./Operation";

    export default {
        components: {
            Toolbar,
            Operation
        },
        name: 'condition',
        props: {
            intersection: {
                type: Object,
                default: null
            },
            index: {
                type: Number,
                default: null
            },
            transitions: {
                type: Array,
                default: () => []
            }
        },
        methods: {
            onToolbarSave(node) {
                this.$set(node, 'transitions', [{
                    name: 'Default',
                    source: node,
                    destination: this.transition.destination,
                    expression: null
                }]);
                this.transition.destination = node;
            },
            onNextRemove() {
                if (this.transition.destination.transitions.length > 1) {
                    Message.error('不可删除，分支条件无法直连分支条件');
                    return;
                }

                this.transition.destination = this.transition.destination.transitions[0].destination;
            }
        },
        computed: {
            transition() {
                return this.transitions[this.index];
            }
        }
    }
</script>
<style scoped src="../../assets/flow-design.css"></style>
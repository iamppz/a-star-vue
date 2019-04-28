<template>
    <div>
        <div class="node-wrap">
            <div class="node-wrap-box start-node">
                <div>
                    <div class="title">
                        <span class="">发起人</span>
                    </div>
                    <div class="content">
                        <div class="text">{{ node.name }}</div>
                        <i class="anticon anticon-right arrow"></i>
                    </div>
                </div>
            </div>
            <button-box :btn-add-condition-visible="true"></button-box>
        </div>
        <template v-if="showNextBranch">
            <branch-box :transitions="node.transitions"></branch-box>
        </template>
        <template v-else>
            <template v-if="node.transitions[0].to.state === 'end'">
                <end-node></end-node>
            </template>
            <template v-else>
                <operation-node :node="node.transitions[0].to"></operation-node>
            </template>
        </template>
    </div>
</template>
<script>
    import ButtonBox from "./ButtonBox";
    import OperationNode from './OperationNode';
    import EndNode from './EndNode';

    export default {
        name: 'node',
        components: {ButtonBox, OperationNode, EndNode},
        props: {
            node: {
                type: Object,
                default: null
            }
        },
        beforeCreate: function () {
            this.$options.components.BranchBox = () => import('./BranchBox.vue')
        },
        computed: {
            showNextBranch() {
                // 当节点后有多个节点时，显示为分支
                return this.node.transitions.length > 1;
            }
        }
    }
</script>
<style scoped src="../../assets/flow-design.css"></style>
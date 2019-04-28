<template>
    <div>
        <div class="node-wrap">
            <div class="node-wrap-box">
                <div>
                    <div class="title">
                        <span class="iconfont"></span>
                        <span class="editable-title">审批人</span>
                        <i class="anticon anticon-close close"></i>
                    </div>
                    <div class="content">
                        <div class="text">{{ node.name }}</div>
                        <i class="anticon anticon-right arrow"></i>
                    </div>
                </div>
            </div>
            <button-box :btn-add-condition-visible="true"></button-box>
        </div>
        <template v-if="next === 'branch'">
            <branch-box :transitions="node.transitions" :intersection="intersection"></branch-box>
        </template>
        <template v-else-if="next === 'node'">
            <template v-if="node.transitions[0].to.state === 'end'">
                <end-node></end-node>
            </template>
            <template v-else>
                <operation-node :node="node.transitions[0].to" :intersection="intersection"></operation-node>
            </template>
        </template>
    </div>
</template>
<script>
    import ButtonBox from "./ButtonBox";
    import OperationNode from "./OperationNode";
    import EndNode from "./EndNode";

    export default {
        name: 'node',
        components: {ButtonBox, EndNode, OperationNode},
        props: {
            node: {
                type: Object,
                default: null
            },
            intersection: {
                type: Object,
                default: null
            }
        },
        beforeCreate: function () {
            this.$options.components.BranchBox = () => import('./BranchBox.vue')
        },
        computed: {
            next() {
                if (this.node.transitions.length > 1) {
                    // 当节点后有多个节点时，显示为分支
                    return 'branch';
                } else if (!this.intersection || this.node.transitions[0].to.id !== this.intersection.id) {
                    // （否则）显示为节点，不是汇合节点才进行渲染
                    return 'node';
                }
                return 'nothing';
            }
        }
    }
</script>
<style scoped src="../../assets/flow-design.css"></style>
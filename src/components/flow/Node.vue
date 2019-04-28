<template>
    <div>
        <div class="node-wrap">
            <template>
                <div :class="{'node-wrap-box': true, 'start-node': node.state === 'start'}">
                    <div>
                        <div class="title">
                            <template v-if="node.state === 'start'">
                                <span class="">发起人</span>
                            </template>
                            <template v-if="node.state === 'operation'">
                                <span class="iconfont"></span>
                                <span class="editable-title">审批人</span>
                                <i class="anticon anticon-close close"></i>
                            </template>
                        </div>
                        <div class="content">
                            <div class="text">{{ node.name }}</div>
                            <i class="anticon anticon-right arrow"></i>
                        </div>
                    </div>
                </div>
                <button-box :btn-add-condition-visible="true"></button-box>
            </template>
        </div>
        <template v-if="showNextBranch">
            <branch-box :transitions="node.transitions" :parent-intersection="intersection"></branch-box>
        </template>
        <node v-else-if="showNextNode" :node="node.transitions[0].to"></node>
    </div>
</template>
<script>
    import ButtonBox from "./ButtonBox";

    export default {
        name: 'node',
        components: {ButtonBox},
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
            showNextNode() {
                return this.node.transitions.length === 1
                    && this.node.transitions[0].to.state !== 'end'
                    && this.intersection !== null
                    && this.node.transitions[0].to.id !== this.intersection.id;
            },
            showNextBranch() {
                return this.node.transitions.length > 1;
            }
        }
    }
</script>
<style scoped src="../../assets/flow-design.css"></style>
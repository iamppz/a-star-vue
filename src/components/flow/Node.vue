<template>
    <div v-if="node !== null">
        <div class="node-wrap">
            <template v-if="node.state !== 'end'">
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
                            <div class="text">{{ '此处是描述' }}</div>
                            <i class="anticon anticon-right arrow"></i>
                        </div>
                    </div>
                </div>
            </template>
            <flow-node-add-button-box v-if="node.state !== 'end'" :btn-add-condition-visible="true">
            </flow-node-add-button-box>
        </div>
        <div v-if="node.transitions.length > 1" class="branch-wrap">
            <div class="branch-box-wrap">
                <div class="branch-box">
                    <template v-for="(transition, index) in node.transitions">
                        <div class="col-box" v-bind:key="transition.id">
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
                                    <flow-node-add-button-box></flow-node-add-button-box>
                                </div>
                            </div>
                            <template v-if="index === 0">
                                <div class="top-left-cover-line"></div>
                                <div class="bottom-left-cover-line"></div>
                            </template>
                            <template v-if="index === node.transitions.length - 1">
                                <div class="top-right-cover-line"></div>
                                <div class="bottom-right-cover-line"></div>
                            </template>
                            <node :node="transition.to"></node>
                        </div>
                    </template>
                </div>
                <flow-node-add-button-box :btn-add-condition-visible="true"></flow-node-add-button-box>
            </div>
        </div>
        <node v-if="node.transitions.length === 1" :node="node.transitions[0].to"></node>
    </div>
</template>
<script>
    import FlowNodeAddButtonBox from "./ButtonBox";

    export default {
        name: 'node',
        components: {FlowNodeAddButtonBox},
        props: {
            node: {
                type: Object,
                default: null
            }
        }
    }
</script>
<style scoped src="../../assets/flow-design.css"></style>
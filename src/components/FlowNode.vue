<template>
    <div v-if="node !== null">
        <div class="node-wrap" v-if="node.state === 'start'">
            <div class="node-wrap-box start-node">
                <div>
                    <div class="title" style="background: rgb(87, 106, 149);">
                        <span class="">发起人</span>
                    </div>
                    <div class="content">
                        <div class="text">所有人</div>
                        <i class="anticon anticon-right arrow"></i>
                    </div>
                </div>
            </div>
            <div class="add-node-btn-box">
                <div class="add-node-btn">
                    <button class="btn" type="button">
                        <span class="iconfont"></span>
                    </button>
                </div>
            </div>
        </div>
        <div v-if="node.state === 'operation'" class="node-wrap">
            <div class="node-wrap-box">
                <div>
                    <div class="title" style="background: rgb(255, 148, 62);">
                        <span class="iconfont"></span>
                        <span class="editable-title">审批人</span>
                        <i class="anticon anticon-close close"></i>
                    </div>
                    <div class="content">
                        <div class="text">发起人自选</div>
                        <i class="anticon anticon-right arrow"></i>
                    </div>
                </div>
            </div>
            <div class="add-node-btn-box">
                <div class="add-node-btn">
                    <button class="btn" type="button">
                        <span class="iconfont"></span>
                    </button>
                </div>
            </div>
        </div>
        <div v-if="node.children.length > 1" class="branch-wrap">
            <div class="branch-box-wrap">
                <div class="branch-box">
                    <template v-for="(child, index) in node.children">
                        <div class="col-box" v-bind:key="node.id + '-' + index">
                            <template v-if="index === 0">
                                <div class="top-left-cover-line"></div>
                                <div class="bottom-left-cover-line"></div>
                            </template>
                            <template v-if="index === node.children.length - 1">
                                <div class="top-right-cover-line"></div>
                                <div class="bottom-right-cover-line"></div>
                            </template>
                            <node :node="child"></node>
                        </div>
                    </template>
                </div>
                <div class="add-node-btn-box">
                    <div class="add-node-btn">
                        <button class="btn" type="button"><span class="iconfont"></span></button>
                    </div>
                </div>
            </div>
        </div>
        <node v-if="node.children.length === 1"></node>
    </div>
</template>
<script>
    export default {
        name: 'node',
        props: {
            node: {
                type: Object,
                default: null
            }
        }
    }
</script>
<style scoped src="../assets/flow-design.css"></style>
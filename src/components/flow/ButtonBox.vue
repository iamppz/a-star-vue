<template>
    <div class="add-node-btn-box">
        <div class="add-node-btn">
            <el-popover placement="right">
                <div class="add-node-popover">
                    <div class="add-node-popover-body">
                        <a class="add-node-popover-item approver" v-if="btnAddApproverVisible">
                            <div class="item-wrapper">
                                <span class="iconfont"></span>
                            </div>
                            <p>审批人</p>
                        </a>
                        <a class="add-node-popover-item condition" v-if="btnAddConditionVisible">
                            <div class="item-wrapper">
                                <span class="iconfont"></span>
                            </div>
                            <p>条件分支</p>
                        </a>
                    </div>
                </div>
                <el-button class="btn" slot="reference"><span class="iconfont"></span></el-button>
            </el-popover>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            btnAddApproverVisible: {
                type: Boolean,
                default: true
            },
            btnAddConditionVisible: {
                type: Boolean,
                default: false
            }
        }
    }
</script>
<style scoped src="../../assets/flow-design.css"></style>
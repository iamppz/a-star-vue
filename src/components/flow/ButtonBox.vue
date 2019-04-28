<template>
    <div>
        <div class="add-node-btn-box">
            <div class="add-node-btn">
                <el-popover placement="right" v-model="visible">
                    <div class="add-node-popover">
                        <div class="add-node-popover-body">
                            <a class="add-node-popover-item approver" v-if="btnAddApproverVisible"
                               @click="handleClickAddApprover">
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
        <el-dialog title="收货地址" :visible.sync="dialogApproverVisible" :append-to-body="true" width="500px">
            <el-form :model="approverForm" label-width="80px">
                <el-form-item label="节点名称">
                    <el-input v-model="approverForm.name"></el-input>
                </el-form-item>
                <el-form-item label="审核人">
                    <el-input v-model="approverForm.name"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
            </div>
        </el-dialog>
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
        },
        data() {
            return {
                dialogApproverVisible: false,
                approverForm: {},
                visible: false
            }
        },
        methods: {
            handleClickAddApprover() {
                this.visible = false;
                this.$nextTick(function () {
                    this.dialogApproverVisible = true;
                });
            }
        }
    }
</script>
<style scoped src="../../assets/flow-design.css"></style>
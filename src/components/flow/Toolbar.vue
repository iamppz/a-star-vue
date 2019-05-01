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
                            <a class="add-node-popover-item condition" v-if="btnAddConditionVisible"
                               @click="handleClickAddBranch">
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
        <el-dialog title="新建节点" :visible.sync="dialogApproverVisible" :append-to-body="true" width="500px">
            <operation-form :approver-form="approverForm"></operation-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogApproverVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleClickSaveApprover">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="新建分支" :visible.sync="dialogBranchVisible" :append-to-body="true" width="500px">
            <el-form :model="branchForm" label-width="80px">
                <el-form-item label="名称">
                    <el-input v-model="branchForm.name"></el-input>
                </el-form-item>
                <el-form-item label="表达式">
                    <el-input v-model="branchForm.expression"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogBranchVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogBranchVisible = false">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import OperationForm from "./OperationForm";
    export default {
        components: {OperationForm},
        props: {
            btnAddApproverVisible: {
                type: Boolean,
                default: true
            },
            btnAddConditionVisible: {
                type: Boolean,
                default: false
            },
            source: {
                type: Array,
                default: () => []
            },
            destination: {
                type: Object,
                default: null
            }
        },
        data() {
            return {
                dialogApproverVisible: false,
                dialogBranchVisible: false,
                approverForm: {},
                branchForm: {},
                visible: false
            }
        },
        methods: {
            handleClickAddApprover() {
                this.visible = false;
                this.dialogApproverVisible = true;
                this.approverForm = {};
            },
            handleClickAddBranch() {
                this.visible = false;
                this.dialogBranchVisible = true;
                this.branchForm = {};
            },
            handleClickSaveApprover() {
                this.approverForm.id = 10000;
                this.source.forEach(node => {
                    node.transitions[0].to = this.approverForm;
                });
                this.approverForm.transitions = [{
                    name: 'Default',
                    from: this.approverForm,
                    to: this.destination,
                    expression: null
                }];
                this.dialogApproverVisible = false;
            }
        }
    }
</script>
<style scoped src="../../assets/flow-design.css"></style>
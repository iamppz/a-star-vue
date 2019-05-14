<template>
    <div>
        <div class="node-wrap">
            <div class="node-wrap-box">
                <div>
                    <div class="title">
                        <span class="iconfont"></span>
                        <span class="editable-title">审批人</span>
                        <i class="anticon anticon-close close" @click="remove"></i>
                    </div>
                    <div class="content" @click="handleApproverDivClick">
                        <div class="text">{{ node.name }}</div>
                        <i class="anticon anticon-right arrow"></i>
                    </div>
                </div>
            </div>
            <toolbar :btn-add-condition-visible="true" :source="[node]" @onnodecreated="onToolbarSave"
                     :destination="node.transitions.map(t => t.destination)" @onbranchcreated="onToolbarSaveBranch">
            </toolbar>
        </div>
        <template v-if="node.transitions.length > 1">
            <branch :transitions="node.transitions" :intersection="intersection"></branch>
        </template>
        <template v-else-if="!intersection || node.transitions[0].destination.id !== intersection.id">
            <template v-if="node.transitions[0].destination.state === 'end'">
                <end></end>
            </template>
            <template v-else>
                <operation :node="node.transitions[0].destination" :intersection="intersection"></operation>
            </template>
        </template>
        <el-dialog title="编辑节点" :visible.sync="dialogApproverVisible" :append-to-body="true" width="500px">
            <operation-form :approver-form="approverForm"></operation-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogApproverVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleClickSaveApprover">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import {Message} from "element-ui";

    import Toolbar from "./Toolbar";
    import End from "./End";
    import OperationForm from "./OperationForm";
    import processService from "../../service/processService";
    import {getIntersection, pathing} from "../../utils/process";

    export default {
        name: 'operation',
        components: {Toolbar, End, OperationForm},
        data() {
            return {
                approverForm: {},
                dialogApproverVisible: false
            }
        },
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
            this.$options.components.Branch = () => import('./Branch.vue')
        },
        methods: {
            handleApproverDivClick() {
                this.approverForm = {
                    id: this.node.id,
                    name: this.node.name,
                    approverIds: this.node.approverIds
                };
                this.dialogApproverVisible = true;
            },
            async handleClickSaveApprover() {
                let resp = await processService.updateNode(this.approverForm);
                if (resp.data.success) {
                    this.dialogApproverVisible = false;
                    Object.assign(this.node, this.approverForm);
                    Message.success(resp.data.message);
                }
            },
            onToolbarSave(node) {
                this.$set(node, 'transitions', this.node.transitions.map(item => Object.assign({}, item, {source: node})));
                this.node.transitions = [{
                    name: 'Default',
                    source: this.node,
                    destination: node,
                    expression: null
                }];
            },
            onToolbarSaveBranch(condition) {
                let destination = null;
                if (this.node.transitions.length > 1) {
                    destination = getIntersection(this.node.transitions);
                } else if (this.intersection) {
                    destination = this.intersection;
                } else {
                    let paths = pathing(this.node);
                    destination = paths[0].pop();
                }
                this.node.transitions.push({
                    name: condition.name || 'Default',
                    source: this.node,
                    destination: destination,
                    expression: condition.expression
                });
            },
            remove() {
            }
        }
    }
</script>
<style scoped src="../../assets/flow-design.css"></style>
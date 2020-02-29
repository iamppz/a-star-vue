<template>
    <div>
        <div class="node-wrap">
            <div class="node-wrap-box start-node">
                <div>
                    <div class="title">
                        <span class="">发起人</span>
                    </div>
                    <div class="content" @click="handleApproverDivClick">
                        <div class="text">{{ node.name }}</div>
                        <i class="anticon anticon-right arrow"/>
                    </div>
                </div>
            </div>
            <toolbar :btn-add-condition-visible="true" :source="[node]" @onnodecreated="onToolbarSave"
                     :destination="node.transitions.map(t => t.destination)" @onbranchcreated="onToolbarSaveBranch">
            </toolbar>
        </div>
        <template v-if="showNextBranch">
            <branch :transitions="node.transitions" @onconditionremove="onNextBranchConditionRemove"/>
        </template>
        <template v-else>
            <template v-if="node.transitions[0].destination.state === 'end'">
                <end/>
            </template>
            <template v-else>
                <operation :node="node.transitions[0].destination" @onremove="onNextRemove"/>
            </template>
        </template>
        <el-dialog title="编辑节点" :visible.sync="dialogApproverVisible" :append-to-body="true" width="500px">
            <operation-form :approver-form="approverForm"/>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogApproverVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogApproverVisible = false">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import Toolbar from "./Toolbar";
    import Operation from './Operation';
    import End from './End';
    import OperationForm from './OperationForm';
    import {getIntersection, pathing} from "../../../utils/process";

    export default {
        name: 'node',
        components: {Toolbar, Operation, End, OperationForm},
        props: {
            node: {
                type: Object,
                default: null
            }
        },
        beforeCreate: function () {
            this.$options.components.Branch = () => import('./Branch.vue')
        },
        computed: {
            showNextBranch() {
                // 当节点后有多个节点时，显示为分支
                return this.node.transitions.length > 1;
            }
        },
        data() {
            return {
                dialogApproverVisible: false,
                approverForm: {}
            }
        },
        methods: {
            handleApproverDivClick() {
                this.approverForm = {};
                this.dialogApproverVisible = true;
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
                if (this.showNextBranch) {
                    destination = getIntersection(this.node.transitions);
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
            onNextRemove() {
                this.node.transitions = this.node.transitions[0].destination.transitions.map(item => {
                    return {
                        name: item.name,
                        source: this.node,
                        destination: item.destination,
                        expression: item.expression
                    }
                });
            },
            onNextBranchConditionRemove(transition) {
                this.node.transitions = this.node.transitions.filter(t => t !== transition);
            }
        }
    }
</script>
<style scoped src="../../../assets/flow-design.css"/>
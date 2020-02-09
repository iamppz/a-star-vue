<template>
    <div>
        <el-tree :data="department" :props="{ children: 'children', label: 'name' }" efault-expand-all
                 node-key="id" id="tree" :filter-node-method="filterDepartment" ref="tree"
                 @node-click="handleClickDepartment" :expand-on-click-node="false" highlight-current>
        <span class="flexible" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
                <el-button type="text" size="mini" @click="() => editDepartment(data)" icon="el-icon-edit-outline">
                </el-button>
                <el-button type="text" size="mini" @click="() => appendDepartment(data)" icon="el-icon-plus">
                </el-button>
                <el-button type="text" size="mini" @click="() => removeDepartment(node, data)" icon="el-icon-close">
                </el-button>
            </span>
        </span>
        </el-tree>

        <el-dialog :title="departmentForm.id > 0 ? '编辑部门' : '新建部门'" :visible.sync="departmentDialogVisible"
                   width="440px">
            <el-form ref="form" :model="departmentForm" label-width="80px">
                <el-form-item label="名称">
                    <input type="hidden" v-model="departmentForm.id"/>
                    <input type="hidden" v-model="departmentForm.parentId"/>
                    <el-input v-model="departmentForm.name"/>
                </el-form-item>
                <el-form-item label="负责人">
                    <el-select v-model="departmentForm.leaderId" filterable remote placeholder="请输入关键词"
                               :remote-method="getDepartmentLeaderOptions" :loading="gettingDepartmentOptions"
                               style="width: 100%;">
                        <el-option v-for="item in departmentLeaderOptions" :key="'user-' + item.id" :label="item.name"
                                   :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="departmentDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleClickSaveDepartment">确定</el-button>
            </span>
        </el-dialog>
    </div>

</template>
<script>
    import treeService from "../service/treeService";
    import userService from "../service/userService";
    import departmentService from "../service/departmentService";
    import {Message, MessageBox} from "element-ui";

    export default {
        data: function () {
            return {
                department: [],
                departmentForm: {id: null, name: null, parentId: null, leaderId: null},
                departmentDialogVisible: false,
                departmentLeaderOptions: [],
                filterDepartmentText: '',
                gettingDepartmentOptions: false
            };
        },
        async mounted() {
            let resp = await treeService.get('department');
            if (resp.data.success) {
                if (resp.data.data) {
                    this.department = [resp.data.data];
                    this.$nextTick(function () {
                        this.$refs.tree.setCurrentKey(resp.data.data.id);
                        this.$emit('click', this.$refs.tree.getCurrentNode());
                    });
                }
            }
        },
        methods: {
            filterDepartment(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            async getDepartmentLeaderOptions(kw) {
                let resp = await userService.search(kw);
                if (resp.data.success) {
                    this.departmentLeaderOptions = resp.data.data;
                }
            },
            appendDepartment(data) {
                this.departmentDialogVisible = true;
                this.departmentForm = {parentId: data.id};
            },
            async editDepartment(data) {
                this.departmentDialogVisible = true;
                let resp = await departmentService.get(data.id);
                if (resp.data.success) {
                    if (resp.data.data.leaderId) {
                        let userResp = await userService.get(resp.data.data.leaderId);
                        if (userResp.data.success) {
                            this.departmentLeaderOptions = [userResp.data.data];
                        }
                    }
                    this.departmentForm = {...resp.data.data};
                }
            },
            removeDepartment(node, data) {
                MessageBox.confirm('确定要删除部门"' + data.name + '"?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let resp = await departmentService.delete(data.id);
                    if (resp.data.success) {
                        Message.success(resp.data.message);
                        const parent = node.parent;
                        const children = parent.data.children || parent.data;
                        const index = children.findIndex(d => d.id === data.id);
                        children.splice(index, 1);
                    }
                }).catch(() => {
                    Message.info('取消操作');
                });
            },
            handleClickDepartment(department) {
                this.$emit('click', department);
            },
            async handleClickSaveDepartment() {
                if (this.departmentForm.id > 0) {
                    let resp = await departmentService.update(this.departmentForm);
                    if (resp.data.success) {
                        Message.success(resp.data.message);
                        this.departmentDialogVisible = false;
                        this.$refs.tree.getCurrentNode().name = this.departmentForm.name;
                        this.$emit('refresh');
                    }
                } else {
                    let resp = await departmentService.add(this.departmentForm);
                    if (resp.data.success) {
                        Message.success(resp.data.message);
                        this.departmentDialogVisible = false;
                        if (!this.$refs.tree.getCurrentNode().children) {
                            this.$set(this.$refs.tree.getCurrentNode(), 'children', []);
                        }
                        this.$refs.tree.getCurrentNode().children.push(resp.data.data);
                        this.$emit('refresh');
                    }
                }
            },
            getCurrentNode() {
                return this.$refs.tree.getCurrentNode();
            }
        },
        watch: {
            filterDepartmentText(val) {
                this.$refs.tree.filter(val);
            }
        }
    }
</script>
<style scoped>
    .el-tree-node .el-button {
        display: none;
        margin-left: 6px;
    }

    .el-tree-node__content:hover .el-button {
        display: initial;
    }
</style>
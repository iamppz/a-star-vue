<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/app/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>系统设置</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-container>
            <el-aside style="width: 250px">
                <el-input placeholder="输入关键字进行过滤" v-model="filterText">
                </el-input>
                <el-tree :data="department" :props="defaultProps" default-expand-all node-key="id" id="tree"
                         :filter-node-method="filterTreeNode" ref="tree" @node-click="handleClickTreeNode"
                         :expand-on-click-node="false" highlight-current>
                    <span class="flexible" slot-scope="{ node, data }">
                        <span>{{ node.label }}</span>
                        &nbsp;
                         <span>
                            <el-button type="text" size="mini" @click="() => edit(data)"
                                       icon="el-icon-edit-outline">
                            </el-button>
                            <el-button type="text" size="mini" @click="() => append(data)"
                                       icon="el-icon-plus">
                            </el-button>
                            <el-button type="text" size="mini" @click="() => remove(node, data)"
                                       icon="el-icon-close">
                            </el-button>
                        </span>
                    </span>
                </el-tree>
            </el-aside>
            <el-main>
                <el-table :data="formattedTableData" style="width: 100%" ref="table" border stripe>
                    <el-table-column prop="name" label="姓名" min-width="120" width="120"></el-table-column>
                    <el-table-column prop="departmentName" label="部门" min-width="120" width="120"></el-table-column>
                    <el-table-column prop="roleNames" label="角色" min-width="200" width="200"></el-table-column>
                    <el-table-column prop="mobile" label="手机" min-width="110" width="110"></el-table-column>
                    <el-table-column prop="createdAt" label="创建时间" min-width="135" width="135"></el-table-column>
                    <el-table-column label="操作" fixed="right" min-width="205px">
                        <template slot-scope="scope">
                            <el-button @click="handleClickEdit(scope.row)" type="text" size="small"
                                       icon="el-icon-edit-outline">
                                编辑
                            </el-button>
                            <el-button v-if="scope.row.disabled" @click="handleClickEnable(scope.row)" type="text"
                                       size="small" icon="el-icon-edit-outline">
                                启用
                            </el-button>
                            <el-button v-if="!scope.row.disabled" @click="handleClickDisable(scope.row)" type="text"
                                       size="small" icon="el-icon-edit-outline">
                                禁用
                            </el-button>
                            <el-button @click="handleClickResetPassword(scope.row)" type="text" size="small"
                                       icon="el-icon-refresh">
                                重置密码
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" id="pager"
                               :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="10"
                               layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
                <div id="toolbar">
                    <el-button type="primary" icon="el-icon-search" @click="handleClickCreate" size="small">新建
                    </el-button>
                </div>
            </el-main>
        </el-container>
        <el-dialog :title="form.id > 0 ? '编辑用户' : '新建用户'" :visible.sync="dialogVisible" width="30%">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="姓名">
                    <input type="hidden" v-model="form.id"/>
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="部门">
                    <treeselect v-model="form.departmentId" :options="department" :normalizer="normalizer"></treeselect>
                </el-form-item>
                <el-form-item label="手机">
                    <el-input v-model="form.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleClickSave">确定</el-button>
            </span>
        </el-dialog>
        <el-dialog :title="departmentForm.id > 0 ? '编辑部门' : '新建部门'" :visible.sync="departmentDialogVisible" width="30%">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="名称">
                    <input type="hidden" v-model="departmentForm.id"/>
                    <input type="hidden" v-model="departmentForm.parentId"/>
                    <el-input v-model="departmentForm.name"></el-input>
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
    import departmentService from "../service/departmentService";
    import userService from "../service/userService";
    import {Loading, Message, MessageBox} from 'element-ui';
    import moment from 'moment';
    import Treeselect from '@riophae/vue-treeselect';
    import '@riophae/vue-treeselect/dist/vue-treeselect.css';

    export default {
        components: {
            Treeselect
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        computed: {
            formattedTableData() {
                return this.tableData.map(item => {
                    item.createdAt = moment(item.createdAt).format('YYYY-MM-DD HH:mm');
                    return item;
                });
            }
        },
        methods: {
            filterTreeNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            handleClickEdit(row) {
                this.form.id = row.id;
                this.form.name = row.name;
                this.form.mobile = row.mobile;
                this.form.departmentId = row.departmentId;
                this.dialogVisible = true;
            },
            handleClickCreate() {
                this.form = {
                    departmentId: this.$refs.tree.getCurrentKey()
                };
                this.dialogVisible = true;
            },
            async handleClickSave() {
                if (this.form.id > 0) {
                    let resp = await userService.update(this.form);
                    if (resp.data.success) {
                        Message.success(resp.data.message);
                        this.dialogVisible = false;
                        this.handleClickTreeNode(this.$refs.tree.getCurrentNode());
                    }
                } else {
                    let resp = await userService.add(this.form);
                    if (resp.data.success) {
                        Message.success(resp.data.message);
                        this.dialogVisible = false;
                        this.handleClickTreeNode(this.$refs.tree.getCurrentNode());
                    }
                }
            },
            async handleClickSaveDepartment() {
                if (this.departmentForm.id > 0) {
                    let resp = await departmentService.update(this.departmentForm);
                    if (resp.data.success) {
                        Message.success(resp.data.message);
                        this.departmentDialogVisible = false;
                        this.$refs.tree.getCurrentNode().name = this.departmentForm.name;
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
                    }
                }
            },
            async handleClickEnable(user) {
                let resp = await userService.enable(user.id);
                if (resp.data.success) {
                    Message.success(resp.data.message);
                    user.disabled = false;
                }
            },
            async handleClickDisable(user) {
                let resp = await userService.disable(user.id);
                if (resp.data.success) {
                    Message.success(resp.data.message);
                    user.disabled = true;
                }
            },
            async handleClickTreeNode(department) {
                let options = {target: this.$refs.table.$el};
                let loading = Loading.service(options);
                let resp = await userService.getByDepartment(department.id, this.currentPage);
                loading.close();
                if (resp.data.success) {
                    this.tableData = resp.data.data.content;
                    this.total = resp.data.data.totalElements;
                }
            },
            handleSizeChange() {
            },
            handleCurrentChange(current) {
                this.currentPage = current;
                this.handleClickTreeNode(this.$refs.tree.getCurrentNode());
            },
            append(data) {
                this.departmentDialogVisible = true;
                this.departmentForm = {parentId: data.id};
            },
            edit(data) {
                this.departmentDialogVisible = true;
                this.departmentForm = {...data};
            },
            remove(node, data) {
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
            handleClickResetPassword(data) {
                MessageBox.confirm('确定要将用户"' + data.name + '"的密码重置为"00000000"吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let resp = await userService.resetPassword(data.id);
                    if (resp.data.success) {
                        Message.success(resp.data.message);
                    }
                }).catch(() => {
                    Message.info('取消操作');
                });
            }
        },
        data() {
            return {
                filterText: '',
                currentPage: 1,
                total: 0,
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                tableData: [],
                department: [],
                dialogVisible: false,
                form: {id: null, name: null, departmentId: null, mobile: null},
                normalizer(node) {
                    return {
                        label: node.name
                    }
                },
                departmentForm: {
                    id: null,
                    name: null,
                    parentId: null
                },
                departmentDialogVisible: false
            };
        },
        async mounted() {
            let resp = await departmentService.get();
            if (resp.data.success) {
                if (resp.data.data) {
                    this.department = [resp.data.data];
                    this.$nextTick(function () {
                        this.$refs.tree.setCurrentKey(resp.data.data.id);
                        this.handleClickTreeNode(this.$refs.tree.getCurrentNode());
                    });
                }
            }
        }
    };
</script>
<style scoped>
    #tree, #pager, #toolbar {
        margin-top: 20px;
    }

    .el-tree-node .flexible {
        display: flex;
        align-items: center;
        padding-right: 8px;
    }

    .el-tree-node .el-button {
        display: none;
        margin-left: 6px;
    }

    .el-tree-node__content:hover .el-button {
        display: initial;
    }

    .el-aside {
        padding: 20px 0;
    }
</style>
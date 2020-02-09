<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/app/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>系统设置</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-container>
            <el-aside style="width: 250px">
                <department-tree @click="handleClickDepartment" @refresh="getDepartment" ref="tree"/>
            </el-aside>
            <el-main>
                <el-table :data="formattedUsers" style="width: 100%" ref="table" border stripe>
                    <el-table-column prop="name" label="姓名" min-width="120" width="120"/>
                    <el-table-column prop="departmentName" label="部门" min-width="120" width="120"/>
                    <el-table-column prop="roleNames" label="角色" min-width="200" width="200"/>
                    <el-table-column prop="mobile" label="手机" min-width="110" width="110"/>
                    <el-table-column prop="createdAt" label="创建时间" min-width="135" width="135"/>
                    <el-table-column label="操作" fixed="right" min-width="205px">
                        <template slot-scope="scope">
                            <el-button @click="handleClickEditUser(scope.row)" type="text" size="small"
                                       icon="el-icon-edit-outline">
                                编辑
                            </el-button>
                            <el-button v-if="scope.row.disabled" @click="handleClickEnableUser(scope.row)" type="text"
                                       size="small" icon="el-icon-edit-outline">
                                启用
                            </el-button>
                            <el-button v-if="!scope.row.disabled" @click="handleClickDisableUser(scope.row)" type="text"
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
                    <el-button type="primary" icon="el-icon-search" @click="handleClickCreateUser" size="small">新建
                    </el-button>
                </div>
            </el-main>
        </el-container>
        <el-dialog :title="userForm.id > 0 ? '编辑用户' : '新建用户'" :visible.sync="userDialogVisible" width="440px">
            <el-form ref="form" :model="userForm" label-width="80px">
                <el-form-item label="姓名">
                    <input type="hidden" v-model="userForm.id"/>
                    <el-input v-model="userForm.name"/>
                </el-form-item>
                <el-form-item label="部门">
                    <treeselect v-model="userForm.departmentId" :options="department"
                                :normalizer="(node) => ({ label: node.name })"/>
                </el-form-item>
                <el-form-item label="角色">
                    <el-select v-model="userForm.roleIds" multiple placeholder="请选择" style="width: 100%;">
                        <el-option v-for="item in roles" :key="'role-' + item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="手机">
                    <el-input v-model="userForm.mobile"/>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">  
                <el-button @click="userDialogVisible = false">取消</el-button>    
                <el-button type="primary" @click="handleClickSaveUser">确定</el-button>
            </span>
        </el-dialog>
    </div>

</template>
<script>
    import treeService from '../service/treeService';
    import userService from "../service/userService";
    import {Loading, Message, MessageBox} from 'element-ui';
    import moment from 'moment';
    import '@riophae/vue-treeselect/dist/vue-treeselect.css';
    import Treeselect from '@riophae/vue-treeselect';
    import roleService from "../service/roleService";
    import DepartmentTree from "../components/DepartmentTree";

    export default {
        components: {
            DepartmentTree,
            Treeselect
        },
        computed: {
            formattedUsers() {
                return this.users.map(item => {
                    item.createdAt = moment(item.createdAt).format('YYYY-MM-DD HH:mm');
                    item.departmentName = item.department.name;
                    item.departmentId = item.department.id;
                    item.roleNames = item.userRoles.map(ur => ur.role.name).join();
                    item.roleIds = item.userRoles.map(ur => ur.role.id);
                    return item;
                });
            }
        },
        methods: {
            handleClickEditUser(row) {
                this.userForm.id = row.id;
                this.userForm.name = row.name;
                this.userForm.mobile = row.mobile;
                this.userForm.departmentId = row.departmentId;
                this.userForm.roleIds = row.roleIds;
                this.userDialogVisible = true;
            },
            handleClickCreateUser() {
                this.userForm = {
                    departmentId: this.$refs.tree.getCurrentKey(),
                    id: null
                };
                this.userDialogVisible = true;
            },
            async handleClickSaveUser() {
                let resp;
                if (this.userForm.id > 0) {
                    resp = await userService.update(this.userForm);
                } else {
                    resp = await userService.add(this.userForm);
                }
                if (resp.data.success) {
                    Message.success(resp.data.message);
                    this.userDialogVisible = false;
                    this.handleClickDepartment(this.$refs.tree.getCurrentNode());
                }
            },
            async handleClickEnableUser(user) {
                let resp = await userService.enable(user.id);
                if (resp.data.success) {
                    Message.success(resp.data.message);
                    user.disabled = false;
                }
            },
            async handleClickDisableUser(user) {
                let resp = await userService.disable(user.id);
                if (resp.data.success) {
                    Message.success(resp.data.message);
                    user.disabled = true;
                }
            },
            async handleClickDepartment(department) {
                let options = {target: this.$refs.table.$el};
                let loading = Loading.service(options);
                let resp = await userService.getByDepartment(department.id, this.currentPage);
                loading.close();
                if (resp.data.success) {
                    this.users = resp.data.data.content;
                    this.total = resp.data.data.totalElements;
                }
            },
            async getDepartment() {
                let resp = await treeService.get('department');
                if (resp.data.success) {
                    if (resp.data.data) {
                        this.department = [resp.data.data];
                    }
                }
            },
            handleSizeChange() {
            },
            handleCurrentChange(current) {
                this.currentPage = current;
                this.handleClickDepartment(this.$refs.tree.getCurrentNode());
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
                currentPage: 1,
                total: 0,
                users: [],
                roles: [],
                userDialogVisible: false,
                userForm: {id: null, name: null, departmentId: null, mobile: null, roleIds: null},
                department: [],
            };
        },
        async mounted() {
            let roleResp = await roleService.get();
            if (roleResp.data.success) {
                this.roles = roleResp.data.data;
            }

            this.getDepartment();
        }
    };
</script>
<style scoped>
    #tree, #pager, #toolbar {
        margin-top: 20px;
    }

    .el-aside {
        padding: 20px 0;
    }
</style>
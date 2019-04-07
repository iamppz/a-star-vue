<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/app/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>系统设置</el-breadcrumb-item>
            <el-breadcrumb-item>角色管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row :gutter="20" id="row">
            <el-col :span="24">
                <el-table :data="roles" style="width: 100%" ref="table" border stripe>
                    <el-table-column prop="name" label="角色" width="150"></el-table-column>
                    <el-table-column prop="description" label="说明"></el-table-column>
                    <el-table-column label="操作" width="210">
                        <template slot-scope="scope">
                            <el-button @click="handleClickEdit(scope.row.id)" type="text"
                                       size="small" icon="el-icon-edit-outline">
                                分配权限
                            </el-button>
                            <el-button @click="handleClickEditRole(scope.row)" type="text"
                                       size="small" icon="el-icon-edit-outline">
                                编辑
                            </el-button>
                            <el-button @click="handleClickEdit(scope.row.id)" type="text"
                                       size="small" icon="el-icon-delete">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div id="toolbar">
                    <el-button type="primary" icon="el-icon-plus" @click="handleClickCreate" size="small">新建
                    </el-button>
                </div>
                <el-dialog title="设置权限" :visible.sync="dialogVisible" width="30%">
                    <el-tabs :value="'permission'">
                        <el-tab-pane label="权限" name="permission">
                            <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
                            <el-tree :data="permission" :props="defaultProps" default-expand-all node-key="id"
                                     show-checkbox
                                     ref="tree" :filter-node-method="filterTreeNode" id="tree">
                            </el-tree>
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="dialogVisible = false">取消</el-button>
                                <el-button type="primary" @click="handleClickSave">确定</el-button>
                            </span>
                        </el-tab-pane>
                        <el-tab-pane label="菜单" name="nav">
                            <el-tree :data="navs" :props="defaultProps" default-expand-all node-key="id"
                                     show-checkbox ref="navTree" :filter-node-method="filterTreeNode" id="navTree">
                            </el-tree>
                        </el-tab-pane>
                    </el-tabs>

                </el-dialog>
                <el-dialog :title="form.id > 0 ? '编辑角色' : '新建角色'" :visible.sync="roleDialogVisible" width="30%">
                    <el-form ref="form" :model="form" label-width="80px">
                        <el-form-item label="角色">
                            <input type="hidden" v-model="form.id"/>
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>
                        <el-form-item label="说明">
                            <el-input v-model="form.description"></el-input>
                        </el-form-item>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible = false">取消</el-button>
                        <el-button type="primary" @click="handleClickSaveRole">确定</el-button>
                    </span>
                </el-dialog>
            </el-col>
        </el-row>
    </div>

</template>
<script>
    import {Message, Loading} from 'element-ui';
    import roleService from "../service/roleService";
    import permissionService from "../service/permissionService";
    import navService from "../service/navService";

    export default {
        watch: {
            filterText(val) {
                this.$refs.permissionTree.filter(val);
            }
        },
        methods: {
            filterTreeNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            async handleClickSave() {
                let keys = this.$refs.tree.getCheckedKeys();
                let resp = await roleService.savePermission(this.currentRoleId, keys);
                if (resp.data.success) {
                    Message.success(resp.data.message);
                    this.dialogVisible = false;
                    this.handleClickTreeNode(this.currentDepartment);
                } else {
                    Message.error(resp.data.message);
                }
            },
            async handleClickEdit(roleId) {
                this.dialogVisible = true;
                this.currentRoleId = roleId;
                let resp = await roleService.getPermission(roleId);
                if (resp.data.success) {
                    this.$refs.tree.setCheckedKeys(resp.data.data.map(item => item.permissionId));
                } else {
                    Message.error(resp.data.message);
                }
            },
            async handleClickSaveRole() {
                let resp = await roleService.save(this.form);
                if (resp.data.success) {
                    this.roleDialogVisible = false;
                    this.loadRoleList();
                } else {
                    Message.error(resp.data.message);
                }
            },
            handleClickCreate() {
                this.form = {};
                this.roleDialogVisible = true;
            },
            handleClickEditRole(row) {
                this.form.id = row.id;
                this.form.name = row.name;
                this.form.description = row.description;
                this.roleDialogVisible = true;
            },
            async loadRoleList() {
                let options = {target: this.$refs.table.$el};
                let loading = Loading.service(options);
                let resp = await roleService.get();
                loading.close();
                if (resp.data.success) {
                    this.roles = resp.data.data;
                }
            }
        },
        data() {
            return {
                filterText: '',
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                roles: [],
                permission: [],
                currentRoleId: 0,
                dialogVisible: false,
                roleDialogVisible: false,
                form: {
                    id: null,
                    name: null,
                    description: null
                },
                navs: []
            };
        },
        async mounted() {
            this.loadRoleList();
            let resp = await permissionService.get();
            if (resp.data.success) {
                this.permission = [resp.data.data];
            }
            resp = await navService.getAll();
            if (resp.data.success) {
                this.navs = resp.data.data;
            }
        }
    };
</script>
<style scoped>
    #toolbar {
        margin-top: 20px;
    }

    #row {
        margin-top: 40px;
    }
</style>
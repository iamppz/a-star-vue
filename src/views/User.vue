<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/app/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>系统设置</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row :gutter="20" id="row">
            <el-col :span="6">
                <el-input placeholder="输入关键字进行过滤" v-model="filterText">
                </el-input>
                <el-tree :data="department" :props="defaultProps" default-expand-all node-key="id" id="tree"
                         :filter-node-method="filterTreeNode" ref="tree" @node-click="handleClickTreeNode">
                </el-tree>
            </el-col>
            <el-col :span="18">
                <el-table :data="formattedTableData" style="width: 100%" ref="table" border stripe>
                    <el-table-column prop="name" label="姓名" width="120"></el-table-column>
                    <el-table-column prop="departmentName" label="部门" width="120"></el-table-column>
                    <el-table-column prop="roleNames" label="角色" width="120"></el-table-column>
                    <el-table-column prop="mobile" label="手机" width="110"></el-table-column>
                    <el-table-column prop="createdAt" label="创建时间" width="240"></el-table-column>
                    <el-table-column label="操作" fixed="right" width="83">
                        <template slot-scope="scope">
                            <el-button @click="handleClickEdit(scope.row)" type="text" size="small">编辑</el-button>
                            <el-button v-if="scope.row.disabled" @click="handleClickEnable(scope.row)" type="text"
                                       size="small">
                                启用
                            </el-button>
                            <el-button v-if="!scope.row.disabled" @click="handleClickDisable(scope.row)" type="text"
                                       size="small">
                                禁用
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
            </el-col>
        </el-row>
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
    </div>

</template>
<script>
    import departmentService from "../service/departmentService";
    import userService from "../service/userService";
    import {Loading, Message} from 'element-ui';
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
                    departmentId: this.currentDepartment.id
                };
                this.dialogVisible = true;
            },
            async handleClickSave() {
                if (this.form.id > 0) {
                    let resp = await userService.update(this.form);
                    if (resp.data.success) {
                        Message.success(resp.data.message);
                        this.dialogVisible = false;
                        this.handleClickTreeNode(this.currentDepartment);
                    } else {
                        Message.error(resp.data.message);
                    }
                } else {
                    let resp = await userService.add(this.form);
                    if (resp.data.success) {
                        Message.success(resp.data.message);
                        this.dialogVisible = false;
                        this.handleClickTreeNode(this.currentDepartment);
                    } else {
                        Message.error(resp.data.message);
                    }
                }
            },
            async handleClickEnable(user) {
                let resp = await userService.enable(user.id);
                if (resp.data.success) {
                    Message.success(resp.data.message);
                    user.disabled = false;
                } else {
                    Message.error(resp.data.message);
                }
            },
            async handleClickDisable(user) {
                let resp = await userService.disable(user.id);
                if (resp.data.success) {
                    Message.success(resp.data.message);
                    user.disabled = true;
                } else {
                    Message.error(resp.data.message);
                }
            },
            async handleClickTreeNode(department) {
                this.currentDepartment = department;
                let options = {target: this.$refs.table.$el};
                let loading = Loading.service(options);
                let resp = await userService.get(department.id, this.currentPage);
                loading.close();
                if (resp.data.success) {
                    this.tableData = resp.data.data.content;
                    this.total = resp.data.data.totalElements;
                }
            },
            handleSizeChange() {
            },
            handleCurrentChange() {
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
                currentDepartment: null,
                normalizer(node) {
                    return {
                        label: node.name
                    }
                }
            };
        },
        async mounted() {
            let resp = await departmentService.get();
            if (resp.data.success) {
                this.department = [resp.data.data];
                this.handleClickTreeNode(resp.data.data)
            }
        }
    };
</script>
<style scoped>
    #tree, #pager, #toolbar {
        margin-top: 20px;
    }

    #row {
        margin-top: 40px;
    }
</style>
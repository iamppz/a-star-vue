<template>
    <div>
        <el-table :data="roles" style="width: 100%" ref="table" border>
            <el-table-column prop="name" label="角色" width="150"></el-table-column>
            <el-table-column label="描述"></el-table-column>
            <el-table-column label="操作" width="100" align="center">
                <template slot-scope="scope">
                    <el-button @click="dialogVisible = true" type="text"
                               size="small">
                        分配权限
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="设置权限" :visible.sync="dialogVisible" width="30%">
            <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
            <el-tree :data="permission" :props="defaultProps" default-expand-all node-key="id" show-checkbox
                     ref="permissionTree" :filter-node-method="filterTreeNode">
            </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleClickSave">确定</el-button>
            </span>
        </el-dialog>
    </div>

</template>
<script>
    import roleService from "../service/roleService";
    import permissionService from "../service/permissionService";

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
            handleClickRole(id) {
                this.currentRoleId = id;
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
                dialogVisible: false
            };
        },
        async mounted() {
            let resp = await roleService.get();
            if (resp.data.success) {
                this.roles = resp.data.data;
            }
            resp = await permissionService.get();
            if (resp.data.success) {
                this.permission = [resp.data.data];
            }
        }
    };
</script>
<style scoped>
    ul {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    ul > li {
        padding: 0 20px;
        line-height: 200%;
        cursor: pointer;
    }

    ul > li.active {
        background-color: #f5f7fa;
    }

    ul > li:hover {
        background-color: #f5f7fa;
    }
</style>
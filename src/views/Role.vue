<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="6">
                <el-input placeholder="输入关键字进行过滤" v-model="filterText">
                </el-input>
                <el-tree :data="roles" :props="defaultProps" default-expand-all node-key="id"
                         :filter-node-method="filterTreeNode" ref="tree">
                </el-tree>
            </el-col>
            <el-col :span="18">
                <el-tree :data="permission" :props="defaultProps" default-expand-all node-key="id" show-checkbox
                    ref="permissionTree">
                </el-tree>
            </el-col>
        </el-row>
    </div>

</template>
<script>
    import roleService from "../service/roleService";
    import permissionService from "../service/permissionService";

    export default {
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        methods: {
            filterTreeNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
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
                permission: []
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
</style>
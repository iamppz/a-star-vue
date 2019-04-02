<template>
    <el-row :gutter="20">
        <el-col :span="6">
            <el-input placeholder="输入关键字进行过滤" v-model="filterText">
            </el-input>
            <el-tree :data="department" :props="defaultProps" default-expand-all node-key="id"
                     :filter-node-method="filterTreeNode" ref="tree2" @node-click="handleClickTreeNode">
            </el-tree>
        </el-col>
        <el-col :span="18">
            <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="name" label="姓名" width="120"></el-table-column>
                <el-table-column prop="createdAt" label="创建时间" width="240"></el-table-column>
                <el-table-column fixed="right" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                        <el-button type="text" size="small">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="10"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-col>
    </el-row>
</template>
<script>
    import departmentService from "../service/departmentService";
    import userService from "../service/userService";

    export default {
        watch: {
            filterText(val) {
                this.$refs.tree2.filter(val);
            }
        },

        methods: {
            filterTreeNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            handleClick() {
            },
            handleCurrentChange() {

            },
            handleSizeChange() {

            },
            async handleClickTreeNode(department) {
                let resp = await userService.get(department.id, this.currentPage);
                if (resp.data.success) {
                    this.tableData = resp.data.data.records;
                    this.total = resp.data.data.total;
                }
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
                department: []
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
</style>
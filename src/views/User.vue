<template>
    <el-row :gutter="20">
        <el-col :span="6">
            <el-input placeholder="输入关键字进行过滤" v-model="filterText">
            </el-input>
            <el-tree class="filter-tree" :data="department" :props="defaultProps" default-expand-all
                     :filter-node-method="filterNode" ref="tree2">
            </el-tree>
        </el-col>
        <el-col :span="18">
            <el-table :data="tableData" style="width: 100%">
                <el-table-column fixed prop="date" label="日期" width="150"></el-table-column>
                <el-table-column prop="name" label="姓名" width="120"></el-table-column>
                <el-table-column prop="province" label="省份" width="120"></el-table-column>
                <el-table-column prop="city" label="市区" width="120"></el-table-column>
                <el-table-column prop="address" label="地址" width="300"></el-table-column>
                <el-table-column prop="zip" label="邮编" width="120"></el-table-column>
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
                    :current-page="currentPage4"
                    :page-sizes="[100, 200, 300, 400]"
                    :page-size="100"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="400">
            </el-pagination>
        </el-col>
    </el-row>
</template>
<script>
    import departmentService from "../service/departmentService";

    export default {
        watch: {
            filterText(val) {
                this.$refs.tree2.filter(val);
            }
        },

        methods: {
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            handleClick() {
            },
            handleCurrentChange() {

            },
            handleSizeChange() {

            }
        },
        data() {
            return {
                filterText: '',
                currentPage4: 0,
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                tableData: [{
                    date: '2016-05-02',
                    name: '王小虎',
                    province: '上海',
                    city: '普陀区',
                    address: '上海市普陀区金沙江路 1518 弄',
                    zip: 200333
                }],
                department: []
            };
        },
        async mounted() {
            let resp = await departmentService.get();
            if (resp.data.success) {
                this.department = [resp.data.data];
            }
        }
    };
</script>
<style scoped>
</style>
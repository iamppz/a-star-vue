<template>
    <el-form :model="approverForm" label-width="100px">
        <input type="hidden" v-model="approverForm.id"/>
        <el-form-item label="名称">
            <el-input v-model="approverForm.name"></el-input>
        </el-form-item>
        <el-form-item label="审核方式">
            <el-radio v-model="approverForm.approverType" label="1">指定成员</el-radio>
            <el-radio v-model="approverForm.approverType" label="2">角色</el-radio>
            <el-radio v-model="approverForm.approverType" label="2">发起人自己</el-radio>
        </el-form-item>
        <el-form-item label="审核人">
            <el-input v-model="approverForm.approverIds"></el-input>
        </el-form-item>
        <el-form-item label="审批人为空时">
            <el-switch active-text="直接通过" inactive-text="转交管理员" active-color="#13ce66" inactive-color="#ff4949"
                       v-model="approverForm.passWhenNoApprover"></el-switch>
        </el-form-item>
    </el-form>
</template>
<script>
    export default {
        props: {
            approverForm: {
                type: Object,
                default: () => {
                }
            }
        },
        data() {
            return {
                states: ["zsl", "joyce"],
                options: [],
                list: [],
                loading: false
            }
        },
        methods: {
            remoteMethod(query) {
                if (query !== '') {
                    this.loading = true;
                    setTimeout(() => {
                        this.loading = false;
                        this.options = this.list.filter(item => {
                            return item.label.toLowerCase()
                                .indexOf(query.toLowerCase()) > -1;
                        });
                    }, 200);
                } else {
                    this.options = [];
                }
            }
        },
        mounted() {
            this.list = this.states.map(item => {
                return { value: item, label: item };
            });
        },
    }
</script>
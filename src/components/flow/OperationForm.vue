<template>
    <el-form :model="approverForm" label-width="80px">
        <input type="hidden" v-model="approverForm.id"/>
        <el-form-item label="名称">
            <el-input v-model="approverForm.name"></el-input>
        </el-form-item>
        <el-form-item label="审核人">
            <el-input v-model="approverForm.approverIds"></el-input>
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
        }
    }
</script>
<template>
    <div>
        <dynamic-form :data-id="formId" :form-id="dataId"/>
        <el-button @click="handleClickSave">保存</el-button>
    </div>
</template>
<script>
    import DynamicForm from "./DynamicForm";
    import {Message} from "element-ui";

    export default {
        components: {DynamicForm: DynamicForm},
        data: function () {
            return {}
        },
        methods: {
            async handleClickSave() {
                let dataId = await this.$refs.form.add();
                if (dataId) {
                    Message.success("保存成功");
                }
            }
        },
        props: {
            formId: {
                type: Number,
                default: null
            },
            dataId: {
                type: Number,
                default: null
            }
        },
    }
</script>
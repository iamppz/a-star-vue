<template>
    <div class="container" v-if="definition.form">
        <div class="title">
            <h1>{{definition.name}}</h1>
        </div>
        <dynamic-form :form-id="definition.form.id" :data-id="dataId" ref="form"></dynamic-form>
        <div class="toolbar">
            <el-button @click="handleClickSave">保存</el-button>
            <el-button>提交</el-button>
        </div>
    </div>
</template>
<script>
    import {Message} from "element-ui";

    import DynamicForm from "./DynamicForm";
    import processDefinitionService from "../service/processDefinitionService";

    export default {
        components: {DynamicForm},
        data() {
            return {
                definition: {},
                dataId: null
            }
        },
        async created() {
            let resp = await processDefinitionService.get(1);
            if (resp.data.success) {
                this.definition = resp.data.data;
            }
        },
        async mounted() {
        },
        computed: {},
        methods: {
            handleClickSave() {
                this.$refs.form.save();
            }
        }
    }
</script>
<style scoped>
    .container {
        display: inline-block;
    }

    .title {
        margin: auto;
        display: inline-block;
    }

    .toolbar {
        padding: 10px 0;
        text-align: center;
    }
</style>
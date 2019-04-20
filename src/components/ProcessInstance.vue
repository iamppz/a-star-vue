<template>
    <div class="container" v-if="definition.form">
        <div class="title">
            <h1>{{definition.name}}</h1>
        </div>
        <dynamic-form :row="definition.form.row" :col="definition.form.col" :cells="cells"
                      v-model="data"></dynamic-form>
        <div class="toolbar">
            <el-button>保存</el-button>
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
                data: {}
            }
        },
        async created() {
            let resp = await processDefinitionService.get(1);
            if (resp.data.success) {
                this.definition = resp.data.data;
            } else {
                Message.error(resp.data.message);
            }
        },
        async mounted() {
        },
        computed: {
            cells() {
                return JSON.parse(this.definition.form.cells);
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
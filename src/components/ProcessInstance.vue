<template>
    <div class="container" v-if="definition">
        <div class="title">
            <h1>{{definition.name}}</h1>
        </div>
        <dynamic-form v-if="definition !== null" :form-id="definition.form.id" :data-id="instance ? instance.dataId : null" ref="form"></dynamic-form>
        <div class="toolbar">
            <el-button v-if="instance  === null" @click="handleClickSave">保存</el-button>
            <el-button v-if="instance !== null">提交</el-button>
        </div>
    </div>
</template>
<script>
    import {Message} from "element-ui";

    import DynamicForm from "./DynamicForm";
    import processService from "../service/processService";

    export default {
        components: {DynamicForm},
        data() {
            return {
                instance: null,
                definition: null
            }
        },
        async created() {
            if (this.id) {
                let resp = await processService.getInstance(this.id);
                if (resp.data.success) {
                    this.instance = resp.data.data;
                }
            }

            let definitionId = this.instance ? this.instance.processDefinitionId : this.definitionId;
            let resp = await processService.getDefinition(definitionId);
            if (resp.data.success) {
                this.definition = resp.data.data;
            }
        },
        async mounted() {
        },
        computed: {},
        methods: {
            async handleClickSave() {
                let dataId = await this.$refs.form.add();
                if (dataId) {
                    console.log(dataId);
                    let resp = await processService.create(this.definition.id, dataId);
                    if (resp.data.success) {
                        Message.success("提交成功");
                        this.instance = resp.data.data;
                    }
                }
            }
        },
        props: {
            id: {
                type: Number,
                default: null
            },
            definitionId: {
                type: Number,
                default: null
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
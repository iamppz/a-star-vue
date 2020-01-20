<template>
    <div :style="{width: widthPixel}">
        <table class="dynamic-form" width="100%">
            <tr v-for="i in form.row" v-bind:key="i">
                <template v-for="j in form.col">
                    <td v-if="getCell(i, j) !== null" v-bind:key="j" :colspan="getCell(i, j).colspan"
                        :rowspan="getCell(i, j).rowspan" :width="cellWidth * getCell(i, j).colspan + 'px'"
                        :height="cellHeight * getCell(i, j).rowspan + 'px'">
                        <template v-if="getCell(i, j).type === 'label'">
                            <label>{{getCell(i, j).text}}</label>
                        </template>
                        <template v-else>
                            <el-input v-if="getCell(i, j).type === 'input'" v-model="data[getCell(i, j).binding]"
                                      placeholder="请输入内容"/>
                            <el-input v-else-if="getCell(i, j).type === 'textarea'" type="textarea" autosize
                                      v-model="data[getCell(i, j).binding]" placeholder="请输入内容"/>
                            <tree-select v-model="data[getCell(i, j).binding]" :options="department"
                                         v-else-if="getCell(i, j).type === 'cascader'" style="width: 100%;"
                                         :normalizer="function(node) { return { label: node.name } }"/>
                            <label v-else>{{ 'unknown type: ' +  getCell(i, j).type}}</label>
                        </template>
                    </td>
                </template>
            </tr>
        </table>
    </div>
</template>
<script>
    import {Message, Cascader} from "element-ui";
    import TreeSelect from "@riophae/vue-treeselect";

    import dynamicFormService from "../../service/dynamicFormService";
    import departmentService from "../../service/departmentService";

    export default {
        props: {
            formId: {
                type: Number,
                default: null
            },
            dataId: {
                type: Number,
                default: null
            },
            defaultValues: {
                type: Object,
                default: null
            }
        },
        data() {
            return {
                form: {},
                data: {},
                department: []
            }
        },
        async created() {
            let departmentResp = await departmentService.get();
            if (departmentResp.data.success) {
                if (departmentResp.data.data) {
                    this.department.push(departmentResp.data.data);
                }
            }

            let resp = await dynamicFormService.get(this.formId);
            if (resp.data.success) {
                this.form = resp.data.data;
            }

            if (this.dataId) {
                resp = await dynamicFormService.getData(this.form.id, this.dataId);
                if (resp.data.success) {
                    this.data = resp.data.data;
                }
            } else if (this.defaultValues) {
                this.data = this.defaultValues;
            }
        },
        computed: {
            widthPixel() {
                return (this.form.width || 720) + 'px';
            },
            cellWidth() {
                return this.form.width / this.form.col;
            },
            cellHeight() {
                return 36;
            },
            cells() {
                return JSON.parse(this.form.cells);
            }
        },
        methods: {
            getCell(row, col) {
                let filtered = this.cells.filter(cell => cell.row === row && cell.col === col);
                return filtered.length > 0 ? filtered[0] : null;
            },
            async update() {
                let resp = await dynamicFormService.update(this.form.id, this.data);
                if (resp.data.success) {
                    Message.success(resp.data.message);
                }
            },
            async add() {
                let resp = await dynamicFormService.add(this.form.id, this.data);
                if (!resp.data.success) {
                    return null;
                }

                this.data.id = resp.data.data;
                Message.success(resp.data.message);
                return this.data.id;
            },
            validate() {
            }
        },
        watch: {
            data: {
                handler: function (val) {
                    console.log(val);
                },
                deep: true
            }
        },
        components: {
            Cascader, TreeSelect
        }
    }
</script>
<style scoped>
    .dynamic-form > tr > td {
        padding: 5px 0;
    }

    .dynamic-form > tr > td > label {
        margin: 0 8px;
        text-align: right;
    }
</style>
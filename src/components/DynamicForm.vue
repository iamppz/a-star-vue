<template>
    <div :style="{width: widthPixel}">
        <table class="dynamic-form" width="100%">
            <tr v-for="i in form.row" v-bind:key="i">
                <template v-for="j in form.col">
                    <td v-if="getCell(i, j) !== null" v-bind:key="j" :colspan="getCell(i, j).colspan"
                        :rowspan="getCell(i, j).rowspan" :width="cellWidth * getCell(i, j).colspan + 'px'"
                        :height="cellHeight * getCell(i, j).rowspan + 'px'">
                        <label v-if="getCell(i, j).type === 'label'">{{getCell(i, j).text}}</label>
                        <input v-if="getCell(i, j).type === 'input'" v-model="data[getCell(i, j).binding]"/>
                        <textarea v-if="getCell(i, j).type === 'textarea'"
                                  v-model="data[getCell(i, j).binding]"></textarea>
                    </td>
                </template>
            </tr>
        </table>
    </div>
</template>
<script>
    import {Message} from "element-ui";

    import dynamicFormService from "../service/dynamicFormService";

    export default {
        props: {
            formId: {
                type: Number,
                default: 0
            },
            dataId: {
                type: Number,
                default: null
            }
        },
        data() {
            return {
                form: {},
                data: {}
            }
        },
        async mounted() {
            let resp = await dynamicFormService.get(this.formId);
            if (resp.data.success) {
                this.form = resp.data.data;
            }

            if (this.dataId) {
                resp = await dynamicFormService.getData(this.form.id, this.dataId);
                if (resp.data.success) {
                    this.data = resp.data.data;
                }
            }
        },
        computed: {
            widthPixel() {
                return (this.form.width || 720) + 'px';
            },
            cellWidth() {
                return this.width / this.col;
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
        }
    }
</script>
<style scoped>
    .dynamic-form {
        border-collapse: collapse;
    }

    .dynamic-form > tr > td {
        box-sizing: border-box;
        border: 1px solid #d3d3d3;
    }

    .dynamic-form > tr > td > input, textarea {
        width: 100%;
        height: 100%;
        border: 0;
        padding: 8px;
        box-sizing: border-box;
        display: block;
        font-family: inherit;
    }

    .dynamic-form > tr > td > label {
        margin: 0 8px;
    }
</style>
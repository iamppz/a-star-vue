<template>
    <div :style="{width: widthPixel}">
        <table class="dynamic-form" width="100%">
            <tr v-for="i in row" v-bind:key="i">
                <template v-for="j in col">
                    <td v-if="getCell(i, j) !== null" v-bind:key="j" :colspan="getCell(i, j).colspan"
                        :rowspan="getCell(i, j).rowspan" :width="cellWidth * getCell(i, j).colspan + 'px'"
                        :height="cellHeight * getCell(i, j).rowspan + 'px'">
                        <label v-if="getCell(i, j).type === 'label'">{{getCell(i, j).text}}</label>
                        <input v-if="getCell(i, j).type === 'input'" v-model="value[getCell(i, j).binding]"/>
                        <textarea v-if="getCell(i, j).type === 'textarea'"></textarea>
                    </td>
                </template>
            </tr>
        </table>
        <div class="toolbar">
            <el-button>保存</el-button>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            row: {
                type: Number,
                default: 0
            },
            col: {
                type: Number,
                default: 0
            },
            cells: {
                type: Array,
                default: () => []
            },
            width: {
                type: Number,
                default: 720
            },
            value: {
                type: Object,
                default: null
            }
        },
        data() {
            return {}
        },
        name: 'DynamicForm',
        mounted() {
        },
        computed: {
            widthPixel() {
                return this.width + 'px';
            },
            cellWidth() {
                return this.width / this.col;
            },
            cellHeight() {
                return 36;
            }
        },
        methods: {
            getCell(row, col) {
                let filtered = this.cells.filter(cell => cell.row === row && cell.col === col);
                return filtered.length > 0 ? filtered[0] : null;
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

    .toolbar {
        padding: 10px 0;
        text-align: center;
    }

</style>
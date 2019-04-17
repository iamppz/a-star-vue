<template>
    <table class="dynamic-form">
        <tr v-for="i in row" v-bind:key="i" :width="widthPixel">
            <template v-for="j in col">
                <td v-if="getCell(i, j) !== null" v-bind:key="j" :colspan="getCell(i, j).colspan"
                    :rowspan="getCell(i, j).rowspan" :width="cellWidth * getCell(i, j).colspan + 'px'"
                    :height="cellHeight * getCell(i, j).rowspan + 'px'">
                    <label v-if="getCell(i, j).type === 'label'">{{getCell(i, j).text}}</label>
                </td>
            </template>
        </tr>
    </table>
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
        border: 1px solid #e6e6e6;
    }
</style>
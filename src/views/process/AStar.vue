<template>
    <table id="table">
        <tr v-for="i in row" v-bind:key="i">
            <td v-for="j in col" v-bind:key="i + ',' + j"
                :class="{
                    cell: true,
                    block: blocks.find(b => b.x === i && b.y === j) != null,
                    from: from.x === i && from.y === j,
                    to: to.x === i && to.y === j
                }">
                {{i + ',' + j}}
            </td>
        </tr>
    </table>
</template>
<script>
    export default {
        data() {
            return {
                row: 30,
                col: 30,
                from: {x: 15, y: 8},
                to: {x: 14, y: 30},
                blocks: [
                    {x: 1, y: 1},
                    {x: 12, y: 22},
                    {x: 12, y: 11},
                    {x: 12, y: 12},
                    {x: 12, y: 13},
                    {x: 12, y: 14},
                    {x: 12, y: 15},
                    {x: 12, y: 16},
                    {x: 12, y: 17},
                    {x: 12, y: 18},
                    {x: 12, y: 19},
                    {x: 12, y: 20},
                    {x: 12, y: 21},
                    {x: 13, y: 22},
                    {x: 14, y: 22},
                    {x: 15, y: 22},
                    {x: 16, y: 22},
                    {x: 17, y: 22},
                    {x: 17, y: 22},
                    {x: 17, y: 11},
                    {x: 17, y: 12},
                    {x: 17, y: 13},
                    {x: 17, y: 14},
                    {x: 17, y: 15},
                    {x: 17, y: 16},
                    {x: 17, y: 17},
                    {x: 17, y: 18},
                    {x: 17, y: 19},
                    {x: 17, y: 20},
                    {x: 17, y: 21}
                ]
            };
        }
    }
</script>
<style scoped>
    .cell {
        width: 50px;
        height: 50px;
        border: 1px solid black;
        text-align: center;
    }

    .block {
        background: black;
        color: white;
    }

    .from {
        background: yellow;
        color: black;
    }

    .to {
        background: green;
        color: white;
    }

    #table {
        border-collapse: collapse;
    }
</style>
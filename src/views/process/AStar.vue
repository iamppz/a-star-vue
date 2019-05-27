<template>
    <div>
        <table id="table">
            <tr v-for="i in row" v-bind:key="i">
                <td v-for="j in col" v-bind:key="i + ',' + j" :class="{
                    cell: true,
                    block: blocks.find(b => b.x === i && b.y === j) != null,
                    from: from.x === i && from.y === j,
                    to: to.x === i && to.y === j,
                    open: openList.findIndex(item => item.x === i && item.y === j) > 0,
                    close: closedList.findIndex(item => item.x === i && item.y === j) > 0
                }">
                    {{i + ',' + j}}
                </td>
            </tr>
        </table>
        <button @click="start">Start</button>
    </div>
</template>
<script>
    import _ from 'lodash';

    export default {
        data() {
            return {
                row: 30,
                col: 30,
                from: {x: 15, y: 8},
                to: {x: 14, y: 30},
                current: null,
                closedList: [],
                openList: [],
                hvCost: 10,
                diagonalCost: 14,
                adjacentOffsets: [
                    {
                        x: 0, y: -1
                    },
                    {
                        x: 0, y: 1
                    },
                    {
                        x: -1, y: 0
                    },
                    {
                        x: 1, y: 0
                    }
                ],
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
        },
        methods: {
            start() {
                this.openList.push(this.from);
                while (this.openList.length > 0) {
                    this.openList = _.sortBy(this.openList, item => item.f);
                    this.current = this.openList.pop();

                    this.adjacentOffsets.forEach(offset => {
                        let adjacentNode = {
                            x: this.current.x + offset.x,
                            y: this.current.y + offset.y
                        };
                        if (!this.openList.find(item => item.x === adjacentNode.x && item.y === adjacentNode.y)) {
                            adjacentNode.previous = this.current;
                            let cost = offset.x === 0 || offset.y === 0 ? 10 : 14;
                            adjacentNode.g = adjacentNode.previous.g + cost;
                            adjacentNode.h = Math.abs(this.to.x - adjacentNode.x) + Math.abs(this.to.y - adjacentNode.y);
                            adjacentNode.f = adjacentNode.g + adjacentNode.h;
                            this.openList.push(adjacentNode);
                        } else {

                        }
                    });

                    this.closedList.push(this.current);
                }
            }
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

    .open {
        background: gray;
        color: white;
    }

    .close {
        background: black;
        color: white;
    }

    #table {
        border-collapse: collapse;
    }
</style>
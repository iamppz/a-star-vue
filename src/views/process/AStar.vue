<template>
    <div>
        <table id="table">
            <tr v-for="i in row" v-bind:key="i">
                <td v-for="j in col" v-bind:key="i + ',' + j" :class="{
                    cell: true,
                    block: blocks.find(b => b.x === i && b.y === j) != null,
                    from: from.x === i && from.y === j,
                    to: to.x === i && to.y === j,
                    open: openList.findIndex(item => item.x === i && item.y === j) >= 0,
                    close: closedList.findIndex(item => item.x === i && item.y === j) >= 0,
                    path: path.findIndex(item => item.x === i && item.y === j) >= 0,
                }">
                    {{i + ',' + j}}
                </td>
            </tr>
        </table>
        <button @click="forward">Forward</button>
        <button @click="forwardAutomatically">Auto Forward</button>
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
                closedList: [],
                openList: [],
                hvCost: 10,
                diagonalCost: 14,
                terrainCost: 1,
                path: [],
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
                    {x: 17, y: 21},
                    {x: 6, y: 25},
                    {x: 7, y: 25},
                    {x: 8, y: 25},
                    {x: 9, y: 25},
                    {x: 10, y: 25},
                    {x: 11, y: 25},
                    {x: 12, y: 25},
                    {x: 13, y: 25},
                    {x: 14, y: 25},
                    {x: 15, y: 25},
                    {x: 16, y: 25},
                    {x: 17, y: 25},
                    {x: 18, y: 25},
                    {x: 19, y: 25},
                ]
            };
        },
        created: function () {
            this.from.g = 0;
            this.from.h = (Math.abs(this.to.x - this.from.x) + Math.abs(this.to.y - this.from.y)) * this.hvCost;
            this.from.f = this.from.g + this.from.h;
            this.openList.push(this.from);
        },
        methods: {
            forwardAutomatically() {
                setInterval(this.forward, 30);
            },
            forward() {
                if (this.path.length > 0) {
                    return;
                }

                if (this.openList.length > 0) {
                    this.openList = _.sortBy(this.openList, item => -item.f);
                    let current = this.openList.pop();

                    if (current.x === this.to.x && current.y === this.to.y) {
                        this.path.push(current);
                        while (current.previous && (current.previous.x !== this.from.x || current.previous.y !== this.from.y)) {
                            this.path.push(current.previous);
                            current = current.previous;
                        }
                        return;
                    }

                    for (const offset of [{x: 0, y: -1}, {x: 0, y: 1}, {x: -1, y: 0}, {x: 1, y: 0}]) {
                        let position = {x: current.x + offset.x, y: current.y + offset.y};

                        if (this.blocks.find(b => b.x === position.x && b.y === position.y)
                            || this.closedList.find(b => b.x === position.x && b.y === position.y)) {
                            continue;
                        }

                        let hvMove = offset.x === 0 || offset.y === 0;
                        let changeDirection = current.previous && !this.areCollinear(current.previous, current, position);
                        let cost = hvMove ? (changeDirection ? 11 : this.hvCost) : this.diagonalCost;
                        for (const offset of [{x: 0, y: -1}, {x: 0, y: 1}, {x: -1, y: 0}, {x: 1, y: 0}]) {
                            let aoa = {x: position.x + offset.x, y: position.y + offset.y};
                            if (this.blocks.find(b => b.x === aoa.x && b.y === aoa.y)) {
                                cost += this.terrainCost;
                            }
                        }

                        let adjacentNode = this.openList.find(item => item.x === position.x && item.y === position.y);
                        if (!adjacentNode) {
                            adjacentNode = Object.assign({}, position);
                            adjacentNode.previous = current;
                            adjacentNode.g = adjacentNode.previous.g + cost;
                            adjacentNode.h = (Math.abs(this.to.x - adjacentNode.x) + Math.abs(this.to.y - adjacentNode.y)) * this.hvCost;
                            adjacentNode.f = adjacentNode.g + adjacentNode.h;
                            this.openList.push(adjacentNode);
                        } else if (current.g + cost <= adjacentNode.g) {
                            // 如果当前节点到该节点路径更优，则将当前节点设置为该节点的父节点
                            adjacentNode.previous = current;
                            adjacentNode.g = adjacentNode.previous.g + cost;
                            adjacentNode.h = (Math.abs(this.to.x - adjacentNode.x) + Math.abs(this.to.y - adjacentNode.y)) * this.hvCost;
                            adjacentNode.f = adjacentNode.g + adjacentNode.h;
                        }
                    }

                    this.closedList.push(current);
                }
            },
            areCollinear(p1, p2, p3) {
                return p3.x - p2.x === p2.x - p1.x && p3.y - p2.y === p2.y - p1.y;
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
        background: yellow !important;
        color: black !important;
    }

    .to {
        background: orange !important;
        color: white !important;
    }

    .open {
        background: gray;
        color: white;
    }

    .close {
        background: red;
        color: white;
    }

    .path {
        background: green;
        color: white;
    }

    #table {
        border-collapse: collapse;
    }
</style>
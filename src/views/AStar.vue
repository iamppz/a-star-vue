<template>
  <div>
    <table id="table">
      <tr v-for="i in row" v-bind:key="i">
        <td
          v-for="j in col"
          v-bind:key="i + ',' + j"
          :class="{
            cell: true,
            block: blocks.find(b => b.x === i && b.y === j) != null,
            from: from.x === i && from.y === j,
            to: to.x === i && to.y === j,
            open: openList.findIndex(item => item.x === i && item.y === j) >= 0,
            close:
              closedList.findIndex(item => item.x === i && item.y === j) >= 0,
            path: path.findIndex(item => item.x === i && item.y === j) >= 0,
            current: current.x === i && current.y === j
          }"
        >
          {{ i + "," + j }}
        </td>
      </tr>
    </table>

    <button @click="forward">Forward</button>
    <button @click="forwardAutomatically">Auto Forward</button>
  </div>
</template>
<script>
import _ from "lodash";

export default {
  data() {
    return {
      row: 25,
      col: 30,
      from: { x: 15, y: 8 },
      to: { x: 14, y: 30 },
      current: { x: 0, y: 0 },
      arrive: false,
      closedList: [],
      openList: [],
      hvCost: 10,
      diagonalCost: 14,
      terrainCost: 1,
      path: [],
      blocks: [
        { x: 1, y: 10 },
        { x: 2, y: 10 },
        { x: 3, y: 10 },
        { x: 4, y: 10 },
        { x: 4, y: 11 },
        { x: 4, y: 12 },
        { x: 4, y: 13 },
        { x: 2, y: 13 },
        { x: 2, y: 14 },
        { x: 2, y: 15 },
        { x: 3, y: 15 },
        { x: 4, y: 15 },
        { x: 5, y: 15 },
        { x: 12, y: 22 },
        { x: 12, y: 11 },
        { x: 12, y: 12 },
        { x: 12, y: 13 },
        { x: 12, y: 14 },
        { x: 12, y: 15 },
        { x: 12, y: 16 },
        { x: 12, y: 17 },
        { x: 12, y: 18 },
        { x: 12, y: 19 },
        { x: 12, y: 20 },
        { x: 12, y: 21 },
        { x: 13, y: 22 },
        { x: 14, y: 22 },
        { x: 15, y: 22 },
        { x: 16, y: 22 },
        { x: 17, y: 22 },
        { x: 17, y: 22 },
        { x: 17, y: 11 },
        { x: 17, y: 12 },
        { x: 17, y: 13 },
        { x: 17, y: 14 },
        { x: 17, y: 15 },
        { x: 17, y: 16 },
        { x: 17, y: 17 },
        { x: 17, y: 18 },
        { x: 17, y: 19 },
        { x: 17, y: 20 },
        { x: 17, y: 21 },
        { x: 6, y: 25 },
        { x: 7, y: 25 },
        { x: 8, y: 25 },
        { x: 9, y: 25 },
        { x: 6, y: 24 },
        { x: 6, y: 23 },
        { x: 6, y: 22 },
        { x: 6, y: 21 },
        { x: 6, y: 20 },
        { x: 6, y: 19 },
        { x: 6, y: 18 },
        { x: 6, y: 17 },
        { x: 6, y: 16 },
        { x: 6, y: 16 },
        { x: 6, y: 14 },
        { x: 6, y: 13 },
        { x: 6, y: 12 },
        { x: 6, y: 11 },
        { x: 6, y: 10 },
        { x: 6, y: 9 },
        { x: 6, y: 8 },
        { x: 6, y: 7 },
        { x: 6, y: 6 },
        { x: 6, y: 5 },
        { x: 6, y: 15 },
        { x: 7, y: 5 },
        { x: 8, y: 5 },
        { x: 9, y: 5 },
        { x: 10, y: 5 },
        { x: 11, y: 5 },
        { x: 12, y: 5 },
        { x: 13, y: 5 },
        { x: 14, y: 5 },
        { x: 15, y: 5 },
        { x: 16, y: 5 },
        { x: 10, y: 25 },
        { x: 11, y: 25 },
        { x: 12, y: 25 },
        { x: 13, y: 25 },
        { x: 14, y: 25 },
        { x: 15, y: 25 },
        { x: 16, y: 25 },
        { x: 17, y: 25 },
        { x: 18, y: 25 },
        { x: 19, y: 25 },
        { x: 19, y: 24 },
        { x: 19, y: 23 },
        { x: 19, y: 22 },
        { x: 19, y: 21 },
        { x: 19, y: 20 },
        { x: 20, y: 20 },
        { x: 21, y: 20 },
        { x: 22, y: 20 },
        { x: 23, y: 20 },
        { x: 24, y: 20 },
        { x: 24, y: 21 },
        { x: 24, y: 22 },
        { x: 24, y: 23 },
        { x: 24, y: 24 },
        { x: 24, y: 25 },
        { x: 24, y: 26 },
        { x: 24, y: 27 },
        { x: 24, y: 28 },
        { x: 25, y: 29 },
        { x: 12, y: 30 },
        { x: 12, y: 30 },
        { x: 12, y: 29 },
        { x: 12, y: 28 },
        { x: 13, y: 28 },
        { x: 14, y: 28 },
        { x: 15, y: 28 },
        { x: 16, y: 28 },
        { x: 16, y: 29 },
        { x: 24, y: 29 }
      ]
    };
  },
  created: function() {
    this.from.g = 0;
    this.from.h =
      (Math.abs(this.to.x - this.from.x) + Math.abs(this.to.y - this.from.y)) *
      this.hvCost;
    this.from.f = this.from.g + this.from.h;
    this.openList.push(this.from);
  },
  methods: {
    forwardAutomatically() {
      setInterval(this.forward, 10);
    },
    forward() {
      if (this.arrive) {
        return;
      }
      if (this.openList.length > 0) {
        this.openList = _.sortBy(this.openList, item => -item.f);
        let current = this.openList.pop();

        this.current.x = current.x;
        this.current.y = current.y;

        let ref = current;
        this.path.splice(0, this.path.length);
        this.path.push(ref);
        while (
          ref.previous &&
          (ref.previous.x !== this.from.x || ref.previous.y !== this.from.y)
        ) {
          this.path.push(ref.previous);
          ref = ref.previous;
        }

        if (current.x === this.to.x && current.y === this.to.y) {
          this.arrive = true;
        }

        for (const offset of [
          { x: 0, y: -1 },
          { x: 0, y: 1 },
          { x: -1, y: 0 },
          { x: 1, y: 0 }
        ]) {
          let position = { x: current.x + offset.x, y: current.y + offset.y };

          if (
            this.blocks.find(b => b.x === position.x && b.y === position.y) ||
            this.closedList.find(
              b => b.x === position.x && b.y === position.y
            ) ||
            position.y > 30 ||
            position.x > 25 ||
            position.x < 1 ||
            position.y < 1
          ) {
            continue;
          }

          let hvMove = offset.x === 0 || offset.y === 0;
          let changeDirection =
            current.previous &&
            !this.areCollinear(current.previous, current, position);
          let cost = hvMove
            ? changeDirection
              ? 11
              : this.hvCost
            : this.diagonalCost;
          for (const offset of [
            { x: 0, y: -1 },
            { x: 0, y: 1 },
            { x: -1, y: 0 },
            { x: 1, y: 0 }
          ]) {
            let aoa = { x: position.x + offset.x, y: position.y + offset.y };
            if (this.blocks.find(b => b.x === aoa.x && b.y === aoa.y)) {
              cost += this.terrainCost;
            }
          }

          let adjacentNode = this.openList.find(
            item => item.x === position.x && item.y === position.y
          );
          if (!adjacentNode) {
            adjacentNode = Object.assign({}, position);
            adjacentNode.previous = current;
            adjacentNode.g = adjacentNode.previous.g + cost;
            adjacentNode.h =
              (Math.abs(this.to.x - adjacentNode.x) +
                Math.abs(this.to.y - adjacentNode.y)) *
              this.hvCost;
            adjacentNode.f = adjacentNode.g + adjacentNode.h;
            this.openList.push(adjacentNode);
          } else if (current.g + cost <= adjacentNode.g) {
            // 如果当前节点到该节点路径更优，则将当前节点设置为该节点的父节点
            adjacentNode.previous = current;
            adjacentNode.g = adjacentNode.previous.g + cost;
            adjacentNode.h =
              (Math.abs(this.to.x - adjacentNode.x) +
                Math.abs(this.to.y - adjacentNode.y)) *
              this.hvCost;
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
};
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
  background: lightskyblue;
  color: black;
}

.close {
  background: gray;
  color: black;
}

.path {
  background: green;
  color: white;
}

#table {
  border-collapse: collapse;
  zoom: 0.5;
}
</style>

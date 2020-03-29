<template>
    <table class="swimlanes">
        <tr>
            <td v-for="(swimlane, i) in data.swimlanes" :key="i"
                class="swimlane" :style="{width: swimlane.span + 'px'}"
                @mouseup="handleSwimlaneMouseUp($event, swimlane)">
                <template v-for="element in swimlane.elements">
                    <div :key="element.id" :class="{instance: true, active: active === element}"
                         @mousedown.stop="handleActive($event, element)">
                        <i class="dragger el-icon-rank"
                           @mousedown.stop="handleDragStart($event, element, swimlane)"></i>
                        <span class="id">{{element.id}}</span>
                        <grid v-if="element.type === 'grid'"
                              :data="element" @dragstart.stop="handleChildDragStart"
                              :active="active" @active.stop="handleChildActive"
                              @mouseup.stop="handleChildSwimlaneMouseUp"></grid>
                        <div v-if="element.type === 'input'">
                            <table class="input">
                                <tr>
                                    <td style="width: 80px; text-align: right;">
                                        <span>字段：</span>
                                    </td>
                                    <td>
                                        <el-input></el-input>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </template>
            </td>
        </tr>
    </table>
</template>

<script>
  export default {
    name: 'Grid',
    props: {
      data: {
        type: Object,
        default: null,
      },
      active: {
        type: Object,
        default: null,
      },
    },
    computed: {},
    methods: {
      handleDragStart(event, element, parent) {
        event.element = element;
        event.swimlane = parent;
        this.$emit('dragstart', event);
      },
      handleSwimlaneMouseUp(event, swimlane) {
        event.swimlane = swimlane;
        this.$emit('mouseup', event);
      },
      handleChildDragStart(event) {
        this.$emit('dragstart', event);
      },
      handleChildSwimlaneMouseUp(event) {
        this.$emit('mouseup', event);
      },
      handleActive(event, element) {
        event.element = element;
        this.$emit('active', event);
      },
      handleChildActive(event) {
        this.$emit('active', event);
      },
    },
  };
</script>

<style scoped>
    @import "../../assets/grid.css";
</style>
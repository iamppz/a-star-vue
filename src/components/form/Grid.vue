<template>
    <table :class="['swimlanes', mode]">
        <template v-if="direction === 'column'">
            <tr>
                <td v-for="(swimlane, i) in data.swimlanes" :key="i"
                    :class="['swimlane', direction]" :style="{width: swimlane.span + 'px'}"
                    @mouseup="handleSwimlaneMouseUp($event, swimlane, data)">
                    <template v-for="element in swimlane.elements">
                        <!--suppress HtmlUnknownTag -->
                        <cell :element="element" :key="element.id" :direction="direction"
                              @dragstart="handleDragStart" @mouseup="handleSwimlaneMouseUp"
                              :mode="mode" @active="handleActive" :swimlane="swimlane"
                              :active="active"></cell>
                    </template>
                </td>
            </tr>
        </template>
        <template v-else>
            <tr v-for="(swimlane, i) in data.swimlanes" :key="i">
                <td :class="['swimlane', direction]"
                    @mouseup="handleSwimlaneMouseUp($event, swimlane, data)">
                    <template v-for="element in swimlane.elements">
                        <!--suppress HtmlUnknownTag -->
                        <cell :element="element" :key="element.id" :direction="direction"
                              :labeled="i === 0" :mode="mode"
                              @dragstart="handleDragStart" @mouseup="handleSwimlaneMouseUp"
                              @active="handleActive" :swimlane="swimlane" :active="active"></cell>
                    </template>
                </td>
            </tr>
        </template>
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
      mode: {
        type: String,
        default: 'design',
      },
      direction: {
        type: String,
        default: 'column',
      },
    },
    data: function() {
      return {};
    },
    computed: {},
    methods: {
      handleDragStart(event) {
        this.$emit('dragstart', event);
      },
      handleSwimlaneMouseUp(event, swimlane, parent) {
        if (swimlane) {
          event.swimlane = swimlane;
          event.parent = parent;
        }
        this.$emit('mouseup', event);
      },
      handleActive(event) {
        this.$emit('active', event);
      },
    },
    beforeCreate() {
      this.$options.components.Cell = () => import('./Cell.vue');
    },
  };
</script>

<style scoped>
    @import "../../assets/grid.css";
</style>
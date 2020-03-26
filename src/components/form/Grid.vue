<template>
    <table class="swimlanes">
        <tr>
            <td v-for="(swimlane, i) in data.swimlanes" :key="i"
                class="swimlane" :style="{width: swimlane.span + '%'}"
                @mouseup="handleSwimlaneMouseUp($event, swimlane)">
                <template v-if="swimlane.elements">
                    <template v-for="element in swimlane.elements">
                        <div :key="element.id" class="instance"
                             @mousedown.stop="handleElementMouseDown($event)">
                            <i class="dragger el-icon-rank"
                               @mousedown.stop="handleDraggerMouseDown($event, element, swimlane)"></i>
                            <span class="id">{{element.id}}</span>
                            <grid :data="element" @mousedown.stop="handleChildDraggerMouseDown"
                                  @mouseup.stop="handleChildSwimlaneMouseUp"></grid>
                        </div>
                    </template>
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
    },
    computed: {},
    methods: {
      handleDraggerMouseDown(event, element, parent) {
        event.element = element;
        event.swimlane = parent;
        this.$emit('mousedown', event);
      },
      handleSwimlaneMouseUp(event, element) {
        event.element = element;
        this.$emit('mouseup', event);
      },
      handleChildDraggerMouseDown(event) {
        this.$emit('mousedown', event);
      },
      handleChildSwimlaneMouseUp(event) {
        this.$emit('mouseup', event);
      },
      handleElementMouseDown(event) {
        let actives = document.getElementsByClassName('active');
        for (let element of actives) {
          element.classList.remove('active');
        }
        event.target.closest('.instance').classList.add('active');
      },
    },
  };
</script>

<style scoped>
    @import "../../assets/grid.css";
</style>
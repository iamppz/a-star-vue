<template>
    <table class="row">
        <tr>
            <td v-for="(swimlane, i) in data.swimlanes" :key="i"
                class="col" :style="{width: swimlane.span + '%'}"
                @mouseup="handleSwimlaneMouseUp($event, swimlane)">
                <template v-if="swimlane.elements">
                    <div v-for="(element, j) in swimlane.elements" :key="i + '-' + j"
                         :class="{active: element === active, instance: true}">
                        <i class="dragger el-icon-rank"
                           @mousedown.stop="handleElementMouseDown($event, element, swimlane)"></i>
                        <grid :data="element" @mousedown.stop="handleChildElementMouseDown"
                              @mouseup="handleChildSwimlaneMouseUp"></grid>
                    </div>
                </template>
            </td>
        </tr>
    </table>
</template>

<script>
  import '../../assets/dynamic-form.css';

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
      handleElementMouseDown(event, element, parent) {
        event.element = element;
        event.swimlane = parent;
        this.$emit('mousedown', event);
      },
      handleSwimlaneMouseUp(event, element) {
        event.element = element;
        this.$emit('mouseup', event);
      },
      handleChildElementMouseDown(event) {
        this.$emit('mousedown', event);
      },
      handleChildSwimlaneMouseUp(event) {
        this.$emit('mouseup', event);
      },
    },
  };
</script>

<style scoped>
    .row {
        border: 1px dashed #a3a3a3;
        width: 100%;
    }

    .col {
        border: 1px dashed #a3a3a3;
        height: 50px;
        padding: 6px;
    }
</style>
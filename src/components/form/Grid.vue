<template>
    <table class="row">
        <tr>
            <td v-for="(swimlane, i) in data.swimlanes" :key="i"
                class="col" :style="{width: swimlane.span + '%'}"
                @mouseup="handleSwimlaneMouseUp($event, swimlane)">
                <template v-if="swimlane.elements">
                    <div v-for="(element, j) in swimlane.elements" :key="i + '-' + j"
                         :class="{instance: true}" @mousedown="handleElementMouseDown($event)">
                        <i class="dragger el-icon-rank"
                           @mousedown.stop="handleDraggerMouseDown($event, element, swimlane)"></i>
                        <span class="id">{{element.id}}</span>
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
      handleChildElementMouseDown(event) {
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
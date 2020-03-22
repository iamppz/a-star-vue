<template>
    <table class="row" @mousedown="handleMouseDown(data, $event)">
        <tr>
            <td v-for="(col, i) in data.children" :key="i"
                class="col" :style="{width: col.span + '%'}"
                @mouseup="handleMouseUp(col, $event)">
                <template v-if="col.elements">
                    <div v-for="(element, j) in col.elements" :key="i + '-' + j"
                         :class="{active: element === active, instance: true}">
                        <grid :data="element" @mouseup.stop="handleChildMouseUp"
                              @mousedown.stop="handleChildMouseDown(...arguments, col)"></grid>
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
      handleMouseUp(element, event) {
        event.element = element;
        this.$emit('mouseup', event);
      },
      handleChildMouseUp(event) {
        this.$emit('mouseup', event);
      },
      handleMouseDown(element, event) {
        event.element = element;
        this.$emit('mousedown', event);
      },
      handleChildMouseDown(event, parent) {
        if (!event.parentElement) {
          event.parentElement = parent;
        }
        this.$emit('mousedown', event);
      },
    },
  };
</script>

<style scoped>
    .row {
        border: 1px dashed #dadce0;
        width: 100%;
    }

    .row:not(:first-child) {
        margin-top: 6px;
    }

    .col {
        border: 1px dashed #dadce0;
        height: 50px;
        padding: 6px;
    }

    .instance.active {
        border: 1px solid #1890ff;
    }
</style>
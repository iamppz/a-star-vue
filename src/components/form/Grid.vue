<template>
    <table class="row" @mousedown="handleMouseDown(data, $event)">
        <tr>
            <td v-for="(child, i) in data.children" :key="i"
                class="col" :style="{width: child.span + '%'}"
                @mouseup="handleMouseUp(child, $event)">
                <template v-if="child.elements">
                    <grid v-for="(grandchild, j) in child.elements" :data="grandchild"
                          :key="i + '-' + j" @mouseup.stop="handleChildMouseUp"
                          @mousedown.stop="handleChildMouseDown(...arguments, child)"></grid>
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
    computed: {
    },
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
</style>
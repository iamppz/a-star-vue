<template>
    <table class="row" @mousedown="handleMouseDown(data, $event)">
        <tr>
            <td v-for="(child, i) in formattedData.children" :key="i"
                class="col" :style="{width: child.width}"
                @mouseup="handleMouseUp(child, $event)">
                <template v-if="child.elements">
                    <layout v-for="(grandchild, j) in child.elements" :data="grandchild"
                            :key="i + '-' + j" @mouseup.stop="handleChildMouseUp"
                            @mousedown.stop="handleChildMouseDown"></layout>
                </template>
            </td>
        </tr>
    </table>
</template>

<script>
  export default {
    name: 'Layout',
    props: {
      data: {
        type: Object,
        default: null,
      },
    },
    computed: {
      formattedData() {
        let result = Object.assign({}, this.data);
        result.children.forEach(child => {
          let totalSpan = result.children.reduce((result, current) => result + current.span, 0);
          child.width = child.span / totalSpan * 100 + '%';
        });
        return result;
      },
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
      handleChildMouseDown(event) {
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
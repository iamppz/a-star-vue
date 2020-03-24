<template>
    <table class="row">
        <tr>
            <td v-for="(form, i) in data.children" :key="i"
                class="col" :style="{width: form.span + '%'}"
                @mouseup="handleMouseUp($event, form)">
                <template v-if="form.elements">
                    <div v-for="(element, j) in form.elements" :key="i + '-' + j"
                         :class="{active: element === active, instance: true}">
                        <i class="dragger el-icon-rank"
                           @mousedown.stop="handleChildMouseDown($event, element, form)"></i>
                        <grid :data="element"></grid>
                    </div>
                </template>
            </td>
        </tr>
    </table>
</template>

<script>
  import '../../assets/dynamicform.css';

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
      handleChildMouseDown(event, element, parent) {
        event.element = element;
        event.parentElement = parent;
        this.$emit('mousedown', event);
      },
      handleMouseUp(event, element) {
        event.element = element;
        this.$emit('mouseup', event);
      },
    },
  };
</script>

<style scoped>
    .row {
        border: 1px dashed #dadce0;
        width: 100%;
    }

    .col {
        border: 1px dashed #dadce0;
        height: 50px;
        padding: 6px;
    }
</style>
<template>
    <table :class="['swimlanes', mode]">
        <tr>
            <td v-for="(swimlane, i) in data.swimlanes" :key="i"
                :class="['swimlane', direction]" :style="{width: swimlane.span + 'px'}"
                @mouseup="handleSwimlaneMouseUp($event, swimlane)">
                <template v-for="element in swimlane.elements">
                    <div :key="element.id" :class="{instance: true, active: active === element}"
                         @mousedown.stop="handleActive($event, element)">
                        <i :class="['dragger', 'el-icon-rank']"
                           @mousedown.stop="handleDragStart($event, element, swimlane)"></i>
                        <span class="id">{{element.id}}</span>
                        <grid v-if="element.type === 'grid'"
                              :data="element" @dragstart.stop="handleChildDragStart"
                              :active="active" @active.stop="handleChildActive"
                              @mouseup.stop="handleChildSwimlaneMouseUp"></grid>
                        <div v-if="element.type === 'input'">
                            <form-group :layout="direction === 'row' ? 'inline' : 'default'">
                                <span slot="label" :title="element.label">{{element.label}}</span>
                                <el-input slot="element"
                                          :placeholder="element.placeholder"></el-input>
                            </form-group>
                        </div>
                        <div v-if="element.type === 'dropdown'">
                            <form-group :layout="direction === 'row' ? 'inline' : 'default'">
                                <span slot="label" :title="element.label">{{element.label}}</span>
                                <select-wrapper slot="element" :options="element.options"
                                                :placeholder="element.placeholder"></select-wrapper>
                            </form-group>
                        </div>
                        <div v-if="element.type === 'list'">
                            <form-group class="list">
                                    <span slot="label"
                                          :title="element.label">{{element.label}}</span>
                                <grid slot="element" :mode="mode" direction="row" :data="element"
                                      @mouseup="handleSwimlaneMouseUp($event, element.swimlanes[0])"></grid>
                            </form-group>
                        </div>
                    </div>
                </template>
            </td>
        </tr>
    </table>
</template>

<script>
  import SelectWrapper from '../SelectWrapper';
  import FormGroup from './FormGroup';

  export default {
    name: 'Grid',
    components: {FormGroup, SelectWrapper},
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
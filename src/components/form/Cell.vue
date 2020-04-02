<template>
    <div :class="{instance: true, active: active === element}"
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
                <span slot="label" :title="element.label">{{element.label}}</span>
                <div slot="element">
                    <grid :mode="mode" direction="row"
                          :data="element"
                          @mouseup="handleSwimlaneMouseUp($event, element.swimlanes[0], element)"></grid>
                    <el-button type="text"
                               @click="element.swimlanes.push({elements: []})">
                        添加行
                    </el-button>
                </div>
            </form-group>
        </div>
    </div>
</template>

<script>
  import FormGroup from './FormGroup';
  import Grid from './Grid';
  import SelectWrapper from '../SelectWrapper';

  export default {
    name: 'Cell',
    components: {SelectWrapper, Grid, FormGroup},
    props: {
      element: {
        type: Object,
        default: null,
      },
      swimlane: {
        type: Object,
        default: null,
      },
      active: {
        type: Object,
        default: null,
      },
      direction: {
        type: String,
        default: 'column',
      },
      mode: {
        type: String,
        default: 'design',
      },
    },
    methods: {
      handleDragStart(event, element, parent) {
        event.element = element;
        event.swimlane = parent;
        this.$emit('dragstart', event);
      },
      handleSwimlaneMouseUp(event, swimlane, parent) {
        event.swimlane = swimlane;
        event.parent = parent;
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

</style>
<template>
    <div :class="{instance: true, active: active === element}"
         @mousedown.stop="handleActive($event, element)">
        <i :class="['dragger', 'el-icon-rank']"
           @mousedown.stop="handleDragStart($event, element, swimlane)"></i>
        <span class="id">{{element.id}}</span>
        <grid v-if="element.type === 'grid'" :mode="mode"
              :data="element" @dragstart.stop="handleChildDragStart"
              :active="active" @active.stop="handleChildActive"
              @mouseup.stop="handleChildSwimlaneMouseUp"></grid>
        <form-group v-if="element.type === 'input'" :required="element.required"
                    :layout="direction === 'row' ? 'inline' : 'default'">
            <span slot="label" v-if="labeled" :title="element.label">{{element.label}}</span>
            <el-input slot="element" :placeholder="element.placeholder"></el-input>
        </form-group>
        <form-group v-if="element.type === 'textarea'" :required="element.required"
                    :layout="direction === 'row' ? 'inline' : 'default'">
            <span slot="label" v-if="labeled" :title="element.label">{{element.label}}</span>
            <el-input type="textarea" slot="element" :placeholder="element.placeholder"></el-input>
        </form-group>
        <form-group v-if="element.type === 'datetime'" :required="element.required"
                    :layout="direction === 'row' ? 'inline' : 'default'">
            <span slot="label" v-if="labeled" :title="element.label">{{element.label}}</span>
            <el-date-picker slot="element" :placeholder="element.placeholder"
                            style="width: 100%;"></el-date-picker>
        </form-group>
        <form-group v-if="element.type === 'dropdown'" :required="element.required"
                    :layout="direction === 'row' ? 'inline' : 'default'">
            <span slot="label" v-if="labeled" :title="element.label">{{element.label}}</span>
            <select-wrapper slot="element" :options="element.options"
                            :placeholder="element.placeholder"></select-wrapper>
        </form-group>
        <form-group v-if="element.type === 'checkbox'" :required="element.required"
                    :layout="direction === 'row' ? 'inline' : 'default'">
            <span slot="label" v-if="labeled" :title="element.label">{{element.label}}</span>
            <div slot="element">
                <el-checkbox v-for="option in element.options" :label="option.label"
                             :key="option.value">
                    {{option.label}}
                </el-checkbox>
            </div>
        </form-group>
        <form-group v-if="element.type === 'radio'" :required="element.required"
                    :layout="direction === 'row' ? 'inline' : 'default'">
            <span slot="label" v-if="labeled" :title="element.label">{{element.label}}</span>
            <div slot="element">
                <el-radio v-for="option in element.options" :label="option.label"
                             :key="option.value">
                    {{option.label}}
                </el-radio>
            </div>
        </form-group>
        <form-group v-if="element.type === 'list'" class="list">
            <span slot="label" :title="element.label">{{element.label}}</span>
            <div slot="element">
                <grid :mode="mode" direction="row" :data="element" :active="active"
                      @active.stop="handleChildActive" @dragstart.stop="handleChildDragStart"
                      @mouseup="handleSwimlaneMouseUp($event, element.swimlanes[0], element)"></grid>
                <el-button type="text" v-if="mode === 'edit'"
                           @click="element.swimlanes.push({elements: JSON.parse(JSON.stringify(element.swimlanes[0].elements))})">
                    添加行
                </el-button>
            </div>
        </form-group>
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
      labeled: {
        type: Boolean,
        default: true,
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
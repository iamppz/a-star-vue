<template>
    <table :class="['swimlanes', mode]">
        <tr>
            <td v-for="(swimlane, i) in data.swimlanes" :key="i"
                class="swimlane" :style="{width: swimlane.span + 'px'}"
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
                            <table class="form-group">
                                <tr>
                                    <td class="label">
                                        <span :title="element.label">{{element.label}}</span>
                                    </td>
                                    <td>
                                        <el-input :placeholder="element.placeholder"></el-input>
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div v-if="element.type === 'dropdown'">
                            <table class="form-group">
                                <tr>
                                    <td class="label">
                                        <span :title="element.label">{{element.label}}</span>
                                    </td>
                                    <td>
                                        <el-select :placeholder="element.placeholder"
                                                   style="width: 100%;">
                                            <el-option v-for="item in element.options"
                                                       :key="item.value" :label="item.label"
                                                       :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div v-if="element.type === 'list'">
                            <table class="form-group list">
                                <tr>
                                    <td class="label">
                                        <span :title="element.label">{{element.label}}</span>
                                    </td>
                                    <td class="swimlane"
                                        @mouseup="handleSwimlaneMouseUp($event, element)">
                                        <template v-for="item in element.elements">
                                            <div :key="item.id"
                                                 :class="{instance: true, active: active === item}"
                                                 @mousedown.stop="handleActive($event, item)">
                                                <i :class="['dragger', 'el-icon-rank']"
                                                   @mousedown.stop="handleDragStart($event, item, element)"></i>
                                                <span class="id">{{item.id}}</span>
                                                <div v-if="item.type === 'input'">
                                                    <table class="form-group">
                                                        <tr>
                                                            <td class="label">
                                                                <span :title="item.label">
                                                                    {{item.label}}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <el-input
                                                                        :placeholder="item.placeholder"></el-input>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </div>
                                                <div v-if="item.type === 'dropdown'">
                                                    <table class="form-group">
                                                        <tr>
                                                            <td class="label">
                                                                <span :title="item.label">
                                                                    {{item.label}}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <el-select style="width: 100%;"
                                                                           :placeholder="item.placeholder">
                                                                    <el-option
                                                                            v-for="item in item.options"
                                                                            :key="item.value"
                                                                            :label="item.label"
                                                                            :value="item.value">
                                                                    </el-option>
                                                                </el-select>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </div>
                                            </div>
                                        </template>
                                    </td>
                                </tr>
                            </table>
                        </div>
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
      mode: {
        type: String,
        default: 'design',
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
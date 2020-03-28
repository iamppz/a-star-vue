<template>
    <table class="layout" @mousemove="handleMouseMove($event)"
           @mouseup="handleInstanceMouseUp(data.swimlanes[0].elements)">
        <tr>
            <td class="left" rowspan="2">
                <div>基础字段</div>
                <ul class="panel">
                    <li :class="['widget', (!item.enable ? 'disable': '')]"
                        @mousedown="handleWidgetMouseDown(item, $event)"
                        v-for="item in basicWidgets" :key="'widget' + item.type">
                        <span :class="['iconfont', item.icon]"></span>
                        {{item.name}}
                    </li>
                </ul>
                <div>高级字段</div>
                <ul class="panel">
                    <li :class="['widget', (!item.enable ? 'disable': '')]"
                        @mousedown="handleWidgetMouseDown(item, $event)"
                        v-for="item in advancedWidgets" :key="'widget' + item.type">
                        <span :class="['iconfont', item.icon]"></span>
                        {{item.name}}
                    </li>
                </ul>
                <div v-if="draggingInfo.target !== null" id="draggable"
                     :style="{top: draggingInfo.y + 'px', left: draggingInfo.x + 'px'}">
                </div>
            </td>

            <td class="toolbar">
                <el-button type="text" icon="el-icon-delete">清空</el-button>
                <el-button type="text" icon="el-icon-view">预览</el-button>
            </td>

            <td class="right" rowspan="2">
                <div class="placeholder" v-if="currentInstance.target === null">
                    请选择字段
                </div>
                <div v-if="currentInstance.target !== null">
                    <div v-if="currentInstance.target.type === 'grid'">
                        <div v-for="swimlane in currentInstance.target.swimlanes"
                             style="margin-bottom: 10px;">
                            <i class="iconfont iconsort" style="cursor: move"></i>
                            &nbsp;
                            <el-input v-model="swimlane.span" style="width: 200px;"
                                      size="small"></el-input>
                            &nbsp;
                            <el-button type="text" icon="el-icon-delete"
                                       style="cursor: pointer"></el-button>
                        </div>
                        <el-button type="text" icon="el-icon-plus"
                                   @click="currentInstance.target.swimlanes.push({span: 50, elements: []})">
                            添加列
                        </el-button>
                    </div>
                    <!--                    {{currentInstance.target}}-->
                </div>
            </td>
        </tr>
        <tr>
            <td class="form" @mousemove="handleFormMouseMove($event)">
                <div style="height: 100%; overflow-y: auto;">
                    <div class="placeholder" v-if="data.swimlanes[0].elements.length === 0">
                        从左侧拖拽或点击来添加字段
                    </div>
                    <grid @mouseup.stop="handleInstanceMouseUp($event.swimlane.elements)"
                          style="height: 100%;" :active="currentInstance.target"
                          @dragstart.stop="handleInstanceDragStart" :data="data"
                          @active="handleInstanceMouseDown"></grid>
                </div>
            </td>
        </tr>
    </table>
</template>

<script>
  import Grid from './Grid';
  import {clone, getIndex, removeAllChildNodes} from '../../utils/dom';

  export default {
    name: 'DynamicFormDesigner',
    data() {
      return {
        draggingInfo: {
          target: null,
          offsetX: null,
          offsetY: null,
          x: null,
          y: null,
          html: null,
        },
        basicWidgets: [
          {type: 'input', icon: 'iconinput', name: '输入框', enable: false},
          {type: 'dropdown', icon: 'icondropdown', name: '下拉选择', enable: false},
          {type: 'datetime', icon: 'icondatetime', name: '日期时间', enable: false},
          {type: 'tree', icon: 'icontree', name: '级联选择', enable: false},
          {type: 'checkbox', icon: 'iconcheckbox', name: '多选', enable: false},
          {type: 'radio', icon: 'iconradio', name: '单选', enable: false},
        ],
        advancedWidgets: [
          {type: 'grid', icon: 'icongrid', name: '布局', enable: true},
          {type: 'list', icon: 'iconlist', name: '列表', enable: false},
          {type: 'tab', icon: 'icontab', name: '标签页', enable: false},
          {type: 'separator', icon: 'iconsplit', name: '分割线', enable: false},
        ],
        data: {
          type: 'grid',
          id: new Date().getTime(),
          swimlanes: [{span: 100, elements: []}],
        },
        currentInstance: {
          target: null,
          parent: null,
        },
      };
    },
    methods: {
      handleWidgetMouseDown(widget, event) {
        if (!widget.enable) { return; }

        this.draggingInfo.mode = 'copy';
        this.draggingInfo.target = widget;
        this.draggingInfo.offsetX = event.offsetX;
        this.draggingInfo.offsetY = event.offsetY;
        this.draggingInfo.x = event.clientX - this.draggingInfo.offsetX;
        this.draggingInfo.y = event.clientY - this.draggingInfo.offsetY;
        this.$nextTick(() => {
          let draggable = document.getElementById('draggable');
          draggable.appendChild(event.target.cloneNode(true));
        });
        this.initIndicator();
      },
      handleMouseMove(event) {
        if (this.draggingInfo.target) {
          this.draggingInfo.x = event.clientX - this.draggingInfo.offsetX;
          this.draggingInfo.y = event.clientY - this.draggingInfo.offsetY;
        }
      },
      handleFormMouseMove(event) {
        if (this.draggingInfo.target) {
          let container = this.findContainer(event);
          let indicator = this.initIndicator();
          let refNode = null;
          for (let childNode of container.childNodes) {
            let top = childNode.getBoundingClientRect().top;
            if (event.clientY < top) {
              refNode = childNode;
              break;
            }
          }
          if (refNode === null) {
            container.appendChild(indicator);
          } else {
            container.insertBefore(indicator, refNode);
          }
        }
      },
      findContainer(event) {
        let target = event.target;
        let container;
        if (target.classList.contains('swimlane')) {
          container = target;
        } else {
          container = target.closest('.swimlane');
        }
        container = container || document.getElementsByClassName('swimlane')[0];
        return container;
      },
      initIndicator() {
        let indicators = document.getElementsByClassName('indicator');
        let indicator;
        if (indicators.length > 0) {
          indicator = indicators[0];
        } else {
          indicator = document.createElement('div');
          indicator.classList.add('indicator');
        }
        document.getElementsByClassName('swimlane')[0].appendChild(indicator);
        return indicator;
      },
      handleInstanceMouseUp(elements) {
        if (this.draggingInfo.target) {
          let element = this.draggingInfo.mode === 'move'
              ? this.draggingInfo.target
              : this.createWidgetInstance(this.draggingInfo.target.type);
          let indicatorIndex = this.getIndicatorIndex();
          if (indicatorIndex === 0) {
            elements.unshift(element);
          } else {
            elements.splice(indicatorIndex, 0, element);
          }
          this.currentInstance.target = element;
          this.draggingInfo.target = null;
          this.$nextTick(() => {
            this.removeIndicator();
          });
        }
      },
      handleInstanceMouseDown(event) {
        this.currentInstance.target = event.element;
      },
      handleInstanceDragStart(event) {
        this.currentInstance.target = event.element;
        this.currentInstance.parent = event.swimlane;

        this.draggingInfo.target = event.element;
        this.draggingInfo.offsetX = event.offsetX;
        this.draggingInfo.offsetY = event.offsetY;
        this.draggingInfo.x = event.clientX - this.draggingInfo.offsetX;
        this.draggingInfo.y = event.clientY - this.draggingInfo.offsetY;
        this.draggingInfo.mode = 'move';
        this.$nextTick(() => {
          let draggable = document.getElementById('draggable');
          removeAllChildNodes(draggable);
          draggable.appendChild(clone(event.target.closest('div')));
          let elements = event.swimlane.elements;
          elements.splice(elements.indexOf(event.element), 1);
        });
        this.initIndicator();
      },
      getIndicatorIndex() {
        return getIndex(document.getElementsByClassName('indicator')[0]);
      },
      removeIndicator() {
        let indicators = document.getElementsByClassName('indicator');
        for (let element of indicators) {
          element.remove();
        }
      },
      createWidgetInstance(widgetType) {
        let element = {type: widgetType, id: new Date().getTime()};
        if (element.type === 'grid') {
          element.swimlanes = [{span: 50, elements: []}, {span: 50, elements: []}];
        }
        return element;
      },
    },
    components: {Grid},
    mounted() {
      let that = this;
      document.onkeydown = function(event) {
        switch (event.keyCode) {
          case 27:
            if (that.currentInstance.target) {
              that.currentInstance.target = null;
              that.currentInstance.parent = null;
            }
            break;
          case 46:
            if (that.currentInstance.target) {
              let elements = that.currentInstance.parent
                  ? that.currentInstance.parent.elements
                  : that.elements;
              elements.splice(elements.indexOf(event.element), 1);
            }
            break;
          default:
            break;
        }
      };
    },
  };
</script>
<style scoped>
    @import "../../assets/dynamic-form-designer.css";
</style>
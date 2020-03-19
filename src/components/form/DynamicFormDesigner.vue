<template>
    <table class="layout" @mouseup="widgetDraggingInfo.target = null"
           @mouseleave="widgetDraggingInfo.target = null" @mousemove="handleMouseMove($event)">
        <tr>
            <td class="left">
                <div>基础字段</div>
                <ul class="panel">
                    <li class="widget" @mousedown="handleWidgetMouseDown(item, $event)"
                        v-for="item in basicWidgets" :key="'widget' + item.type">
                        <span :class="['iconfont', item.icon]"></span>
                        {{item.name}}
                    </li>
                </ul>
                <div>高级字段</div>
                <ul class="panel">
                    <li class="widget" @mousedown="handleWidgetMouseDown(item, $event)"
                        v-for="item in advancedWidgets" :key="'widget' + item.type">
                        <span :class="['iconfont', item.icon]"></span>
                        {{item.name}}
                    </li>
                </ul>
                <div v-if="widgetDraggingInfo.target !== null" v-html="widgetDraggingInfo.html"
                     :style="{top: widgetDraggingInfo.y + 'px', left: widgetDraggingInfo.x + 'px', position: 'fixed'}">
                </div>
            </td>
            <td class="center">
                <div class="content" @mousemove="handleContentMouseMove($event)"
                     @mouseup="handleContentMouseUp">
                    <!--                    <div class="placeholder" v-if="elements.length === 0">-->
                    <!--                        从左侧拖拽或点击来添加字段-->
                    <!--                    </div>-->
                    <template v-for="(element, index) in elements">
                        <template v-if="element.type === 'layout'">
                            <layout :data="element" :key="'element-' + index"
                                    @mouseup.stop="handleLayoutMouseUp"
                                    @mousedown.stop="handleInstanceMouseDown"></layout>
                        </template>
                    </template>
                    <div class="indicator" v-show="widgetDraggingInfo.target !== null"></div>
                </div>
            </td>
            <td class="right">Right</td>
        </tr>
    </table>
</template>

<script>
  import Layout from './Layout';

  export default {
    name: 'DynamicFormDesigner',
    data() {
      return {
        widgetDraggingInfo: {
          target: null,
          offsetX: null,
          offsetY: null,
          x: null,
          y: null,
          html: null,
        },
        instanceDraggingInfo: {
          target: null,
          offsetX: null,
          offsetY: null,
          x: null,
          y: null,
        },
        basicWidgets: [
          {type: 'input', icon: 'iconinput', name: '输入框'},
          {type: 'dropdown', icon: 'icondropdown', name: '下拉选择'},
          {type: 'datetime', icon: 'icondatetime', name: '日期时间'},
          {type: 'tree', icon: 'icontree', name: '级联选择'},
          {type: 'checkbox', icon: 'iconcheckbox', name: '多选'},
          {type: 'radio', icon: 'iconradio', name: '单选'},
        ],
        advancedWidgets: [
          {type: 'layout', icon: 'iconinput', name: '布局'},
          {type: 'list', icon: 'iconinput', name: '列表'},
          {type: 'tab', icon: 'iconinput', name: '标签页'},
          {type: 'separator', icon: 'iconinput', name: '分割线'},
        ],
        elements: [],
      };
    },
    methods: {
      handleWidgetMouseDown(widget, event) {
        this.widgetDraggingInfo.target = widget;
        this.widgetDraggingInfo.offsetX = event.offsetX;
        this.widgetDraggingInfo.offsetY = event.offsetY;
        this.widgetDraggingInfo.x = event.clientX - this.widgetDraggingInfo.offsetX;
        this.widgetDraggingInfo.y = event.clientY - this.widgetDraggingInfo.offsetY;
        this.widgetDraggingInfo.html = event.target.outerHTML;
      },
      handleMouseMove(event) {
        if (this.widgetDraggingInfo.target) {
          this.widgetDraggingInfo.x = event.clientX - this.widgetDraggingInfo.offsetX;
          this.widgetDraggingInfo.y = event.clientY - this.widgetDraggingInfo.offsetY;
        } else if (this.instanceDraggingInfo.target) {
          this.instanceDraggingInfo.x = event.clientX - this.instanceDraggingInfo.offsetX;
          this.instanceDraggingInfo.y = event.clientY - this.instanceDraggingInfo.offsetY;
          this.instanceDraggingInfo.element.style.position = 'fixed';
          this.instanceDraggingInfo.element.style.width = 'inherit';
          this.instanceDraggingInfo.element.style.top = this.instanceDraggingInfo.y + 'px';
          this.instanceDraggingInfo.element.style.left = this.instanceDraggingInfo.x + 'px';
        }
      },
      handleContentMouseMove(event) {
        if (this.widgetDraggingInfo.target || this.instanceDraggingInfo.target) {
          let container;
          let target = event.target;
          if (target.classList.contains('col') || target.classList.contains('content')) {
            container = target;
          } else {
            container = target.closest('.col') || target.closest('.content');
          }
          let fragment = document.createDocumentFragment();
          let indicator = document.getElementsByClassName('indicator')[0];
          fragment.appendChild(indicator);
          let refNode = null;
          for (let i = 0; i < container.childNodes.length; i++) {
            let childNode = container.childNodes[i];
            let top = childNode.getBoundingClientRect().top;
            if (event.clientY < top) {
              refNode = childNode;
              break;
            }
          }
          if (refNode === null) {
            container.appendChild(fragment);
          } else {
            container.insertBefore(fragment, refNode);
          }
        }
      },
      handleContentMouseUp(event) {
        if (this.widgetDraggingInfo.target) {
          let instance = this.createWidgetInstance(this.widgetDraggingInfo.target.type);
          this.elements.splice(this.getIndicatorIndex(), 0, instance);
          this.widgetDraggingInfo.target = null;
          this.resetIndicator();
        }
      },
      handleLayoutMouseUp(event) {
        if (this.widgetDraggingInfo.target) {
          let instance = this.createWidgetInstance(this.widgetDraggingInfo.target.type);
          event.element.elements.splice(this.getIndicatorIndex(), 0, instance);
          this.widgetDraggingInfo.target = null;
          this.resetIndicator();
        }
      },
      handleInstanceMouseDown(event) {
        this.instanceDraggingInfo.target = event.element;
        this.instanceDraggingInfo.offsetX = event.offsetX;
        this.instanceDraggingInfo.offsetY = event.offsetY;
        this.instanceDraggingInfo.x = event.clientX - this.instanceDraggingInfo.offsetX;
        this.instanceDraggingInfo.y = event.clientY - this.instanceDraggingInfo.offsetY;
        this.instanceDraggingInfo.element = event.target.closest('table');
      },
      getIndicatorIndex() {
        let indicator = document.getElementsByClassName('indicator')[0];
        let i = 0;
        while ((indicator = indicator.previousSibling) != null) {
          i++;
        }
        return i;
      },
      resetIndicator() {
        let fragment = document.createDocumentFragment();
        fragment.appendChild(document.getElementsByClassName('indicator')[0]);
        let content = document.getElementsByClassName('content')[0];
        content.appendChild(fragment);
      },
      createWidgetInstance(widgetType) {
        let element = {type: widgetType};
        if (element.type === 'layout') {
          element.children = [{span: 12, elements: []}, {span: 12, elements: []}];
        }
        return element;
      },
    },
    components: {Layout},
  };
</script>

<style scoped>
    .layout {
        width: 100%;
        height: 100%;
    }

    .layout td {
        border: 1px solid #dadce0;
        padding: 10px;
    }

    .left {
        width: 280px;
        vertical-align: top;
    }

    .right {
        width: 280px;
    }

    .panel {
        width: 100%;
        list-style: none;
        padding: 0;
    }

    .widget {
        width: 125px;
        display: inline-block;
        cursor: move;
        border: 1px solid #dadce0;
        padding: 5px 10px;
        margin: 2px;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    .content {
        border: 1px dashed #dadce0;
        height: 100%;
        position: relative;
    }

    .placeholder {
        font-size: 20px;
        position: absolute;
        top: calc(50% - 15px);
        left: calc(50% - 130px);
    }

    .indicator {
        height: 5px;
        background-color: lightpink;
    }
</style>
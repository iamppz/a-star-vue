<template>
    <table class="layout" @mousemove="handleMouseMove($event)">
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
                <div v-if="draggingInfo.target !== null" id="draggable"
                     :style="{top: draggingInfo.y + 'px', left: draggingInfo.x + 'px'}">
                </div>
            </td>
            <td class="center">
                <div class="placeholder" v-if="elements.length === 0">
                    从左侧拖拽或点击来添加字段
                </div>
                <div class="form" @mousemove="handleContentMouseMove($event)"
                     @mouseleave="handleFormMouseUp" @mouseup="handleFormMouseUp">
                    <template v-for="(element, index) in elements">
                        <template v-if="element.type === 'grid'">
                            <grid :data="element" :key="'element-' + index"
                                  @mouseup.stop="handleGridMouseUp"
                                  @mousedown.stop="handleInstanceMouseDown"></grid>
                        </template>
                    </template>
                </div>
            </td>
            <td class="right">Right</td>
        </tr>
    </table>
</template>

<script>
  import Grid from './Grid';

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
          {type: 'input', icon: 'iconinput', name: '输入框'},
          {type: 'dropdown', icon: 'icondropdown', name: '下拉选择'},
          {type: 'datetime', icon: 'icondatetime', name: '日期时间'},
          {type: 'tree', icon: 'icontree', name: '级联选择'},
          {type: 'checkbox', icon: 'iconcheckbox', name: '多选'},
          {type: 'radio', icon: 'iconradio', name: '单选'},
        ],
        advancedWidgets: [
          {type: 'grid', icon: 'iconinput', name: '布局'},
          {type: 'list', icon: 'iconinput', name: '列表'},
          {type: 'tab', icon: 'iconinput', name: '标签页'},
          {type: 'separator', icon: 'iconinput', name: '分割线'},
        ],
        elements: [],
      };
    },
    methods: {
      handleWidgetMouseDown(widget, event) {
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
      },
      handleMouseMove(event) {
        if (this.draggingInfo.target) {
          this.draggingInfo.x = event.clientX - this.draggingInfo.offsetX;
          this.draggingInfo.y = event.clientY - this.draggingInfo.offsetY;
        }
      },
      handleContentMouseMove(event) {
        if (this.draggingInfo.target) {
          let container;
          let target = event.target;
          if (target.classList.contains('col') || target.classList.contains('form')) {
            container = target;
          } else {
            container = target.closest('.col') || target.closest('.form');
          }
          let indicators = document.getElementsByClassName('indicator');
          let indicator;
          if (indicators.length > 0) {
            indicator = indicators[0];
          } else {
            indicator = document.createElement('div');
            indicator.classList.add('indicator');
          }
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
            container.appendChild(indicator);
          } else {
            container.insertBefore(indicator, refNode);
          }
        }
      },
      handleFormMouseUp() {
        this.handleMouseUp(this.elements);
      },
      handleGridMouseUp(event) {
        this.handleMouseUp(event.element.elements);
      },
      handleMouseUp(elements) {
        if (this.draggingInfo.target) {
          let instance = this.draggingInfo.mode === 'move'
              ? this.draggingInfo.target
              : this.createWidgetInstance(this.draggingInfo.target.type);
          elements.splice(this.getIndicatorIndex(), 0, instance);
          this.draggingInfo.target = null;
          this.$nextTick(() => {
            this.removeIndicator();
          });
        }
      },
      handleInstanceMouseDown(event) {
        this.draggingInfo.target = event.element;
        this.draggingInfo.offsetX = event.offsetX;
        this.draggingInfo.offsetY = event.offsetY;
        this.draggingInfo.x = event.clientX - this.draggingInfo.offsetX;
        this.draggingInfo.y = event.clientY - this.draggingInfo.offsetY;
        this.draggingInfo.mode = 'move';
        this.$nextTick(() => {
          let draggable = document.getElementById('draggable');
          let target = event.target;
          let grid = target.closest('table');
          let clonedGrid = grid.cloneNode(true);
          clonedGrid.style.width = grid.clientWidth + 'px';
          while (draggable.firstChild) {
            draggable.removeChild(draggable.lastChild);
          }
          draggable.appendChild(clonedGrid);
          let elements = event.parentElement ? event.parentElement.elements : this.elements;
          elements.splice(elements.indexOf(event.element), 1);
        });
      },
      getIndicatorIndex() {
        let indicator = document.getElementsByClassName('indicator')[0];
        let i = 0;
        while ((indicator = indicator.previousSibling) != null) {
          i++;
        }
        return i;
      },
      removeIndicator() {
        let indicators = document.getElementsByClassName('indicator');
        for (let element of indicators) {
          element.remove();
        }
      },
      createWidgetInstance(widgetType) {
        let element = {type: widgetType};
        if (element.type === 'grid') {
          element.children = [{span: 50, elements: []}, {span: 50, elements: []}];
        }
        return element;
      },
    },
    components: {Grid},
  };
</script>
<style>
    .indicator {
        height: 5px;
        background-color: lightpink;
    }
</style>
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

    .form {
        border: 1px dashed #dadce0;
        height: 100%;
        position: relative;
        padding: 6px;
    }

    .placeholder {
        position: absolute;
        z-index: -1;
        font-size: 20px;
        top: calc(50% - 15px);
        left: calc(50% - 130px);
    }

    #draggable {
        position: fixed;
    }
</style>
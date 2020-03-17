<template>
    <table class="layout" @mouseup="draggingInfo.target = null"
           @mouseleave="draggingInfo.target = null" @mousemove="handleMouseMove($event)">
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
                <div class="widget" v-if="draggingInfo.target !== null"
                     :style="{top: draggingInfo.y + 'px', left: draggingInfo.x + 'px', position: 'fixed'}">
                    <span :class="['iconfont', draggingInfo.target.icon]"></span>
                    {{draggingInfo.target.name}}
                </div>
            </td>
            <td class="center">
                <div class="content">
                    <div class="placeholder">
                        从左侧拖拽或点击来添加字段
                    </div>
                    <!--                    <template v-for="(item, index) in list">-->
                    <!--                        <el-row v-if="item.type === 'layout'" :key="'content-widget-' + index">-->
                    <!--                            <el-col v-for="child in item.children" :span="child.span"></el-col>-->
                    <!--                        </el-row>-->
                    <!--                    </template>-->
                    <layout></layout>
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
        draggingInfo: {
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
      };
    },
    methods: {
      handleWidgetMouseDown(widget, event) {
        this.draggingInfo.target = widget;
        this.draggingInfo.offsetX = event.offsetX;
        this.draggingInfo.offsetY = event.offsetY;
        this.draggingInfo.x = event.clientX - this.draggingInfo.offsetX;
        this.draggingInfo.y = event.clientY - this.draggingInfo.offsetY;
      },
      handleMouseMove(event) {
        this.draggingInfo.x = event.clientX - this.draggingInfo.offsetX;
        this.draggingInfo.y = event.clientY - this.draggingInfo.offsetY;
      },
    },
    components: {
      Layout,
    },
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
</style>
<template>
    <table class="layout">
        <tr>
            <td class="left">
                <p>基础字段</p>
                <table class="grid">
                    <tr>
                        <td>
                            <span class="iconfont iconinput"></span>
                            输入框
                        </td>
                        <td>
                            <span class="iconfont icondropdown"></span>
                            下拉选择
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span class="iconfont icondatetime"></span>
                            日期时间
                        </td>
                        <td>
                            <span class="iconfont icontree"></span>
                            级联选择
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span class="iconfont iconcheckbox"></span>
                            多选
                        </td>
                        <td>
                            <span class="iconfont iconradio"></span>
                            单选
                        </td>
                    </tr>
                </table>
                <p>高级字段</p>
                <table class="grid">
                    <tr>
                        <td>
                            <span class="iconfont iconinput"></span>
                            布局
                        </td>
                        <td>
                            <span class="iconfont icondropdown"></span>
                            列表
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span class="iconfont icondatetime"></span>
                            标签页
                        </td>
                        <td>
                            <span class="iconfont icondropdown"></span>
                            分隔线
                        </td>
                    </tr>
                </table>
            </td>
            <td class="center">Center</td>
            <td class="right">Right</td>
        </tr>
    </table>
</template>

<script>
  export default {
    name: 'DynamicFormDesigner',
  };
</script>

<style scoped>
    .layout {
        width: 100%;
        height: 100%;
    }

    .left {
        width: 280px;
        vertical-align: top;
    }

    .right {
        width: 280px;
    }

    .grid {
        width: 100%;
    }
</style>
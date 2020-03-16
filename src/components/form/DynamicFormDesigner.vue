<template>
    <table class="container">
        <tr>
            <td class="left">Left</td>
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
    .container {
        width: 100%;
        height: 100%;
        background-color: rebeccapurple;
    }

    .left {
        width: 280px;
    }

    .right {
        width: 280px;
    }
</style>
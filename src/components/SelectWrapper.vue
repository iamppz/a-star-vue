<template>
    <el-select style="width: 100%;" :placeholder="placeholder">
        <el-option v-for="item in options" :key="item.value" :label="item.label"
                   :value="item.value">
        </el-option>
    </el-select>
</template>
<script>
  export default {
    props: {
      placeholder: {
        type: String,
        default: '请选择',
      },
      options: () => [],
    },
  };
</script>
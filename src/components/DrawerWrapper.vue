<template>
    <el-drawer :title="title" :visible.sync="visible" direction="rtl" @close="handleClickCancel">
        <div style="display: flex; flex-direction: column; height: 100%; padding: 10px;">
            <div style="flex: 1">
                <slot name="body"/>
            </div>
            <div style="display: flex;">
                <el-button style="flex: 1" @click="handleClickCancel">取消</el-button>
                <el-button style="flex: 1" type="primary" @click="handleClickOk">
                    确定
                </el-button>
            </div>
        </div>
    </el-drawer>
</template>
<script>
  export default {
    props: {
      title: {
        type: String,
        default: '标题',
      },
      visible: {
        type: Boolean,
        default: false,
      },
      cancel: {
        type: Function,
        default: null,
      },
      confirm: {
        type: Function,
        default: null,
      },
    },
    methods: {
      handleClickCancel() {
        this.$emit('cancel');
      },
      handleClickOk() {
        this.$emit('ok');
      },
    },
  };
</script>

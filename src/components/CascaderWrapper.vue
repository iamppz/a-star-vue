<template>
    <div>
        <el-cascader placeholder="请选择" :options="options" v-model="internalValue" filterable
                     :props="{ checkStrictly: true, value: 'id', label: 'name' }"
                     @change="handleChange" style="width: 100%;"></el-cascader>
    </div>
</template>

<script>
  import {flat} from '../utils/tree';

  export default {
    name: 'CascaderWrapper',
    props: {
      value: null,
      options: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        internalValue: [],
      };
    },
    mounted() {

    },
    methods: {
      handleChange() {
        let last = this.internalValue.length > 0
            ? this.internalValue[this.internalValue.length - 1]
            : null;
        this.$emit('input', last);
      },
    },
    watch: {
      options: {
        immediate: true,
        handler(val) {
          if (!val) { return; }
          let flatOptions = flat(this.options);
          let filteredOptions = flat(this.options).filter(item => item.id === this.value);
          if (filteredOptions.length === 0) {
            return;
          }

          let option = filteredOptions[0];
          this.internalValue.push(option.id);
          while (option.parentId) {
            this.internalValue.unshift(option.parentId);
            option = flatOptions.filter(item => item.id === option.parentId)[0];
          }
          console.log(this.internalValue);
        },
      },
    },
  };
</script>

<style scoped>

</style>
<template>
    <table v-if="layout === 'default'" :class="['form-group', layout]">
        <tr>
            <td class="label">
                <slot name="label"></slot>
            </td>
            <td>
                <slot name="element"></slot>
            </td>
        </tr>
    </table>
    <table v-else :class="['form-group', layout]">
        <tr>
            <td class="label">
                <slot name="label"></slot>
            </td>
        </tr>
        <tr>
            <td>
                <slot name="element"></slot>
            </td>
        </tr>
    </table>
</template>

<script>
  export default {
    name: 'FormGroup',
    props: {
      layout: {
        type: String,
        default: 'default',
      },
    },
  };
</script>

<style scoped>
    .form-group {
        table-layout: fixed;
        width: 100%;
        min-height: 42px;
    }

    .form-group.inline {
        display: inline-block;
    }

    .form-group > tr > td.label {
        padding: 0 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: right;
        width: 80px;
    }

    .form-group.inline > tr > td.label {
        text-align: left;
    }
</style>
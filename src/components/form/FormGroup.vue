<template>
    <div :class="['form-group', layout]">
        <table v-if="layout === 'default'">
            <tr>
                <td class="label">
                    <slot name="label"></slot>
                </td>
                <td>
                    <slot name="element"></slot>
                </td>
            </tr>
        </table>
        <table v-else>
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
    </div>
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
    .form-group > table {
        table-layout: fixed;
        width: 100%;
    }

    .form-group.inline > table {
        display: inline-block;
    }

    .form-group > table > tr > td.label {
        padding: 0 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: right;
        width: 80px;
    }

    .form-group.inline > table > tr > td.label {
        text-align: left;
    }
</style>
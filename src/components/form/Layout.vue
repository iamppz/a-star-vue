<template>
    <div>
        <table class="row">
            <tr>
                <td v-for="(child, i) in formattedData.children" :key="i"
                    class="col" :style="{width: child.width}">
                    <template v-if="child.elements">
                        <layout v-for="(grandchild, j) in child.elements" :data="grandchild"
                                :key="i + '-' + j"></layout>
                    </template>
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
  export default {
    name: 'Layout',
    props: {
      data: {
        type: Object,
        default: () => ({
          type: 'layout',
          children: [
            {
              span: 12,
              elements: [
                {
                  type: 'layout',
                  children: [
                    {
                      span: 12,
                      elements: [
                        {
                          type: 'layout',
                          children: [
                            {
                              span: 12,
                              elements: [],
                            },
                            {
                              span: 12,
                            },
                          ],
                        },
                      ],
                    },
                    {
                      span: 12,
                    },
                  ],
                },
              ],
            },
            {
              span: 12,
            },
          ],
        }),
      },
    },
    computed: {
      formattedData() {
        let result = Object.assign({}, this.data);
        result.children.forEach(child => {
          let totalSpan = result.children.reduce((result, current) => result + current.span, 0);
          child.width = child.span / totalSpan * 100 + '%';
        });
        return result;
      },
    },
  };
</script>

<style scoped>
    .row {
        border: 1px dashed #dadce0;
        width: 100%;
    }

    .col {
        border: 1px dashed #dadce0;
        height: 50px;
        padding: 6px;
    }
</style>
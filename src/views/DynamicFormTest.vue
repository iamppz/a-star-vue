<template>
    <dynamic-form :row="3" :col="4" :cells="fields"></dynamic-form>
</template>
<script>
    import DynamicForm from '../components/DynamicForm';

    export default {
        components: {DynamicForm},
        data() {
            return {
                fields: [
                    {
                        row: 1,
                        col: 1,
                        colspan: 1,
                        rowspan: 1,
                        type: 'label',
                        text: '姓名'
                    },
                    {
                        row: 1,
                        col: 2,
                        colspan: 3,
                        rowspan: 1,
                        type: 'textarea'
                    },
                    {
                        row: 2,
                        col: 1,
                        colspan: 4,
                        rowspan: 3
                    }
                ]
            }
        }
    }

</script>
<template>
    <div>
        <dynamic-form :row="3" :col="4" :cells="fields" v-model="data"></dynamic-form>
    </div>
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
                        colspan: 1,
                        rowspan: 1,
                        type: 'input',
                        binding: 'name'
                    },
                    {
                        row: 1,
                        col: 3,
                        colspan: 1,
                        rowspan: 1,
                        type: 'label',
                        text: '年龄'
                    },
                    {
                        row: 1,
                        col: 4,
                        colspan: 1,
                        rowspan: 1,
                        type: 'input',
                        binding: 'age'
                    },
                    {
                        row: 2,
                        col: 1,
                        colspan: 1,
                        rowspan: 3,
                        type: 'label',
                        text: '备注'
                    },
                    {
                        row: 2,
                        col: 2,
                        colspan: 3,
                        rowspan: 3,
                        type: 'textarea',
                        binding: 'remark'
                    }
                ],
                data: {
                    name: 'zsl',
                    age: 30
                },
            }
        }
    }

</script>
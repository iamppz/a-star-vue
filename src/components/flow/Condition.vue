<template>
    <div class="condition-node">
        <div class="condition-node-box">
            <div class="auto-judge">
                <div class="title-wrapper">
                    <span class="editable-title">{{transition.name}}</span>
                    <span class="priority-title">{{'分支'}}</span>
                    <i class="anticon anticon-close close"></i>
                </div>
                <div class="content">{{transition.expression || '无条件'}}</div>
            </div>
            <toolbar :source="[transition.source]" :destination="[transition.destination]" @onnodecreated="onToolbarSave"></toolbar>
        </div>
    </div>
</template>
<script>
    import Toolbar from "./Toolbar";

    export default {
        components: {
            Toolbar
        },
        name: 'condition',
        props: {
            transition: {
                type: Object,
                default: null
            }
        },
        methods: {
            onToolbarSave(node) {
                this.$set(node, 'transitions', [{
                    name: 'Default',
                    source: node,
                    destination: this.transition.destination,
                    expression: null
                }]);
                this.transition.destination = node;
            }
        }
    }
</script>
<style scoped src="../../assets/flow-design.css"></style>
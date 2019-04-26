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
            <flow-node-add-button-box></flow-node-add-button-box>
        </div>
    </div>
</template>
<script>
    import FlowNodeAddButtonBox from "./ButtonBox";

    export default {
        components: {
            FlowNodeAddButtonBox
        },
        name: 'condition',
        props: {
            transition: {
                type: Object,
                default: null
            }
        }
    }
</script>
<style scoped src="../../assets/flow-design.css"></style>
<template>
    <div>
        <div class="node-wrap">
            <div class="node-wrap-box start-node">
                <div>
                    <div class="title">
                        <span class="">发起人</span>
                    </div>
                    <div class="content">
                        <div class="text">{{ node.name }}</div>
                        <i class="anticon anticon-right arrow"></i>
                    </div>
                </div>
            </div>
            <toolbar :btn-add-condition-visible="true"></toolbar>
        </div>
        <template v-if="showNextBranch">
            <branch :transitions="node.transitions"></branch>
        </template>
        <template v-else>
            <template v-if="node.transitions[0].to.state === 'end'">
                <end></end>
            </template>
            <template v-else>
                <operation :node="node.transitions[0].to"></operation>
            </template>
        </template>
    </div>
</template>
<script>
    import Toolbar from "./Toolbar";
    import Operation from './Operation';
    import End from './End';

    export default {
        name: 'node',
        components: {Toolbar, Operation, End},
        props: {
            node: {
                type: Object,
                default: null
            }
        },
        beforeCreate: function () {
            this.$options.components.Branch = () => import('./Branch.vue')
        },
        computed: {
            showNextBranch() {
                // 当节点后有多个节点时，显示为分支
                return this.node.transitions.length > 1;
            }
        }
    }
</script>
<style scoped src="../../assets/flow-design.css"></style>
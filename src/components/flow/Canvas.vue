<template>
    <div style="position: relative;">
        <!-- <el-button @click="save">Save</el-button> -->
        <div class="flow-design">
            <!-- <div class="zoom">
                <div class="zoom-out"></div>
                <span>100%</span>
                <div class="zoom-in"></div>
            </div> -->
            <div
                class="box-scale"
                id="box-scale"
                style="transform: scale(1); transform-origin: 50% 0 0;"
            >
                <template v-if="startNode">
                    <start :node="startNode"></start>
                </template>
            </div>
        </div>
    </div>
</template>
<script>
import { Message } from 'element-ui';

import processService from '../../service/processService';
import Start from './Start';

export default {
    components: { Start },
    async mounted() {
        let resp = {
            data: {
                success: true,
                message: '获取成功',
                data: [
                    {
                        id: 2,
                        name: '开始',
                        processDefinitionId: 1,
                        state: 'start',
                        approverIds: null,
                        transitions: [
                            { id: 2, name: '默认', source: 2, destination: 3, expression: null }
                        ]
                    },
                    {
                        id: 3,
                        name: '结束',
                        processDefinitionId: 1,
                        state: 'end',
                        approverIds: null,
                        transitions: []
                    }
                ]
            }
        };
        if (resp.data.success) {
            let nodes = resp.data.data;
            this.startNode = nodes.find(node => node.state === 'start');
            let setSrcAndDest = transition => {
                for (let i = 0; i < transition.destination.transitions.length; i++) {
                    let nextTransition = transition.destination.transitions[i];
                    if (typeof nextTransition.source !== 'number') {
                        continue;
                    }

                    nextTransition.source = nodes.find(node => node.id === nextTransition.source);
                    nextTransition.destination = nodes.find(
                        node => node.id === nextTransition.destination
                    );
                    setSrcAndDest(nextTransition);
                }
            };

            this.startNode.transitions.forEach(transition => {
                transition.source = nodes.find(node => node.id === transition.source);
                transition.destination = nodes.find(node => node.id === transition.destination);
                if (transition.destination.transitions.length > 0) {
                    setSrcAndDest(transition);
                }
            });
        }
    },
    data() {
        return {
            startNode: null
        };
    },
    methods: {
        async save() {

        }
    }
};
</script>
<style scoped src="../../assets/flow-design.css"></style>

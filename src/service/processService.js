import instance from "../utils/instance";

class ProcessService {
    async getDefinition(id) {
        return await instance.get(`/api/process/definition?id=${id}`);
    }

    async getInstance(id) {
        return await instance.get(`/api/process/instance?id=${id}`);
    }

    async getNodes(id) {
        return await instance.get(`/api/process/nodes?processDefinitionId=${id}`);
    }

    async updateNode(node) {
        let url = `/api/process/node?id=${node.id}&name=${node.name}&approverIds=${node.approverIds}`;
        return await instance.put(url);
    }

    async saveNodes(nodes) {
        let copy = nodes.map(node => {
            return Object.assign({}, node, {id: null, clientId: node.id});
        });
        copy.forEach(node => {
            node.transitions = node.transitions.map(transition => {
                return Object.assign({}, transition, {
                    source: transition.source.id,
                    destination: transition.destination.id,
                    id: null
                });
            });
        });
        return await instance.post('/api/process/flowchart', {
            data: JSON.stringify(copy)
        });
    }

    async create(workflowDefinitionId, dataId, attachmentId) {
        return await instance.post('/api/process/instance', {
            workflowDefinitionId, dataId, attachmentId
        });
    }

    async submit(processInstanceId) {
        return await instance.post('/api/process/submit', {processInstanceId});
    }

    async approve(processInstanceId) {
        return await instance.post('/api/process/approve', {processInstanceId});
    }

    async reject(processInstanceId) {
        return await instance.post('/api/process/reject', {processInstanceId});
    }
}

export default new ProcessService();
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
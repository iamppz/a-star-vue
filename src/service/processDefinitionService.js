import instance from "../utils/instance";

class ProcessDefinitionService {
    async get(id) {
        return await instance.get(`/api/process/definition?id=${id}`);
    }
}

export default new ProcessDefinitionService();
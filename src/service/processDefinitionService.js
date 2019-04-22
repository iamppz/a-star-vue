import instance from "../utils/instance";

class ProcessService {
    async getDefinition(id) {
        return await instance.get(`/api/process/definition?id=${id}`);
    }

    async getInstance(id) {
        return await instance.get(`/api/process/instance?id=${id}`);
    }
}

export default new ProcessService();
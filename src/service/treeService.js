import instance from "../utils/instance";

class TreeService {
    async get(name) {
        return await instance.get('/api/tree/?name=' + name);
    }
}

export default new TreeService();
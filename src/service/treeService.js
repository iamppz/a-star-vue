import instance from "../utils/instance";

class TreeService {
    async get(name) {
        return instance.get('/api/tree/?name=' + name);
    }
}

export default new TreeService();
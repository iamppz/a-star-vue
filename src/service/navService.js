import instance from '../utils/instance';

class NavService {
    async get() {
        return await instance.get('/api/nav/');
    }

    async getAll() {
        return await instance.get('/api/nav/all');
    }
}

export default new NavService();
import instance from '../utils/instance';

class NavService {
    async getCategories() {
        return await instance.get('/api/nav/category');
    }

    async getAllCategories() {
        return await instance.get('/api/nav/category/all');
    }

    async get() {
        return await instance.get('/api/nav/');
    }
}

export default new NavService();
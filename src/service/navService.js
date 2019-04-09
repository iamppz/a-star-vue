import instance from '../utils/instance';

class NavService {
    async getUserCategories() {
        return await instance.get('/api/user/categories');
    }

    async getAllCategories() {
        return await instance.get('/api/nav/');
    }
}

export default new NavService();
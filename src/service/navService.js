import instance from '../utils/axios';

class NavService {
    async getNavs() {
        return await instance.get('/api/nav/');
    }
}

export default new NavService();
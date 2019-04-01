import instance from '../utils/instance';

class NavService {
    async getNavs() {
        return await instance.get('/api/nav/');
    }
}

export default new NavService();
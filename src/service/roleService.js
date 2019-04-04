import instance from '../utils/instance';

class RoleService {
    async get() {
        return await instance.get('/api/role/');
    }
}

export default new RoleService();
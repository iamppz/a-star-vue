import instance from '../utils/instance';

class PermissionService {
    async get() {
        return await instance.get('/api/permission/');
    }
}

export default new PermissionService();
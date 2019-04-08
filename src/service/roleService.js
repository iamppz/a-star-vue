import instance from '../utils/instance';

class RoleService {
    async get() {
        return await instance.get('/api/role/');
    }

    async save(form) {
        return await instance.post('/api/role/', form);
    }

    async savePermission(roleId, permissionIds) {
        return await instance.post('/api/role/permission', {
            roleId,
            permissionIds: permissionIds.join(',')
        });
    }

    async getPermission(roleId) {
        return await instance.get(`/api/role/permission?roleId=${roleId}`);
    }

    async getNav(roleId) {
        return await instance.get(`/api/role/nav?roleId=${roleId}`);
    }

    async saveNav(roleId, navIds) {
        return await instance.post('/api/role/nav', {
            roleId,
            navIds: navIds.join(',')
        });
    }
}

export default new RoleService();
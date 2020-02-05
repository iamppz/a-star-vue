import instance from '../utils/instance';

class RoleService {
    async get() {
        return instance.get('/api/role/');
    }

    async save(form) {
        return instance.post('/api/role/', form);
    }

    async savePermission(roleId, permissionIds) {
        return instance.post('/api/role/permission', {
            roleId,
            permissionIds: permissionIds.join(',')
        });
    }

    async getPermission(roleId) {
        return instance.get(`/api/role/permission?roleId=${roleId}`);
    }

    async getNav(roleId) {
        return instance.get(`/api/role/nav?roleId=${roleId}`);
    }

    async saveNav(roleId, navIds) {
        return instance.post('/api/role/nav', {
            roleId,
            navIds: navIds.join(',')
        });
    }
}

export default new RoleService();
import instance from "../utils/instance";

class UserService {
    async getByDepartment(departmentId, pageIndex) {
        return await instance.get(`/api/user/department?departmentId=${departmentId}&pageIndex=${pageIndex}`);
    }

    async get() {
        return await instance.get(`/api/user/`);
    }

    async add(form) {
        return await instance.post('/api/user/', form);
    }

    async update(form) {
        return await instance.put(`/api/user/?name=${form.name || ''}&userId=${form.id || ''}&mobile=${form.mobile || ''}&departmentId=${form.departmentId}`);
    }

    async enable(id) {
        return await instance.post('/api/user/enable', {userId: id});
    }

    async disable(id) {
        return await instance.post('/api/user/disable', {userId: id});
    }

    async resetPassword(id) {
        return await instance.delete(`/api/account/password?userId=${id}`);
    }

    async changePassword(form) {
        return await instance.put(`/api/account/password?currentPassword=${form.currentPassword}&password=${form.password}`);
    }
}

export default new UserService();
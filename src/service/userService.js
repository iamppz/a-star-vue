import instance from "../utils/instance";

class UserService {
    async getByDepartment(departmentId, pageIndex) {
        return instance.get(`/api/user/department?departmentId=${departmentId}&pageIndex=${pageIndex}`);
    }

    async get() {
        return instance.get(`/api/user/`);
    }

    buildUserURL(form) {
        let roleIds = form.roleIds.join();
        return `/api/user/?name=${form.name || ''}&userId=${form.id || ''}&mobile=${form.mobile || ''}&departmentId=${form.departmentId}&roleIds=${roleIds}`;
    }

    async add(form) {
        return instance.post(this.buildUserURL(form));
    }

    async update(form) {
        return instance.put(this.buildUserURL(form));
    }

    async enable(id) {
        return instance.post('/api/user/enable', {userId: id});
    }

    async disable(id) {
        return instance.post('/api/user/disable', {userId: id});
    }

    async resetPassword(id) {
        return instance.delete(`/api/account/password?userId=${id}`);
    }

    async changePassword(form) {
        return instance.put(`/api/account/password?currentPassword=${form.currentPassword}&password=${form.password}`);
    }
}

export default new UserService();
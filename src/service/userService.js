import instance from "../utils/instance";

class UserService {
    async get(departmentId, pageIndex) {
        return await instance.get(`/api/user/?departmentId=${departmentId}&pageIndex=${pageIndex}`);
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
}

export default new UserService();
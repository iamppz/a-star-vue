import instance from "../utils/instance";

class DepartmentService {
    async get() {
        return await instance.get('/api/department/');
    }

    async add(form) {
        return await instance.post('/api/department/', form);
    }

    async update(form) {
        return await instance.put(`/api/department/?name=${form.name || ''}&id=${form.id || ''}&parentId=${form.parentId || ''}`);
    }

    async delete(id) {
        return await instance.delete(`/api/department/?id=${id}`);
    }
}

export default new DepartmentService();
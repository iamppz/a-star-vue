import instance from "../utils/instance";

class DepartmentService {

    async get(id) {
        return instance.get(`/api/department/?id=${id}`)
    }

    async add(form) {
        return instance.post('/api/department/', form);
    }

    async update(form) {
        return instance.put(`/api/department/?name=${form.name || ''}&id=${form.id || ''}&parentId=${form.parentId || ''}&leaderId=${form.leaderId || ''}`);
    }

    async delete(id) {
        return instance.delete(`/api/department/?id=${id}`);
    }
}

export default new DepartmentService();
import instance from "../utils/instance";

class DepartmentService {
    async get() {
        return await instance.get('/api/department/');
    }
}

export default new DepartmentService();
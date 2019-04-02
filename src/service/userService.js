import instance from "../utils/instance";

class UserService {
    async get(departmentId, pageIndex) {
        return await instance.get(`/api/user/?departmentId=${departmentId}&pageIndex=${pageIndex}`);
    }
}

export default new UserService();
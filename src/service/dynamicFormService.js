import instance from "../utils/instance";

class DynamicFormService {
    async add(formId, data) {
        return await instance.post('/api/dynamicForm/', {formId: formId, data: JSON.stringify(data)});
    }

    async get(formId) {
        return await instance.get(`/api/dynamicForm/?formId=${formId}`);
    }
}

export default new DynamicFormService();
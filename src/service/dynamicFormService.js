import instance from "../utils/instance";

class DynamicFormService {
    async add(formId, data) {
        return await instance.post('/api/dynamicForm/', {formId: formId, data: JSON.stringify(data)});
    }

    async update(formId, data) {
        return await instance.post('/api/dynamicForm/update', {formId: formId, data: JSON.stringify(data)});
    }

    async get(formId) {
        return await instance.get(`/api/dynamicForm/?formId=${formId}`);
    }

    async getData(formId, dataId) {
        return await instance.get(`/api/dynamicForm/data?formId=${formId}&dataId=${dataId}`);
    }
}

export default new DynamicFormService();
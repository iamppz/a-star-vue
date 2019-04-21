import instance from "../utils/instance";

class DynamicFormService {
    async add(formId, data) {
        return await instance.post('/dynamicForm/', {formId: formId, data: JSON.stringify(data)});
    }
}

export default new DynamicFormService();
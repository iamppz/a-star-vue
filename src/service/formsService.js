import instance from '../utils/instance';

class FormsService {
    async getTabList(value) {
        return await instance.get('/crm/dynamicTab/getIndependentDynamicForm?builtins='+value);
    }

    async getFormDataList(pageIndex, keyword,formTableName) {
        return await instance.post('/crm/dynamicTab/getFormDataList?formTableName='+formTableName, {
            pageSize: 10,
            pageIndex: pageIndex,
            dictionaryNames: 'advisorId.base_staff,advisorId.base_staff.avatar,customerId.crm_customer',
            expressions: '[{"field": "数量", "expression": "count(1)"}]',
            fuzzySearch: keyword,
            sortField: 'createTime',
            sort: 'asc'
        });
    }

}

export default new FormsService();
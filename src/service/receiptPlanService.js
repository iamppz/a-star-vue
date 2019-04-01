import instance from '../utils/instance';

class ReceiptPlanService {
    async getList(pageIndex, keyword,type) {
        return await instance.post('/crm/order/receiptPlanList?type='+type, {
            pageSize: 10,
            pageIndex: pageIndex,
            dictionaryNames: 'advisorId.base_staff,advisorId.base_staff.avatar,customerId.crm_customer',
            expressions: '[{"field": "数量", "expression": "count(1)"}]',
            fuzzySearch: keyword,
            sortField: 'planReceiptDate',
            sort: type === 'isReceived' ?  'desc':'asc'
        });
    }

    async setReceived(id) {
        return await instance.post('/crm/order/completeReceiptPlan', {_method:'put',ids:id});
    }
}

export default new ReceiptPlanService();
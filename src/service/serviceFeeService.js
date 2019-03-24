import instance from '../utils/axios';

class ServiceFeeService {
    async getList(pageIndex, keyword,type) {
        return await instance.post('/crm/contract/serviceFeeList?type='+type, {
            pageSize: 10,
            pageIndex: pageIndex,
            dictionaryNames: 'creatorId.base_staff,creatorId.base_staff.avatar,customerId.crm_customer',
            expressions: '[{"field": "数量", "expression": "count(1)"}]',
            fuzzySearch: keyword,
            sortField: 'receiveTime',
            sort: type === 1? 'desc':'asc'
        });
    }

    async setReceived(id) {
        return await instance.post('/crm/contract/setIsReceived', {uuid: id});
    }
}

export default new ServiceFeeService();
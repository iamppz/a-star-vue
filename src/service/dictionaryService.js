import instance from '../utils/instance';

class DictionaryService {
    async get() {
        return await instance.get('/api/dictionary/');
    }

    async getItems(name) {
        return await instance.get(`/api/dictionary/items?name=${name}`)
    }

    async addItems(commaSeparatedNames, dictionaryId) {
        return await instance.post('/api/dictionary/items', {
            names: commaSeparatedNames,
            dictionaryId
        })
    }

    async saveItem(form) {
        return await instance.put(`/api/dictionary/item?id=${form.id}&name=${form.name}`);
    }

    async deleteItem(id) {
        return await instance.delete(`/api/dictionary/item?id=${id}`);
    }
}

export default new DictionaryService();
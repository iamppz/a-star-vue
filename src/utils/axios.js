const axios = require('axios');
const qs = require('qs');

const instance = axios.create({
    transformRequest: [function (data) {
        data = qs.stringify(data);
        return data;
    }],
});

export default instance;
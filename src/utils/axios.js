import {API_URL} from "../common/config";

const axios = require('axios');
const qs = require('qs');

const instance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    transformRequest: [function (data) {
        data = qs.stringify(data);
        return data;
    }],
});

export default instance;
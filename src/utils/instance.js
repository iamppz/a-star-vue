import axios from 'axios';
import qs from 'qs';
import {Message} from "element-ui";


import router from '../router';

const instance = axios.create({
    transformRequest: [function (data) {
        data = qs.stringify(data);
        return data;
    }],
});

instance.interceptors.request.use(config => {
    if (localStorage.token) {
        config.headers.Token = localStorage.token;
    }
    return config;
}, err => {
    return Promise.reject(err);
});

instance.interceptors.response.use(response => {
    if (!response.data.success) {
        Message.error(response.data.message);
    }
    let token = response.headers.token;
    if (token) {
        localStorage.token = token;
    }
    return response;
}, error => {
    if (error.response) {
        switch (error.response.status) {
            case 401:
                localStorage.token = null;
                router.replace({
                    path: '/login',
                    query: {redirect: router.currentRoute.fullPath}
                });
        }
    }
    return Promise.reject(error);
});

export default instance;
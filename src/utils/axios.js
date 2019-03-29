import router from './router';

const axios = require('axios');
const qs = require('qs');

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
    }
);

instance.interceptors.response.use(response => {
        let token = response.headers.token;
        if (token) {
            localStorage.token = token;
        }
        return response;
    }, error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    router.replace({
                        path: 'login',
                        query: {redirect: router.currentRoute.fullPath}
                    })
            }
        }
        return Promise.reject(error);
    }
);

export default instance;
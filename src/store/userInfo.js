import Vue from 'vue/dist/vue.js';
import Vuex from 'vuex';
import instance from '../utils/axios';

Vue.use(Vuex);

const userInfo = new Vuex.Store({
    state: {
        userId: null
    },
    mutations: {
        init(state) {
            instance.get('/crm/user/').then((resp) => {
                state.userId = resp.data.Data.userId;
            });
        }
    },
    getters: {
        getUserId: state => state.userId
    }
});
export default userInfo;
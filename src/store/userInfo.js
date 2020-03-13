import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

const userInfo = new Vuex.Store({
    state: {},
    mutations: {},
    getters: {},
    plugins: [
        createPersistedState()
    ]
});
export default userInfo;
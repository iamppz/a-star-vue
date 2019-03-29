import Vue from 'vue/dist/vue.js';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

const userInfo = new Vuex.Store({
    state: {
        isLoggedIn: false,
        token: null
    },
    mutations: {
        login(state) {
            state.isLoggedIn = true;
        },
        logout(state) {
            state.isLoggedIn = false;
        }
    },
    getters: {
        getIsLoggedIn: state => state.isLoggedIn
    },
    plugins: [
        createPersistedState()
    ]
});
export default userInfo;
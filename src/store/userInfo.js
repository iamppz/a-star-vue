import Vue from 'vue/dist/vue.js';
import Vuex from 'vuex';

Vue.use(Vuex);

const userInfo = new Vuex.Store({
    state: {
        isLoggedIn: false
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
    }
});
export default userInfo;
import Vue from 'vue/dist/vue.js';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

const userInfo = new Vuex.Store({
    state: {
        isLoggedIn: false,
        navs: []
    },
    mutations: {
        login(state) {
            state.isLoggedIn = true;
        },
        logout(state) {
            state.isLoggedIn = false;
        },
        setNavs(state, navs) {
            state.navs = navs;
        }
    },
    getters: {
        getIsLoggedIn: state => state.isLoggedIn,
        getNavs: state => state.navs
    },
    plugins: [
        createPersistedState()
    ]
});
export default userInfo;
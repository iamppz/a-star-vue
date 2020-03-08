import Vue from 'vue/dist/vue.js';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'ant-design-vue/dist/antd.css';
import './assets/styles.css';
import './assets/element.css';
import router from "./router";
import UserPicker from './components/UserPicker/index';

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(UserPicker);

new Vue({
    el: '#app',
    router,
    mounted() {
        this.$on('login', async () => {
            let redirect = this.$route.query.redirect;
            this.$router.push(redirect || '/app/user');
        });
    }
});
import Vue from 'vue/dist/vue.js';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueRouter from 'vue-router';
import Login from './views/Login';
import MobileLogin from './views/mobile/Login';
import MobileServiceFee from './views/mobile/ServiceFee';
import MobileReceiptPlan from './views/mobile/ReceiptPlan';
import MobileForms from './views/mobile/Forms';
import './assets/styles.css';

Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(ElementUI);

const routes = [
    {path: '/mobile/login', component: MobileLogin},
    {path: '/login', component: Login},
    {path: '/mobile/serviceFee', component: MobileServiceFee},
    {path: '/mobile/receiptPlan', component: MobileReceiptPlan},
    {path: '/mobile/forms/:id', component: MobileForms}
];

const router = new VueRouter({
    routes
});

new Vue({
    el: '#app',
    data: {},
    router,
    mounted() {
        // userInfo.commit('init');
    }
});
import Vue from 'vue/dist/vue.js';
import VueRouter from 'vue-router';
import Login from './views/Login';
import ServiceFee from './views/ServiceFee';
import ReceiptPlan from './views/ReceiptPlan';
import Forms from './views/Forms';
import TableGrid from "./components/TableGrid";
import userInfo from './store/userInfo';
import './assets/styles.css';

Vue.config.productionTip = false;
Vue.use(VueRouter);

const routes = [
    {path: '/login', component: Login},
    {path: '/serviceFee', component: ServiceFee},
    {path: '/receiptPlan', component: ReceiptPlan},
    {path: '/forms/:id', component: Forms},
    {path: '/tg', component: TableGrid}
];

const router = new VueRouter({
    routes
});

new Vue({
    el: '#app',
    data: {},
    router,
    mounted() {
        userInfo.commit('init');
    }
});
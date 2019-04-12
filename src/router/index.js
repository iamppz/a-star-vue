import Vue from 'vue/dist/vue.js';
import VueRouter from "vue-router";
import Login from "../views/Login";
import Home from "../views/Home";
import User from "../views/User";
import Role from "../views/Role";
import App from "../views/App";
import EChartsTest from "../views/EChartsTest";

Vue.use(VueRouter);

const routes = [
    {path: '/', component: Login},
    {path: '/login', component: Login},
    {
        path: '/app', component: App, children: [
            {path: 'home', component: Home},
            {path: 'user', component: User},
            {path: 'role', component: Role},
            {path: 'echartsTest', component: EChartsTest},
        ]
    }
];

let router = new VueRouter({
    routes
});
export default router;
import Vue from 'vue/dist/vue.js';
import VueRouter from "vue-router";
import Login from "../views/Login";
import Home from "../views/Home";
import User from "../views/User";
import Role from "../views/Role";

Vue.use(VueRouter);

const routes = [
    {path: '/', component: Login},
    {path: '/login', component: Login},
    {path: '/home', component: Home},
    {path: '/role', component: Role},
    {path: '/user', component: User}
];

let router = new VueRouter({
    routes
});
export default router;
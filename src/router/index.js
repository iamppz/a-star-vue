import Vue from 'vue/dist/vue.js';
import VueRouter from "vue-router";
import Login from "../views/Login";
import Home from "../views/Home";
import User from "../views/User";
import Role from "../views/Role";
import App from "../views/App";
import Flowchart from "../views/process/FlowDesign";
import EChartsTest from "../views/EChartsTest";
import Dictionary from "../views/Dictionary";
import DynamicFormTest from "../views/DynamicFormTest";

Vue.use(VueRouter);

const routes = [
    {path: '/', component: Login},
    {path: '/login', component: Login},
    {path: '/flowDesign', component: Flowchart},
    {
        path: '/app', component: App, children: [
            {path: 'home', component: Home},
            {path: 'user', component: User},
            {path: 'role', component: Role},
            {path: 'echartsTest', component: EChartsTest},
            {path: 'dynamicFormTest', component: DynamicFormTest},
            {path: 'process/flowDesign', component: Flowchart},
            {path: 'dictionary', component: Dictionary}
        ]
    }
];

let router = new VueRouter({
    routes
});
export default router;
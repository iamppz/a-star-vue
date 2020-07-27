import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login";
import AStar from "../views/process/AStar";
import Detail from "../views/workflow/chart/Designer";

Vue.use(VueRouter);

const routes = [
  { path: "/", component: Login },
  { path: "/login", component: Login },
  { path: "/aStar", component: AStar },
  { path: "/flowchart/designer", component: Detail }
];

let router = new VueRouter({
  routes
});
export default router;

import Vue from "vue";
import VueRouter from "vue-router";
import AStar from "../views/AStar";

Vue.use(VueRouter);

const routes = [{ path: "/", component: AStar }];

let router = new VueRouter({
  routes
});
export default router;

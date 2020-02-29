import Vue from 'vue/dist/vue.js';
import VueRouter from 'vue-router';
import Login from '../views/Login';
import Home from '../views/Home';
import User from '../views/User';
import Role from '../views/Role';
import App from '../views/App';
import AStar from '../views/process/AStar';
import WorkflowIndex from '../views/workflow/Index';

import Flowchart from '../components/flowchart/dingtalk/Canvas';
import EChartsTest from '../views/EChartsTest';
import Dictionary from '../views/Dictionary';
import WorkflowConfigList from '../views/workflow/config/List';
import FlowChart from '../components/flowchart/joyce/general/FlowChart';
import Detail from '../views/workflow/config/Detail';

Vue.use(VueRouter);

const routes = [
  {path: '/', component: Login},
  {path: '/login', component: Login},
  {path: '/aStar', component: AStar},
  {path: '/flowDesign', component: Flowchart},
  {
    path: '/app', component: App, children: [
      {path: 'home', component: Home},
      {path: 'user', component: User},
      {path: 'role', component: Role},
      {path: 'echartsTest', component: EChartsTest},
      {path: 'process/flowDesign', component: Flowchart},
      {path: 'dictionary', component: Dictionary},
      {path: 'workflow/index', component: WorkflowIndex},
      {path: 'workflow/config/list', component: WorkflowConfigList},
      {path: 'workflow/config/detail', component: Detail},
      {path: 'component/flowchart', component: FlowChart},
    ],
  },
];

let router = new VueRouter({
  routes,
});
export default router;
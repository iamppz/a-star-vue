import Vue from 'vue/dist/vue.js';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/styles.css';
import App from './views/App';

Vue.config.productionTip = false;
Vue.use(ElementUI);

new Vue({
    render: h => h(App)
}).$mount('#app');
import 'babel-polyfill';
import Vue from 'vue';
import Ls from 'vue-ls';
import App from './App.vue';
import router from './router';
import store from './store';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import api from './api';
import units from './assets/js/utils';

// 权限控制
import './permission';

Vue.config.productionTip = false;

// vue-ls 缓存参数
const lsOptions = {
  namespace: 'mes_',
  name: 'ls',
  storage: 'local'
};

Vue.use(Ls, lsOptions);
Vue.use(Antd);
Vue.prototype.$api = api;
Vue.prototype.$units = units;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

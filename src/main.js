import 'babel-polyfill';
import Vue from 'vue';
import Storage from 'vue-ls';
import App from './App.vue';
import router from './router';
import store from './store';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import api from './api';

// 权限控制
import './permission';

Vue.config.productionTip = false;

// vue-ls 缓存参数
const options = {
  namespace: 'mes_',
  name: 'ls',
  storage: 'local'
};

Vue.use(Storage, options);
Vue.use(Antd);
Vue.prototype.$api = api;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

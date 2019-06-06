import 'babel-polyfill';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import utils from './assets/js/utils';
import './assets/icon/iconfont.css';

// Vue 插件
import './core/use';
// 权限控制
import './permission';

Vue.config.productionTip = false;
Vue.prototype.utils = utils;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

import Vue from 'vue';
import Vuex from 'vuex';

import permission from './modules/permission';
import seq from './modules/seq';
import basic from './modules/basic';
import user from './modules/user';
import getters from './getters';

Vue.use(Vuex);

// 根据更新的全局数据，设置本地缓存
const setCache = store => {
  store.subscribe((mutation, state) => {
    Vue.ls.set('cache', state);
  });
};

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production', // 开发模式下开启严格模式
  modules: {
    permission,
    seq,
    basic,
    user
  },
  state: {
    theme: 'dark'
  },
  mutations: {

  },
  actions: {},
  getters,
  plugins: [setCache]
});

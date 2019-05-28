import Vue from 'vue';
import Vuex from 'vuex';

import permission from './modules/permission';
import seq from './modules/seq';
import basic from './modules/basic';
import user from './modules/user';
import peptide from './modules/peptide';

Vue.use(Vuex);

// 根据更新的全局数据，设置本地缓存
const setCache = store => {
  store.subscribe((mutation, state) => {
    Vue.ls.set('cache', state);
  });
};

export default new Vuex.Store({
  modules: {
    permission,
    seq,
    basic,
    user,
    peptide
  },
  state: {
    theme: 'dark'
  },
  mutations: {

  },
  actions: {},
  plugins: [setCache]
});

import Vue from 'vue';
import Vuex from 'vuex';

import getters from './getters';

import app from './modules/app';
import permission from './modules/permission';
import seq from './modules/seq';
import basic from './modules/basic';
import user from './modules/user';
import peptide from './modules/peptide';
import system from './modules/system';
import pay from './modules/pay';

Vue.use(Vuex);

// 根据更新的全局数据，设置本地缓存
const setCache = store => {
  store.subscribe((mutation, state) => {
    Vue.ls.set('cache', state);
  });
};

export default new Vuex.Store({
  modules: {
    app,
    permission,
    seq,
    basic,
    user,
    peptide,
    system,
    pay
  },
  state: {
    theme: 'dark'
  },
  mutations: {
    setCacheByLocalStorage (state, payload) {
      state = payload;
    }
  },
  actions: {},
  plugins: [setCache],
  getters
});

import Vue from 'vue';
import Vuex from 'vuex';

import seq from './modules/seq';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    seq
  },
  state: {
    collapsed: false,
    theme: 'dark'
  },
  mutations: {
    // 切换侧栏导航的展开与关闭
    toggleSideMenu (state) {
      state.collapsed = !state.collapsed;
    }
  },
  actions: {

  }
});

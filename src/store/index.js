import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
  },
  state: {
    collapsed: false
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

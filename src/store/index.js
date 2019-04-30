import Vue from 'vue';
import Vuex from 'vuex';

import seq from './modules/seq';

Vue.use(Vuex);

// 根据更新的全局数据，设置本地缓存
const setCache = store => {
  store.subscribe((mutation, state) => {
    Vue.ls.set('cache', JSON.stringify(state));
  });
};

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production', // 开发模式下开启严格模式
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

  },
  plugins: [setCache]
});

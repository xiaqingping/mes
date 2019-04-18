export const state = () => ({
  baseURL: 'https://devapi.sangon.com:8443/api',
  authorization: undefined,
  user: null
});

export const mutations = {
  // 切换侧栏导航的展开与关闭
  toggle(state) {
    state.collapsed = !state.collapsed;
  }
};

export const actions = {
  logout({ commit }) {}
};

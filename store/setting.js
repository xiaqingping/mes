export const state = () => ({
  collapsed: false
});

export const mutations = {
  // 切换侧栏导航的展开与关闭
  toggleSideMenu(state) {
    state.collapsed = !state.collapsed;
  }
};

export const actions = {};

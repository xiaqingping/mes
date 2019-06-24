export default {
  namespaced: true,
  state: {
    token: '',
    roles: [],
    user: {}
  },
  mutations: {
    set_roles: (state, roles) => {
      state.roles = roles;
    },
    set_user: (state, user) => {
      state.user = user;
    }
  },
  actions: {}
};

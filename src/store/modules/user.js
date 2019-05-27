export default {
  namespaced: true,
  state: {
    token: '',
    roles: []
  },
  mutations: {
    set_roles: (state, roles) => {
      state.roles = roles;
    }
  },
  actions: {}
};

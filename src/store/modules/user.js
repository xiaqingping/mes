export default {
  namespaced: true,
  state: {
    token: '',
    roles: []
  },
  mutations: {
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    }
  },
  actions: {}
};

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
  actions: {
    // 获取角色信息
    getRole ({ commit }) {
      return new Promise((resolve, reject) => {
        const getRole = function () {};

        getRole().then(response => {
          const result = response.result;

          if (result.role && result.role.permissions.length > 0) {
            const role = result.role;
            role.permissions = result.role.permissions;
            role.permissions.map(per => {
              if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
                const action = per.actionEntitySet.map(action => { return action.action; });
                per.actionList = action;
              }
            });
            role.permissionList = role.permissions.map(permission => { return permission.permissionId; });
            commit('SET_ROLES', result.role);
            commit('SET_INFO', result);
          } else {
            reject(new Error('getRole: roles must be a non-null array !'));
          }

          resolve(response);
        }).catch(error => {
          reject(error);
        });
      });
    }
  }
};

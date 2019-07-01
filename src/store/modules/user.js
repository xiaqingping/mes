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
        const getRole = function () {
          return new Promise((resolve, reject) => {
            const data = {
              role: {
                id: 'admin',
                name: '管理员',
                describe: '拥有所有权限',
                permissions: [
                  {
                    roleId: 'admin',
                    permissionId: 'seqtype',
                    permissionName: '测序类型',
                    actionEntitySet: [
                      {
                        action: 'add',
                        describe: '新增',
                        value: true
                      }
                    ],
                    actionList: null
                  }
                ]
              }
            };
            resolve(data);
          });
        };

        getRole().then(role => {
          if (role && role.permissions.length > 0) {
            role.permissions.map(per => {
              if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
                const action = per.actionEntitySet.map(action => { return action.action; });
                per.actionList = action;
              }
            });
            role.permissionList = role.permissions.map(permission => { return permission.permissionId; });
            commit('SET_ROLES', role);
          } else {
            reject(new Error('getRole: role.permissions 必须是一个非空数组!'));
          }

          resolve(role);
        }).catch(error => {
          reject(error);
        });
      });
    }
  }
};

// 系统管理
module.exports = {
  path: '/system',
  name: 'system',
  icon: 'smile',
  routes: [
    {
      name: 'user',
      path: '/system/user',
      component: './system/user',
    },
    // {
    //   name: 'authorization',
    //   path: '/system/authorization',
    //   component: './system/authorization',
    // },
    // {
    //   name: 'code-rule',
    //   path: '/system/code-rule',
    //   component: './system/code-rule',
    // },
    {
      name: 'sources',
      path: '/system/sources',
      component: './system/sources',
    },
    {
      name: 'rules',
      path: '/system/rules',
      component: './system/rules',
    },
    {
      name: 'group',
      path: '/system/group',
      component: './system/group',
    },
  ],
};

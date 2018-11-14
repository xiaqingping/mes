export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [
      // dashboard
      { path: '/', redirect: '/system/user' },
      // 测序
      {
        name: 'seq',
        icon: 'user',
        path: '/seq',
        routes: [
          {
            path: '/seq/order',
            name: 'order',
            component: './Seq/Order',
          },
        ],
      },
      // 系统管理
      {
        name: 'system',
        icon: 'user',
        path: '/system',
        routes: [
          {
            path: '/system/user',
            name: 'user',
            component: './System/User',
          },
          {
            path: '/system/source',
            name: 'source',
            component: './System/Source',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];

// 高通量测序
module.exports = {
  path: '/dashboard',
  name: 'dashboard',
  icon: 'smile',
  redirect: '/dashboard/sale',
  routes: [
    {
      name: 'sale',
      path: '/dashboard/sale',
      component: './dashboard/sale',
    },
  ],
};

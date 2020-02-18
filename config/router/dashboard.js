// 数据分析
module.exports = {
  path: '/dashboard',
  name: 'dashboard',
  icon: 'smile',
  routes: [
    {
      path: '/dashboard',
      redirect: '/dashboard/sale',
    },
    {
      name: 'sale',
      path: '/dashboard/sale',
      component: './dashboard/sale',
    },
  ],
};

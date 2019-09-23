// 人事管理
module.exports = {
  path: '/personel',
  name: 'personel',
  icon: 'smile',
  routes: [
    {
      name: 'pay',
      path: '/personel/pay',
      component: './personel/pay',
    },
    {
      name: 'payroll',
      path: '/personel/payroll',
      component: './personel/payroll',
    },
  ],
};
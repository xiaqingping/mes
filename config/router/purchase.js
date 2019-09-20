// 采购管理
module.exports = {
  path: '/purchase',
  name: 'purchase',
  icon: 'smile',
  routes: [
    {
      name: 'apply',
      path: '/purchase/apply',
      component: './purchase/apply',
    },
    {
      name: 'order',
      path: '/purchase/order',
      component: './purchase/order',
    },
    {
      name: 'payment',
      path: '/purchase/payment',
      component: './purchase/payment',
    },
    {
      name: 'bank',
      path: '/purchase/bank',
      component: './purchase/bank',
    },
    {
      name: 'supplier',
      path: '/purchase/supplier',
      component: './purchase/supplier',
    }
  ],
};

// 测序
module.exports = {
  path: '/seq',
  name: 'seq',
  icon: 'smile',
  routes: [
    {
      name: 'order',
      path: '/seq/order',
      component: './seq/order',
    },
    {
      name: 'carrier-series',
      path: '/seq/carrier-series',
      component: './seq/carrier-series',
    },
  ],
};

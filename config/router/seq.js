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
    {
      name: 'carrier',
      path: '/seq/carrier',
      component: './seq/carrier',
    },
    {
      name: 'product',
      path: '/seq/product',
      component: './seq/product',
    },
    {
      name: 'sample-type',
      path: '/seq/sample-type',
      component: './seq/sample-type',
    },
    {
      name: 'sample-resistance',
      path: '/seq/sample-resistance',
      component: './seq/sample-resistance',
    },
    {
      name: 'sample-feature',
      path: '/seq/sample-feature',
      component: './seq/sample-feature',
    },
    {
      name: 'seqdevice',
      path: '/seq/seqdevice',
      component: './seq/seqdevice',
    },
    {
      name: 'sample-prepare',
      path: '/seq/sample-prepare',
      component: './seq/sample-prepare',
    },
    {
      name: 'seqfactory',
      path: '/seq/seqfactory',
      component: './seq/seqfactory',
    },
  ],
};

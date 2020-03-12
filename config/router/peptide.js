// 多肽
module.exports = {
  path: '/peptide',
  name: 'peptide',
  icon: 'smile',
  routes: [
    {
      name: 'order',
      path: '/peptide/order',
      component: './peptide/order',
    },
    {
      // name: 'orderPrint',
      path: '/peptide/orderPrint',
      hideChildrenInMenu: true,
      component: './peptide/order/order-print.jsx',
      exact: false,
    },
    {
      name: 'purity',
      path: '/peptide/purity',
      component: './peptide/purity',
    },
    {
      name: 'product',
      path: '/peptide/product',
      component: './peptide/product',
    },
    {
      name: 'amino-acid',
      path: '/peptide/amino-acid',
      component: './peptide/amino-acid',
    },
    {
      name: 'modifications',
      path: '/peptide/modifications',
      component: './peptide/modifications',
    },
    {
      name: 'modifications-type',
      path: '/peptide/modifications-type',
      component: './peptide/modifications-type',
    },
    {
      name: 'modification-products',
      path: '/peptide/modification-products',
      component: './peptide/modification-products',
    },
    {
      name: 'disulfide-bond-products',
      path: '/peptide/disulfide-bond-products',
      component: './peptide/disulfide-bond-products',
    },
  ],
};

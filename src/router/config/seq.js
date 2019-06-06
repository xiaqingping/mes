import { PageView } from '@/layouts';

export default {
  path: '/seq',
  name: 'seq',
  redirect: '/seq/order',
  component: PageView,
  meta: { title: '测序管理', keepAlive: true, icon: 'dashboard', permission: [ 'dashboard' ] },
  children: [
    {
      path: '/seq/sample_order',
      name: 'seq-sample-order',
      component: () => import('@/views/seq/sample_order'),
      meta: { title: '取样单', keepAlive: false, permission: [ 'dashboard' ] }
    },
    {
      path: '/seq/order',
      name: 'seq-order',
      component: () => import('@/views/seq/order'),
      meta: { title: '测序订单', keepAlive: false, permission: [ 'dashboard' ] }
    },
    {
      path: '/seq/product',
      name: 'seq-product',
      component: () => import('@/views/seq/product'),
      meta: { title: '测序产品', keepAlive: false, permission: [ 'dashboard' ] }
    }
  ]
};

import { RouteView } from '@/components/layouts';

export default {
  path: '/seq',
  name: 'seq',
  redirect: '/seq/order',
  component: RouteView,
  meta: { title: '测序管理', keepAlive: true, icon: 'dashboard', permission: [ 'dashboard' ] },
  children: [
    {
      path: '/seq/order',
      name: 'seq-order',
      component: () => import('@/views/seq/order'),
      meta: { title: '测序订单', keepAlive: false, permission: [ 'dashboard' ] }
    }
  ]
};

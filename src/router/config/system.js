import { RouteView } from '@/components/layouts';

export default {
  path: '/system',
  name: 'system',
  redirect: '/system/user',
  component: RouteView,
  meta: { title: '系统管理', keepAlive: true, icon: 'dashboard', permission: [ 'dashboard' ] },
  children: [
    {
      path: '/system/user',
      name: 'system-user',
      component: () => import('@/views/system/user'),
      meta: { title: '用户管理', keepAlive: false, permission: [ 'dashboard' ] }
    }
  ]
};

import { PageView } from '@/layouts';

export default {
  path: '/system',
  name: 'system',
  redirect: '/system/user',
  component: PageView,
  meta: { title: '系统管理', keepAlive: true, icon: 'dashboard', permission: [ 'dashboard' ] },
  children: [
    {
      path: '/system/user',
      name: 'system-user',
      component: () => import('@/views/system/user'),
      meta: { title: '用户管理', keepAlive: false, permission: [ 'dashboard' ] }
    },
    {
      path: '/system/menu',
      name: 'system-menu',
      component: () => import('@/views/system/menu'),
      meta: { title: '菜单管理', keepAlive: false, permission: [ 'dashboard' ] }
    }
  ]
};

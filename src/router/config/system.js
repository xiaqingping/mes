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
      path: '/system/code_rule',
      name: 'system-code-rule',
      component: () => import('@/views/system/code_rule'),
      meta: { title: '编号规则', keepAlive: false, permission: [ 'dashboard' ] }
    },
    {
      path: '/system/authorization',
      name: 'system-authorization',
      component: () => import('@/views/system/authorization'),
      meta: { title: '用户权限', keepAlive: false, permission: [ 'dashboard' ] }
    },
    {
      path: '/system/sources',
      name: 'system-sources',
      component: () => import('@/views/system/sources'),
      meta: { title: '资源', keepAlive: false, permission: [ 'dashboard' ] }
    },
    {
      path: '/system/rule',
      name: 'system-rule',
      component: () => import('@/views/system/rule'),
      meta: { title: '规则', keepAlive: false, permission: [ 'dashboard' ] }
    },
    {
      path: '/system/group',
      name: 'system-group',
      component: () => import('@/views/system/group'),
      meta: { title: '分组', keepAlive: false, permission: [ 'dashboard' ] }
    }
  ]
};

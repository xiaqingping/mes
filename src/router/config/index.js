import { UserLayout, BasicLayout } from '@/layouts';
// 测序管理
import seq from './seq';
// 系统管理
import system from './system';
// 多肽管理
import peptide from './peptide';
// 人事管理
import personnel from './personnel';

/**
 * 重定向设置，默认为首页（/home）
 */
let redirect = '/home';
if (process.env.NODE_ENV === 'development') {
  // 开发时，重定向到 .evn.development.local 文件中，VUE_APP_redirect 设置的路由（示例：VUE_APP_redirect=/seq/series）
  if (process.env.VUE_APP_redirect) redirect = process.env.VUE_APP_redirect;
} else if (process.env.NODE_ENV === 'production') {
  // 生产时，应该重定向到用户设置的路由
}

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: redirect,
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/home'),
        meta: { title: '首页', keepAlive: true, icon: 'dashboard', permission: [ 'dashboard' ] }
      },
      peptide,
      seq,
      personnel,
      system
    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
];

// 基础路由
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/login')
      }
    ]
  }, {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
];

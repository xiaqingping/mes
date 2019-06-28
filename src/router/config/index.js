import { UserLayout, BasicLayout } from '@/layouts';
// 测序管理
import seq from './seq';
// 系统管理
import system from './system';
// 多肽管理
import peptide from './peptide';
// 人事管理
import personnel from './personnel';

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/seq/seqfactory',
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

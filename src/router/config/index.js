import { UserLayout, BasicLayout } from '@/layouts';
// 测序管理
import seq from './seq';
// 系统管理
import system from './system';

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/seq/sample_order',
    children: [
      seq,
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

import Vue from 'vue';
import router from './router';
import store from './store';

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({ showSpinner: false });

const whiteList = ['login']; // 白名单不会重定向

router.beforeEach((to, from, next) => {
  NProgress.start();
  if (Vue.ls.get('TOKEN')) {
    if (to.path === '/user/login') {
      next({ path: '/' });
      NProgress.done();
    } else {
      if (store.state.user.roles.length === 0) {
        const roles = {
          permissionList: [ 'dashboard' ],
          permissions: [
            {
              actionList: ['search', 'add', 'edit'],
              permissionId: 'dashboard'
            }
          ]
        };
        store.commit('user/set_roles', roles);
        store.dispatch('permission/generateRoutes', roles).then(() => {
          // 根据roles权限生成可访问的路由表
          // 动态添加可访问路由表
          router.addRoutes(store.state.permission.addRouters);
          const redirect = decodeURIComponent(from.query.redirect || to.path);
          if (to.path === redirect) {
            // hack方法 确保addRoutes已完成, replace: true 导航不会留下浏览记录
            next({ ...to, replace: true });
          } else {
            // 跳转到目的路由
            next({ path: redirect });
          }
        });
        next();
      } else {
        next();
      }
    }
  } else {
    if (whiteList.includes(to.name)) {
      // 白名单免登录
      next();
    } else {
      next({ path: '/user/login', query: { redirect: to.fullPath } });
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});

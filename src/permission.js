import Vue from 'vue';
import router from './router';
import store from './store';

import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ['login']; // 白名单不会重定向

router.beforeEach((to, from, next) => {
  NProgress.start(); // 开始进度条
  const TOKEN = Vue.ls.get('TOKEN');
  if (TOKEN) {
    if (to.path === '/user/login') {
      next({ path: '/' });
      NProgress.done();
    } else {
      console.log(store);
      console.log(store.getters);
      if (store.getters.roles.length === 0) {
        const roles = {
          permissionList: [ 'dashboard' ]
        };
        store.commit('use/SET_ROLES', roles);
        // store.dispatch('GenerateRoutes', { roles }).then(() => {
        //   // 根据roles权限生成可访问的路由表
        //   // 动态添加可访问路由表
        //   router.addRoutes(store.getters.addRouters);
        //   const redirect = decodeURIComponent(from.query.redirect || to.path);
        //   if (to.path === redirect) {
        //     // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
        //     next({ ...to, replace: true });
        //   } else {
        //     // 跳转到目的路由
        //     next({ path: redirect });
        //   }
        // });
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
  NProgress.done(); // 结束进度条
});

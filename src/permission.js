// import Vue from 'vue';
import router from './router';
// import store from './store';

import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ['login']; // 白名单不会重定向

router.beforeEach((to, from, next) => {
  NProgress.start(); // start progress bar
  const TOKEN = sessionStorage.getItem('TOKEN');
  if (TOKEN) {
    if (to.path === '/user/login') {
      next({ path: '/' });
      NProgress.done();
    } else {
      next();
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
  NProgress.done(); // finish progress bar
});

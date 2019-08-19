import Vue from 'vue';
import Router from 'vue-router';
import { constantRouterMap } from './config';

// 解决 vue-router@3.1 后，跳转相同路由，弹出的错误提示 `NavigationDuplicated`
const originalPush = Router.prototype.push;
Router.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch(err => err);
};

Vue.use(Router);

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});

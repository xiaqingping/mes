import Vue from 'vue';
import Router from 'vue-router';
import { constantRouterMap } from './config';

Vue.use(Router);

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});

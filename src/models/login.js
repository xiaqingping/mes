import router from 'umi/router';
import user from '@/services/user';
import { getPageQuery } from '@/utils/utils';

export default {
  namespaced: 'login',

  state: {
    status: undefined,
  },

  effects: {
    // 登录
    *login({ payload }, { call, put }) {
      let login;
      if (payload.type === 'account') {
        login = user.loginByPwd;
      } else if (payload.type === 'mobile') {
        login = user.loginByCode;
      }

      const response = yield call(login, payload);
      localStorage.Authorization = response.authorization;
      localStorage.user = JSON.stringify(response);

      yield put({
        type: 'user/saveCurrentUser',
        payload: response,
      });

      const urlParams = new URL(window.location.href);
      const params = getPageQuery();
      let { redirect } = params;
      if (redirect) {
        const redirectUrlParams = new URL(redirect);
        if (redirectUrlParams.origin === urlParams.origin) {
          redirect = redirect.substr(urlParams.origin.length);
          if (redirect.match(/^\/.*#/)) {
            redirect = redirect.substr(redirect.indexOf('#') + 1);
          }
        } else {
          window.location.href = redirect;
          return;
        }
      }
      router.replace(redirect || '/');
    },
    // 登出
    logout() {
      router.replace('/user/login');
    },
  },
};

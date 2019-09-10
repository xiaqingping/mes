import { routerRedux } from 'dva/router';
import { stringify } from 'querystring';

import user from '@/api/user';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    *login({ payload }, { call, put }) {
      let response = null;

      try {
        if (payload.type === 'account') {
          response = yield call(user.loginByPwd, payload);
        } else {
          response = yield call(user.loginByCode, payload);
        }

        yield put({
          type: 'changeLoginStatus',
          payload: response,
        });

        if (response) {
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

          yield put(routerRedux.replace(redirect || '/'));
        }
      } catch (error) {
        console.log(error);
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(user.getVerifycode, payload);
    },

    *logout(_, { put }) {
      const { redirect } = getPageQuery(); // redirect

      if (window.location.pathname !== '/user/login' && !redirect) {
        yield put(
          routerRedux.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          }),
        );
      }
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      // TODO: 权限控制
      setAuthority(payload.currentAuthority || 'admin');
      localStorage.setItem('token', payload.authorization);
      return { ...state, status: payload.status, type: payload.type };
    },
  },
};
export default Model;

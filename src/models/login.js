import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
// import { fakeAccountLogin, getFakeCaptcha } from '@/services/api';
import { loginByPwd, loginByCode, getVerifycode } from '@/services/user';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      let response;
      const { type } = payload;
      if (type === 'account') {
        response = yield call(loginByPwd, payload);
      } else {
        response = yield call(loginByCode, payload);
      }
      response.currentAuthority = 'admin';

      localStorage.user = JSON.stringify(response);
      localStorage.Authorization = response.authorization;

      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });

      // 登陆成功
      reloadAuthorized();
      const urlParams = new URL(window.location.href);
      const params = getPageQuery();
      let { redirect } = params;
      if (redirect) {
        const redirectUrlParams = new URL(redirect);
        if (redirectUrlParams.origin === urlParams.origin) {
          redirect = redirect.substr(urlParams.origin.length);
          if (redirect.startsWith('/#')) {
            redirect = redirect.substr(2);
          }
        } else {
          window.location.href = redirect;
          return;
        }
      }
      yield put(routerRedux.replace(redirect || '/'));
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getVerifycode, payload);
    },

    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};

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

        response.avatar = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1571310110031&di=c5c3557d5172db919d831cca34586e4c&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20170718%2Fdc7a88ed8b5146368b068fc71c8c8533.jpeg';

        localStorage.setItem('user', JSON.stringify(response));
        yield put({
          type: 'changeLoginStatus',
          payload: response,
        });
        yield put({
          type: 'user/saveCurrentUser',
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

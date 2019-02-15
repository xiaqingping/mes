import router from 'umi/router';
import user from '@/services/user';
import { getPageQuery } from '@/utils/utils';

export default {
  namespaced: 'login',

  state: {
    status: undefined,
  },

  effects: {
    login({payload}, {call, put}) {
      console.log(payload);
      let login;
      if (payload.type === 'account') {
        login = user.loginByPwd;
      } else if (payload.type === 'mobile') {
        login = user.loginByCode;
      }

      login(payload).then(res => {
        localStorage.Authorization = res.authorization;
        localStorage.user = JSON.stringify(res);

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
      });
    }
  }
}

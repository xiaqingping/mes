/*
 * 用户服务
 * https://devapi.sangon.com:8443/api/user/swagger-ui.html
 */

import request from '~~/assets/js/request';

export default {
  // 获取验证码
  getVerifycode: function(params) {
    return request(`/user/v1/code/generate/${params.mobile}`);
  },

  // 密码登陆
  loginByPwd: function(params) {
    return request(`/user/v1/user/login/password/${params.usercode}/${params.password}`);
  },

  // 手机验证码登陆
  loginByCode: function(params) {
    return request(`/user/v1/user/login/verifycode/${params.mobile}/${params.captcha}`);
  }
};

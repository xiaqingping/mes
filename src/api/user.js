/*
 * 用户服务
 * https://devapi.sangon.com:8443/api/user/swagger-ui.html
 */

import request from '@/utils/request';

export default {
  // 获取验证码
  getVerifycode(mobile) {
    return request(`/user/v1/code/generate/${mobile}`);
  },

  // 密码登陆
  loginByPwd(params) {
    return request(`/user/v1/user/login/password/${params.usercode}/${params.password}`);
  },

  // 手机验证码登陆
  loginByCode(params) {
    return request(`/user/v1/user/login/verifycode/${params.mobile}/${params.captcha}`);
  },

  // 退出登录
  logout(token) {
    return request(`/user/v1/user/logout/${token}`);
  },

  // 查询用户列表
  getUserList(params) {
    return request('/user/v1/user/easyui', { params });
  },

  // 重置密码
  resetPasswords (data) {
    return request(`/user/v1/user/${data.code}/password/reset`, { method: 'PUT', data });
  },
};

/*
 * 用户服务
 * https://devapi.sangon.com:8443/api/user/swagger-ui.html
 */
import qs from 'qs';
import request from '@/utils/request';

export default {
  // 获取验证码
  getCaptcha(mobile) {
    return request(`/user/v1/code/generate/${mobile}`);
  },
  // 密码登陆
  loginByPwd(params) {
    return request(`/user/v1/user/login/password/${params.usercode}/${params.password}`);
  },
  // 手机验证码登录
  loginByCode(params) {
    return request(`/user/v1/user/login/verifycode/${params.mobile}/${params.captcha}`);
  },
  // 查询用户
  getUser(params) {
    return request(`/user/v1/user/easyui?${qs.stringify(params)}`);
  },
};

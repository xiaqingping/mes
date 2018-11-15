import qs from 'qs';
import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/currentUser');
}

// 获取验证码
export async function getVerifycode(usercode) {
  return request(`/user/v1/code/generate/${usercode}`);
}

// 密码登陆
export async function loginByPwd(params) {
  return request(`/user/v1/user/login/password/${params.usercode}/${params.password}`);
}

// 手机验证码登陆
export async function loginByCode(params) {
  return request(`/user/v1/user/login/verifycode/${params.usercode}/${params.verifycode}`);
}

// 查询用户
export async function getUser(params) {
  return request(`/user/v1/user/easyui?${qs.stringify(params)}`);
}

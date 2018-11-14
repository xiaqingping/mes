import qs from 'qs';
import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/currentUser');
}

// user 微服务
// 查询用户
export async function getUser(params) {
  return request(`https://devapi.sangon.com:8443/api/user/v1/user/easyui?${qs.stringify(params)}`);
}

// 新增用户
export async function addUser() {
  return request();
}

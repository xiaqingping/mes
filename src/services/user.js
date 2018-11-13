import qs from 'qs';
import request from '@/utils/request';
import request1 from '@/utils/request1';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/currentUser');
}

// user 微服务
export async function getUser(params) {
  return request1(`https://devapi.sangon.com:8443/api/user/v1/user/easyui?${qs.stringify(params)}`);
}

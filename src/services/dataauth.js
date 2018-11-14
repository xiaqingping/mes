import qs from 'qs';
import request from '@/utils/request';

// 查询资源
export async function getSource(params) {
  return request(
    `https://devapi.sangon.com:8443/api/dataauth/v1/data/sources/easyui?${qs.stringify(params)}`
  );
}

// 新增
export async function addUser() {
  return request();
}

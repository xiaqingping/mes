import request from '@/utils/request';

export async function getSeries(params) {
  return request('/series/v1/series/easyui', { params });
}

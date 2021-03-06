/*
 * 取样单
 * https://devapi.sangon.com:8443/api/sampleorder/swagger-ui.html
 */

import request from '@/utils/request';

export default {
  // 获取取样单
  getOrderList(params, easyui) {
    return request(`/sampleorder/v1/sampleorders${easyui ? '/easyui' : ''}`, { params });
  },
};

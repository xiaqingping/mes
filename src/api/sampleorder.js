/*
 * 取样单
 * https://devapi.sangon.com:8443/api/sampleorder/swagger-ui.html
 */

import request from '../assets/js/request';

export default {
  // 获取取样单
  getOrderList (params) {
    return request(`/sampleorder/v1/sampleorders/easyui`, { params });
  }
};

/*
 * 测序订单
 * https://devapi.sangon.com:8443/api/seqorder/swagger-ui.html
 */

import request from '../assets/js/request';

export default {
  // 查询测序订单
  getOrderList (params) {
    return request(`/seqorder/v1/seqorders/easyui`, { params });
  }
};

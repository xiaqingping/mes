/*
 *多肽订单
 * http://192.168.19.71:8289/swagger-ui.html    peptideorder
 */

import request from '../assets/js/request';

export default {
  /** ****************************** 多肽订单 ************************************/
  // 获取订单列表
  getOrder (params) {
    return request(`/peptideorder/v1/orders/easyui`, { params });
  }
};

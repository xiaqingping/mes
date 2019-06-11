/*
 * 载体
 * https://devapi.sangon.com:8443/api/carrier/swagger-ui.html
 */

import request from '../assets/js/request';

export default {
  // 查询载体
  getCarrier (params, easyui) {
    return request(`/carrier/v1/carriers${easyui ? '/easyui' : ''}`, { params });
  }
};

/*
 * 载体系列
 * https://devapi.sangon.com:8443/api/series/swagger-ui.html
 */

import request from '../assets/js/request';

export default {
  // 查询测序订单
  getSeries (params, easyui) {
    return request(`/series/v1/series${easyui ? '/easyui' : ''}`, { params });
  }
};

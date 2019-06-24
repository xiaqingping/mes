/*
 * 载体
 * https://devapi.sangon.com:8443/api/carrier/swagger-ui.html
 */

import request from '../assets/js/request';

export default {
  // 查询
  getCarrier (params, easyui) {
    return request(`/carrier/v1/carriers${easyui ? '/easyui' : ''}`, { params });
  },
  // 新增
  addCarrier (data) {
    return request(`/carrier/v1/carriers`, { method: 'POST', data });
  },
  // 修改
  updateCarrier (data) {
    return request(`/carrier/v1/carriers/${data.id}`, { method: 'PUT', data });
  },
  // 作废
  cancelCarrier (id) {
    return request(`/carrier/v1/carriers/${id}`, { method: 'DELETE' });
  }
};

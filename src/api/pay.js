/*
 * 工资管理
 * https://devapi.sangon.com:8443/api/sampleorder/swagger-ui.html
 */

import request from '../assets/js/request';

export default {
  // 获取员工信息
  getPay (params) {
    return request(`/pay/v1/date/easyui`, { params });
  },
  // 删除员工信息
  deletepays () {
    return request(`/pay/v1/date/invalid`, { method: 'PUT' });
  },
  // 上传excel表格
  uploadpays () {
    return request(`/pay/v1/date/excel`, { method: 'POST' });
  },
  // 获取工资类型
  getTypepay (params) {
    return request(`/pay/v1/type/easyui`, { params });
  },
  // 新增工资类型
  increaseTypepay () {
    return request(`/pay/v1/type`, { method: 'POST' });
  },
  // 删除工资类型
  deleteTypepays (params) {
    return request(`/pay/v1/type/${params}/invalid`, { method: 'PUT' });
  }
};

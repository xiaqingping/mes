/*
 * 工资管理
 * https://devapi.sangon.com:8443/api/pay/swagger-ui.html
 */

import request from '@/utils/request';

export default {
  // 获取员工信息
  getPay(params) {
    return request('/pay/v1/date/easyui', { params });
  },
  // 保存员工信息
  increasepay(params) {
    return request('/pay/v1/date', { method: 'POST', data: params });
  },
  // 删除员工信息
  deletepays() {
    return request('/pay/v1/date/invalid', { method: 'PUT' });
  },
  // 上传excel表格
  uploadpays(options) {
    return request('/pay/v1/date/excel', { method: 'POST', ...options });
  },
  // 获取工资类型
  getTypepay(params) {
    return request('/pay/v1/type/easyui', { params });
  },
  // 保存工资类型
  increaseTypepay(params) {
    return request('/pay/v1/type', { method: 'POST', data: params });
  },
  // 删除工资类型
  deleteTypepays(params) {
    return request(`/pay/v1/type/${params}/invalid`, { method: 'PUT' });
  },
  // 员工工资详细
  getPays (id) {
    return request(`/pay/v1/item/date/${id}?userCode=${100102}`);
  },
};

/*
 * 测序点、
 * https://devapi.sangon.com:8443/api/seqfactory/swagger-ui.html
 */

import request from '../assets/js/request';

export default {
  /**
   * 测序点
   */
  // 查询
  getSeqfactory (params, easyui) {
    return request(`/seqfactory/v1/seqfactory${easyui ? '/easyui' : ''}`, { params });
  },
  // 新增
  addSeqfactory (data) {
    return request(`/seqfactory/v1/seqfactory`, { method: 'POST', data });
  },
  // 修改
  updateSeqfactory (data) {
    return request(`/seqfactory/v1/seqfactory/${data.id}`, { method: 'PUT', data });
  },
  // 作废
  cancelSeqfactory (id) {
    return request(`/seqfactory/v1/seqfactory/${id}`, { method: 'DELETE' });
  },

  /**
   * 测序点之网点
   */
  // 查询
  getOfficeBySeqfactory (seqfactoryId) {
    return request(`/seqfactory/v1/seqfactory/${seqfactoryId}/office`);
  },
  // 新增
  addOfficeBySeqfactory (data) {
    return request(`/seqfactory/v1/seqfactory/${data.seqfactoryId}/office`, { method: 'POST', data });
  },
  // 作废
  cancelOfficeBySeqfactory (data) {
    return request(`/seqfactory/v1/seqfactory/office/${data.id}`, { method: 'DELETE' });
  }
};

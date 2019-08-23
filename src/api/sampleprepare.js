/*
 * 样品用量、样品排版、样品制备
 * https://devapi.sangon.com:8443/api/sampleprepare/swagger-ui.html
 */

import request from '@/assets/js/request';

export default {
  /**
   * 样品用量
   */
  // 查询
  getSampleDose (params) {
    return request(`/sampleprepare/v1/samplepreparedose/easyui`, { params });
  },
  // 新增
  addSampleDose (data) {
    return request(`/sampleprepare/v1/samplepreparedose`, { method: 'POST', data });
  },
  // 修改
  updateSampleDose (data) {
    return request(`/sampleprepare/v1/samplepreparedose/${data.id}`, { method: 'PUT', data });
  },
  // 作废
  cancelSampleDose (id) {
    return request(`/sampleprepare/v1/samplepreparedose/${id}`, { method: 'DELETE' });
  },

  /**
   * 样品排版
   */
  // 查询
  getSamplecomposes (params) {
    return request(`/sampleprepare/v1/samplecomposes/easyui`, { params });
  },

  /**
   * 样品制备
   */
  // 查询
  getSampleprepares (params) {
    return request(`/sampleprepare/v1/sampleprepares/easyui`, { params });
  }
};

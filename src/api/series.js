/*
 * 载体系列
 * https://devapi.sangon.com:8443/api/series/swagger-ui.html
 */

import request from '../assets/js/request';

export default {
  /**
   * 载体系列
   */
  // 查询
  getSeries (params, easyui) {
    return request(`/series/v1/series${easyui ? '/easyui' : ''}`, { params });
  },
  // 新增
  addSeries (data) {
    return request(`/series/v1/series`, { method: 'POST', data });
  },
  // 修改
  updateSeries (data) {
    return request(`/series/v1/series/${data.id}`, { method: 'PUT', data });
  },
  // 作废
  cancelSeries (id) {
    return request(`/series/v1/series/${id}`, { method: 'DELETE' });
  },

  /**
   * 载体系列之引物
   */
  // 查询
  getPrimersBySeries (seriesId) {
    return request(`/series/v1/series/${seriesId}/primers`);
  },
  // 新增
  addPrimersBySeries (data) {
    return request(`/series/v1/series/${data.seriesId}/primers`, { method: 'POST', data });
  },
  // 作废
  cancelPrimersBySeries (data) {
    return request(`/series/v1/series/${data.seriesId}/primers/${data.id}`, { method: 'DELETE' });
  }
};

/*
 * 样品类型、样品特性、样品抗性、测序产品、测序类型、
 * https://devapi.sangon.com:8443/api/sampletype/swagger-ui.html
 */

import request from '@/utils/request';

export default {

  /**
   * 样品类型
   */
  // 查询
  getSampleType(params, easyui) {
    return request(`/sampletype/v1/sampletypes${easyui ? '/easyui' : ''}`, { params });
  },
  // 新增
  addSampleType(data) {
    return request('/sampletype/v1/sampletypes', { method: 'POST', data });
  },
  // 作废
  cancelSampleType(id) {
    return request(`/sampletype/v1/sampletypes/${id}`, { method: 'DELETE' });
  },

  /**
   * 样品特性
   */
  // 查询
  getSampleFeature(params, easyui) {
    return request(`/sampletype/v1/samplefeature${easyui ? '/easyui' : ''}`, { params });
  },
  // 新增
  addSampleFeature(data) {
    return request('/sampletype/v1/sampletypes', { method: 'POST', data });
  },
  // 作废
  cancelSampleFeature(id) {
    return request(`/sampletype/v1/sampletypes/${id}`, { method: 'DELETE' });
  },
  // 查询样品特性明细
  getSampleFeatureDetail(id) {
    return request(`/sampletype/v1/samplefeaturedetail/${id}/detail`);
  },

  /**
   * 样品抗性
   */
  // 查询
  getSampleResistance(params, easyui) {
    return request(`/sampletype/v1/sampleresistance${easyui ? '/easyui' : ''}`, { params });
  },
  // 新增
  addSampleResistance(data) {
    return request('/sampletype/v1/sampleresistance', { method: 'POST', data });
  },
  // 作废
  cancelSampleResistance(id) {
    return request(`/sampletype/v1/sampleresistance/${id}`, { method: 'DELETE' });
  },

  /**
   * 测序产品
   */
  // 查询
  getSeqProduct(params, easyui) {
    return request(`/sampletype/v1/seqproducts${easyui ? '/easyui' : ''}`, { params });
  },
  // 新增
  addSeqProduct(data) {
    return request('/sampletype/v1/seqproducts', { method: 'POST', data });
  },
  // 作废
  cancelSeqProduct(id) {
    return request(`/sampletype/v1/seqproducts/${id}`, { method: 'DELETE' });
  },

  /**
   * 测序类型
   */
  // 查询
  getSeqType(params, easyui) {
    return request(`/sampletype/v1/seqtypes${easyui ? '/easyui' : ''}`, { params });
  },
  // 新增
  addSeqType(data) {
    return request('/sampletype/v1/seqtypes', { method: 'POST', data });
  },
  // 作废
  cancelSeqType(id) {
    return request(`/sampletype/v1/seqtypes/${id}`, { method: 'DELETE' });
  },
};

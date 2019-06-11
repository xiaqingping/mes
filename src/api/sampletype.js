/*
 * 样品类型、样品特性、样品抗性、测序产品、测序类型、
 * https://devapi.sangon.com:8443/api/sampletype/swagger-ui.html
 */

import request from '../assets/js/request';

export default {
  // 查询样品类型
  getSampleType (params, easyui) {
    return request(`/sampletype/v1/sampletypes${easyui ? '/easyui' : ''}`, { params });
  },
  // 查询样品特性
  getSampleFeature (params, easyui) {
    return request(`/sampletype/v1/samplefeature${easyui ? '/easyui' : ''}`, { params });
  },
  // 查询样品抗性
  getSampleResistance (params, easyui) {
    return request(`/sampletype/v1/sampleresistance${easyui ? '/easyui' : ''}`, { params });
  },
  // 查询测序产品
  getSeqProduct (params, easyui) {
    return request(`/sampletype/v1/seqproducts${easyui ? '/easyui' : ''}`, { params });
  },
  // 查询测序类型
  getSeqType (params, easyui) {
    return request(`/sampletype/v1/seqtypes${easyui ? '/easyui' : ''}`, { params });
  }
};

/*
 * 样品类型、测序产品、测序类型、
 * https://devapi.sangon.com:8443/api/sampletype/swagger-ui.html
 */

import request from '../assets/js/request';

export default {
  // 查询样品类型
  getSampleType (params, easyui) {
    return request(`/sampletype/v1/sampletypes` + (easyui ? '/easyui' : ''), { params });
  },
  // 查询测序产品
  getSeqProduct (params) {
    return request(`/sampletype/v1/seqproducts/easyui`, { params });
  }
};

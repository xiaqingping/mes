/*
 * 样品用量、样品排版、样品制备
 * https://devapi.sangon.com:8443/api/sampleprepare/swagger-ui.html
 */

import request from '../assets/js/request';

export default {
  // 查询样品用量
  getSampleDose (params) {
    return request(`/sampleprepare/v1/samplepreparedose/easyui`, { params });
  },
  // 查询样品排版
  getSamplecomposes (params) {
    return request(`/sampleprepare/v1/samplecomposes/easyui`, { params });
  },
  // 查询样品制备
  getSampleprepares (params) {
    return request(`/sampleprepare/v1/sampleprepares/easyui`, { params });
  }
};

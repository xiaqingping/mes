/*
 * 样品用量
 * https://devapi.sangon.com:8443/api/sampleprepare/swagger-ui.html
 */

import request from '../assets/js/request';

export default {
  // 查询样品类型
  getSampleDose (params) {
    return request(`/sampleprepare/v1/samplepreparedose/easyui`, { params });
  }
};

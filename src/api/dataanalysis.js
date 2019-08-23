/*
 * 报表
 * https://devapi.sangon.com:8443/api/dataanalysis/swagger-ui.html
 */

import request from '@/assets/js/request';

export default {
  // 查询测序明细报表
  getSeqdataanalysis(params, easyui) {
    return request(`/dataanalysis/v1/seqdataanalysis${easyui ? '/easyui' : ''}`, { params });
  },
};

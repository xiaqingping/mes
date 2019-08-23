/*
 * 引物
 * https://devapi.sangon.com:8443/api/primer/swagger-ui.html
 */

import request from '@/assets/js/request';

export default {
  // 查询引物
  getPrimer (params, easyui) {
    return request(`/primer/v1/primers${easyui ? '/easyui' : ''}`, { params });
  },
  // 查询引物明细
  getPrimerDetails (id) {
    return request(`/primer/v1/primers/${id}`);
  }
};

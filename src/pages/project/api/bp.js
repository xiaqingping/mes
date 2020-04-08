/* eslint-disable max-len */
/*
 * 合作伙伴
 * https://devapi.sangon.com:8443/api/businesspartner/swagger-ui.html
 */

import request from '@/utils/request';

export default {
  // 业务伙伴列表查询（带分页）
  getBPList(params) {
    return request('/businessPartners/v1', {
      params,
    });
  },
};

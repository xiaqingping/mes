/*
 * 合作伙伴
 *
 */

import request from '@/utils/request';

export default {
  // 业务伙伴列表查询
  getBusinessPartners(params) {
    return request('/businessPartners/v1', { params })
  },
};

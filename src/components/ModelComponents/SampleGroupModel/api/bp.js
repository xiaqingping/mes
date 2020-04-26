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

  // 按照编号或名称模糊查询组织类客户
  // 模糊搜索开票方
  getOrgCustomerByCodeOrName(params) {
    return request('/businessPartners/v1/org/customer', {
      params,
    });
  },

  // 查询所有业务伙伴类型为组织的数据（带分页） 开票方
  getInvoiceParty(params) {
    return request('/businessPartners/v1/org', {
      params,
    });
  },
};

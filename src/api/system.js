/*
 * 用户权限
 * https://devapi.sangon.com:8443/api/dataauth/swagger-ui.html
 * 编号规则
 * https://devapi.sangon.com:8443/api/serial/swagger-ui.html
 */

import request from '../assets/js/request';

export default {
  /** ****************************** 编号规则 ************************************/
  getCodeRuleList (params) {
    return request(`/serial/v1/rules/easyui`, { params });
  },

  /** ****************************** 权限 ************************************/
  // 查询用户权限列表
  getDataAuthList (params) {
    return request(`/dataauth/v1/data/clients/easyui`, { params });
  },

  // 查询权限资源
  getSourcesList (params) {
    return request(`/dataauth/v1/data/sources/easyui`, { params });
  },

  // 查询权限规则
  getRulesList (params) {
    return request(`/dataauth/v1/data/rules/easyui`, { params });
  },

  // 查询分组
  getGroupsList (params) {
    return request(`/dataauth/v1/data/groups/easyui`, { params });
  },

  // 查询用户权限明细 - 用户权限
  getAuthorityList (params) {
    return request(`/dataauth/v1/data/authorizes/client`, { params });
  }

};

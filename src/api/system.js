/*
 * 用户权限
 * https://devapi.sangon.com:8443/api/dataauth/swagger-ui.html
 * 编号规则
 * https://devapi.sangon.com:8443/api/serial/swagger-ui.html
 */

import request from '../assets/js/request';

export default {
  /** ****************************** 编号规则 ************************************/
  // 查询编号规则
  getCodeRuleList (params) {
    return request(`/serial/v1/rules/easyui`, { params });
  },

  // 查询编号规则内容
  getContentList (params) {
    return request(`/serial/v1/contents/easyui`, { params });
  },

  getDerailList (params) {
    return request(`/serial/v1/details/easyui`, { params });
  },

  // 查询编号规则条件
  getConditionsList (params) {
    return request(`/serial/v1/conditions/easyui`, { params });
  },

  /** ****************************** 用户权限 ************************************/
  // 查询用户权限列表
  getDataAuthList (params) {
    return request(`/dataauth/v1/data/clients/easyui`, { params });
  },
  // 查询用户权限明细
  getAuthorityList (params) {
    return request(`/dataauth/v1/data/authorizes/client/${params}`);
  },
  // 查询明细
  getGrouprulesList (params) {
    return request(`/dataauth/v1//data/grouprules/easyui/${params}/rules`);
  },

  /** ****************************** 资源 ************************************/
  // 查询权限资源
  getSourcesList (params) {
    return request(`/dataauth/v1/data/sources/easyui`, { params });
  },

  /** ****************************** 规则 ************************************/
  // 查询权限规则
  getRulesList (params) {
    return request(`/dataauth/v1/data/rules/easyui`, { params });
  },

  /** ****************************** 分组 ************************************/
  // 查询分组
  getGroupsList (params) {
    return request(`/dataauth/v1/data/groups/easyui`, { params });
  },
  // 新增分组
  inserGroupList (params) {
    return request(`/dataauth/v1/data/groups/list`, { method: 'put', data: params });
  },
  // 查询一个分组中的规则
  getGroupRulesList (params) {
    return request(`/dataauth/v1/data/grouprules/easyui/${params}/rules`);
  }
};

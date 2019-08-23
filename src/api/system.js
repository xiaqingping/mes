/*
 * 用户权限
 * https://devapi.sangon.com:8443/api/dataauth/swagger-ui.html
 * 编号规则
 * https://devapi.sangon.com:8443/api/serial/swagger-ui.html
 */

import request from '@/assets/js/request';

export default {
  /** ****************************** 编号规则 ************************************/
  // 查询 - 编号规则
  getCodeRuleList (params) {
    return request(`/serial/v1/rules/easyui`, { params });
  },

  // 查询 - 编号规则 内容 (分页-1)
  getContentList (params) {
    return request(`/serial/v1/contents/easyui`, { params });
  },

  // 查询 - 编号规则 取值 (分页-2)
  getDerailList (params) {
    return request(`/serial/v1/details/easyui`, { params });
  },

  // 查询 - 编号规则 条件 (分页-3)
  getConditionsList (params) {
    return request(`/serial/v1/conditions/easyui`, { params });
  },

  /** ****************************** 用户权限 ************************************/
  // 查询 - 用户权限 列表
  getDataAuthList (params) {
    return request(`/dataauth/v1/data/clients/easyui`, { params });
  },
  // 查询 - 用户权限 明细 (分页-1)
  getAuthorityList (params) {
    return request(`/dataauth/v1/data/authorizes/client/${params}`);
  },
  // 查询 - 明细 (分页-2)
  getGrouprulesList (params) {
    return request(`/dataauth/v1//data/grouprules/easyui/${params}/rules`);
  },

  /** ****************************** 资源 ************************************/
  // 查询 - 权限资源
  getSourcesList (params) {
    return request(`/dataauth/v1/data/sources/easyui`, { params });
  },

  /** ****************************** 规则 ************************************/
  // 查询 - 权限规则
  getRulesList (params) {
    return request(`/dataauth/v1/data/rules/easyui`, { params });
  },

  /** ****************************** 分组 ************************************/
  // 查询 - 分组
  getGroups (params) {
    return request(`/dataauth/v1/data/groups/easyui`, { params });
  },
  // 保存 - 分组
  inserGroups (params) {
    return request(`/dataauth/v1/data/groups/list`, { method: 'PUT', params });
  },
  // 查询 - 规则分组 (分页)
  getGroupRules (params) {
    return request(`/dataauth/v1/data/grouprules/easyui/${params}/rules`);
  }
};

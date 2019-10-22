/*
 * 用户权限
 * https://devapi.sangon.com:8443/api/dataauth/swagger-ui.html
 */

import request from '@/utils/request';

export default {
  /** ****************************** 用户 *********************************** */
  // 查询
  getClients (params) {
    return request('/dataauth/v1/data/clients/easyui', { params });
  },
  // 保存 (新增，删除)
  saveClient (data) {
    return request('/dataauth/v1/data/clients/list', { method: 'PUT', data });
  },
  /** ****************************** 用户权限 *********************************** */
  // 查询
  getAuthorizes (params) {
    return request(`/dataauth/v1/data/authorizes/client/${params}`);
  },
  // 保存 (新增，删除)
  saveAuthorizes (data) {
    return request('/dataauth/v1/data/authorizes/list', { method: 'PUT', data });
  },

  /** ****************************** 资源 *********************************** */
  // 查询 - 权限资源
  getSources (params) {
    return request('/dataauth/v1/data/sources/easyui', { params });
  },
  // 查询 - 资源参数
  getSourcesParameterList (params) {
    return request(`/dataauth/v1/data/sources/${params}`);
  },

  /** ****************************** 规则 *********************************** */
  // 查询
  getRules (params) {
    return request('/dataauth/v1/data/rules/easyui', { params });
  },
  // 保存 (新增，删除)
  saveRules (data) {
    return request('/dataauth/v1/data/rules/easyui', { method: 'PUT', data });
  },

  /** ****************************** 分组 *********************************** */
  // 查询
  getGroups (params) {
    return request('/dataauth/v1/data/groups/easyui', { params });
  },
  // 保存 (新增，删除)
  saveGroups (data) {
    return request('/dataauth/v1/data/groups/list', { method: 'PUT', data });
  },
  /** ****************************** 规则分组 *********************************** */
  // 查询
  getGroupRules (params) {
    return request(`/dataauth/v1/data/grouprules/easyui/${params}/rules`);
  },
  // 保存 (新增，删除)
  saveGroupRules (data) {
    return request('/dataauth/v1/data/grouprules/list', { method: 'PUT', data });
  },
};

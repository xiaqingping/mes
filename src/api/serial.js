/**
 * 编号规则
 * https://devapi.sangon.com:8443/api/serial/swagger-ui.html
 */

import request from '@/utils/request';

export default {
  /** ****************************** 编号规则 *********************************** */
  /**
   * 规则
   */
  // 查询
  getCodeRule (params) {
    return request('/serial/v1/rules/easyui', { params });
  },

  /**
   * 内容 (分页-1)
   */
  // 查询
  getContent (params) {
    return request('/serial/v1/contents/easyui', { params });
  },
  // 保存
  saveContent (data) {
    return request('/serial/v1/contents/list', { method: 'PUT', data });
  },
  // 删除
  deleteContent (params) {
    return request(`/serial/v1/contents/${params}`, { method: 'DELETE' });
  },

  /**
   * 取值 (分页-2)
   */
  // 查询
  getDerails (params) {
    return request('/serial/v1/details/easyui', { params });
  },
  // 保存
  saveDerails (data) {
    return request('/serial/v1/details/list', { method: 'PUT', data });
  },
  // 删除
  deleteDerails (params) {
    return request(`/serial/v1/details/${params}`, { method: 'DELETE' });
  },

  /**
   * 条件 (分页-3)
   */
  // 查询
  getConditions (params) {
    return request('/serial/v1/conditions/easyui', { params });
  },
  // 保存
  saveConditions (data) {
    return request('/serial/v1/conditions/list', { method: 'PUT', data });
  },
  // 删除
  deleteConditions (params) {
    return request(`/serial/v1/conditions/${params}`, { method: 'DELETE' });
  },
};

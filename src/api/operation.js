/* eslint-disable max-len */
/*
 * 操作记录
 * https://devapi.sangon.com:8443/api/swagger-ui.html
 */

import request from '@/utils/request';

export default {
  // 操作记录
  // 操作记录列表查询接口（带分页）
  getOperationRecords(params) {
    return request('/operationRecords/v1', {
      params,
    });
  },
  // 根据操作记录ID查询操作明细接口
  getOperationItems(operationRecordId) {
    return request(`/operationRecords/v1/${operationRecordId}/operationItems`);
  },
  // 操作记录类型查询(带分页)
  getOperationTypes(params) {
    return request('/v1/operationTypes', {
      params,
    });
  },
  // 查询操作全部类型
  getOperationTypesAll(params) {
    return request('/operationTypes/v1/all', {
      params,
    });
  },
};

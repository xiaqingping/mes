/*
 * 样品
 * https://devapi.sangon.com:8443/api/sample/swagger-ui.html
 */

import request from '@/assets/js/request';

export default {
  // 查询引物
  getSample(params, easyui) {
    return request(`/sample/v1/samples${easyui ? '/easyui' : ''}`, { params });
  },
};

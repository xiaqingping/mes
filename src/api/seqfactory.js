/*
 * 测序点、
 * https://devapi.sangon.com:8443/api/seqfactory/swagger-ui.html
 */

import request from '../assets/js/request';

export default {
  // 查询测序点
  getSeqfactory (params, easyui) {
    return request(`/seqfactory/v1/seqfactory` + (easyui ? '/easyui' : ''), { params });
  }
};

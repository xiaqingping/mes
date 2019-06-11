/*
 * 反应排版、结果分析
 * https://devapi.sangon.com:8443/api/reaction/swagger-ui.html
 */

import request from '../assets/js/request';

export default {
  // 查询反应
  getReaction (params) {
    return request(`/reaction/v1/reactions/easyui`, { params });
  },
  // 查询反应排版
  getReactioncomposes (params) {
    return request(`/reaction/v1/reactioncomposes/easyui`, { params });
  },
  // 查询结果分析
  getSeqresults (params) {
    return request(`/reaction/v1/seqresults/easyui`, { params });
  }
};

/*
 * 反应排版、结果分析
 * https://devapi.sangon.com:8443/api/reaction/swagger-ui.html
 */

import request from '@/assets/js/request';

export default {
  /**
   * 反应
   */
  // 查询
  getReaction(params) {
    return request('/reaction/v1/reactions/easyui', { params });
  },

  /**
   * 反应排版
   */
  // 查询
  getReactioncomposes(params) {
    return request('/reaction/v1/reactioncomposes/easyui', { params });
  },
  // 查询反应板排版详情
  getReactioncomposesDetails(id) {
    return request(`/reaction/v1/reactioncomposes/${id}`);
  },

  /**
   * 结果分析
   */
  // 查询
  getSeqresults(params) {
    return request('/reaction/v1/seqresults/easyui', { params });
  },
};

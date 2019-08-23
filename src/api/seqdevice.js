/*
 * 测序仪
 * https://devapi.sangon.com:8443/api/seqdevice/swagger-ui.html
 */

import request from '@/assets/js/request';

export default {
  // 查询测序仪
  getSeqdevice (params, easyui) {
    return request(`/seqdevice/v1/seqdevices${easyui ? '/easyui' : ''}`, { params });
  },
  // 根据测序仪查询板列表
  getReactioncomposeBySeqdevice (seqdeviceId, params) {
    return request(`/seqdevice/v1/seqdevices/easyui/reactioncompose/${seqdeviceId}`, { params });
  }
};

/*
 * 测序仪
 * https://devapi.sangon.com:8443/api/seqdevice/swagger-ui.html
 */

import request from '@/utils/request';

export default {
  // 查询测序仪
  getSeqdevice(params, easyui) {
    return request(`/seqdevice/v1/seqdevices${easyui ? '/easyui' : ''}`, { params });
  },
  // 新增
  addSeqdevices(data) {
    return request('/seqdevices/v1/seqdevices', { method: 'POST', data });
  },
  // 作废
  cancelSeqdevices(id) {
    return request(`/seqdevices/v1/seqdevices/${id}`, { method: 'DELETE' });
  },
  // 根据测序仪查询板列表
  getReactioncomposeBySeqdevice(seqdeviceId, params) {
    return request(`/seqdevice/v1/seqdevices/easyui/reactioncompose/${seqdeviceId}`, { params });
  },
};

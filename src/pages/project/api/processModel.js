import request from '@/utils/request';

// 2组
let http2 = 'http://192.168.20.12:8360/v1/process';
if (process.env.NODE_ENV !== 'development') {
  http2 = '/v1/process';
}

export default {
  // 流程模型接口
  // 流程模型分页列表
  getProcess(params) {
    return request(`${http2}`, { params });
  },

  // 创建流程模型
  addProcess(data) {
    return request(`${http2}`, {
      method: 'POST',
      data,
    });
  },

  // 创建流程模型
  upgradeProcess(id, data) {
    return request(`${http2}/${id}/upgrade`, {
      method: 'POST',
      data,
    });
  },

  // 修改流程模型
  changeProcess(data) {
    return request(`${http2}`, {
      method: 'PUT',
      data,
    });
  },

  // 删除流程模型
  deleteProcess(id) {
    return request(`${http2}/${id}/deletion`, {
      method: 'PUT',
    });
  },

  // 发布流程模型
  publishment(id) {
    return request(`${http2}/${id}/publishment`, {
      method: 'PUT',
    });
  },

  // 禁用流程模型
  unPublishment(id) {
    return request(`${http2}/${id}/forbiddance`, {
      method: 'PUT',
    });
  },

  // 查询任务模型详细信息
  getProcessDetail(id) {
    return request(`${http2}/${id}`);
  },

  // 根据code和version查询流程模型详细信息
  getProcessChangeVersion(data) {
    return request(`${http2}/${data.code}/${data.version}`);
  },

  // 流程模型编号模糊搜索
  getProcessCodeAndName(data) {
    return request(`${http2}/${data}/search`);
  },

  // 流程模型发布人模糊搜索
  getProcessPublisherCodeAndName(data) {
    return request(`${http2}/publisher/${data}/search`);
  },
};

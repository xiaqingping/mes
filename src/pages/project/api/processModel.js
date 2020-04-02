import request from '@/utils/request';

// 1组
const http1 = 'http://192.168.20.6:8166';

// 2组
const http2 = 'http://192.168.20.12:8360';

export default {
  // 流程模型接口
  // 流程模型分页列表
  getProcess(params) {
    return request(`${http2}/v1/process`, { params });
  },

  // 创建流程模型
  addProcess(data) {
    return request(`${http2}/v1/process`, {
      method: 'POST',
      data,
    });
  },

  // 流程模型编号模糊搜索
  getProcessCodeAndName(data) {
    return request(`${http2}/v1/process/${data}/search`);
  },

  // 流程模型发布人模糊搜索
  getProcessPublisherCodeAndName(data) {
    return request(`${http2}/v1/process/${data}/publisherFuzzySearch`);
  },
};

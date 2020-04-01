import request from '@/utils/request';

// 1组
const http1 = 'http://192.168.20.6:8166';

// 2组
const http2 = 'http://192.168.20.12:8360';

export default {
  // 流程接口
  getProcess(params) {
    return request(`${http2}/v1/process`, { params });
  },
};

import request from '@/utils/request';

// 1组
const http1 = 'http://192.168.20.6:8166';

// 2组
// const http2 = 'http://192.168.20.12:8360';

export default {
  // 项目管理接口
  // 项目管理分页列表
  getProjectManage(params) {
    return request(`${http1}/projects/v1`, { params });
  },

};

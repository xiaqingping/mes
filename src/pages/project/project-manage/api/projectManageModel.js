import request from '@/utils/request';

// 1组
const http1 = 'http://192.168.20.6:8166';

// 2组
// const http2 = 'http://192.168.20.12:8360';

export default {
  // 项目管理接口
  // 项目管理分页列表
  getProjectManage(params) {
    return request(`${http1}/projects/v1/`, { params });
  },

  // 项目管理：项目模糊搜索
  gettProjectManageCodeAndName(params) {
    return request(`${http1}/projects/v1/likeFindByNameOrCode`, { params });
  },

  // 项目管理删除
  deleteProjectManage(id) {
    return request(`${http1}/projects/v1/${id}/deleted`, { method: 'PUT' });
  },

  // 创建项目数据
  addProjects(data) {
    return request(`${http1}/projects/v1/`, {
      method: 'POST',
      data,
    });
  },
};

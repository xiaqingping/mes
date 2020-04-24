import request from '@/utils/request';

// 1组
// const http1 = 'http://192.168.20.27:8166';
// const http1 ='devapi.sangon.com:30443';

// 2组
// const http2 = 'http://192.168.20.12:8360';

// 1组
// let http1 = 'http://192.168.20.27:8166';
let http1 = '';
if (process.env.NODE_ENV !== 'development') {
  http1 = '';
}

// 2组
// let http2 = 'http://192.168.20.12:8360';
let http2 = '/projectmodel';
if (process.env.NODE_ENV !== 'development') {
  http2 = '/projectmodel';
}

export default {
  /**
   * 项目管理
   */
  // 项目管理分页列表
  getProjectManage(params) {
    return request(`${http1}/projects/v1`, { params });
  },

  // 项目管理：项目模糊搜索
  gettProjectManageCodeAndName(data) {
    return request(`${http1}/projects/v1/${data}/search`);
  },

  // 项目管理删除
  deleteProjectManage(id) {
    return request(`${http1}/projects/v1/${id}/deleted`, { method: 'PUT' });
  },

  // 创建项目数据
  addProjects(data) {
    return request(`${http1}/projects/v1`, { method: 'POST', data });
  },

  // 修改项目数据
  updateProjects(data) {
    return request(`${http1}/projects/v1`, { method: 'PUT', data });
  },

  // 修改项目状态
  updateProjectStatus(data) {
    return request(`${http1}/projects/v1/${data.id}/status?status=${data.status}`, {
      method: 'PUT',
    });
  },

  // 项目管理流程列表新增
  addProjectsProcess(data) {
    return request(`${http1}/projects/v1/processes`, { method: 'POST', data });
  },

  /**
   * 模型管理
   */
  // 流程模型分页列表
  getProcess(params) {
    return request(`${http2}/v1/process`, { params });
  },

  // 根据code和version查询流程模型详细信息
  getProcessChangeVersion(data) {
    return request(`${http2}/v1/process/${data.code}/${data.version}`);
  },

  // 添加流程页面删除
  deleteAddProcess(id) {
    return request(`${http2}/v1/process/${id}/deletion`, { method: 'PUT' });
  },

  // 查询流程模型的参数列表
  getProcessParam(params) {
    return request(`${http2}/v1/process/${params}/params`);
  },
};

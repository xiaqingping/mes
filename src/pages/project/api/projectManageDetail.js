import request from '@/utils/request';

// 1组
let http1 = 'http://192.168.20.6:8166';

// 2组
const http2 = 'http://192.168.20.12:8360';
if (process.env.NODE_ENV !== 'development') {
  http1 = '/xu';
}

export default {
  /**
   * 项目管理
   */

  // 查询项目基础信息及流程列表
  getProjectProcess(params) {
    return request(`${http1}/projects/v1/${params}`);
  },

  // 查询任务列表
  getProjectTask(params) {
    return request(`${http1}/projects/v1/tasks`, { params });
  },

  // 项目流程暂停运行
  pauseProcessesProcess(data) {
    return request(`${http1}/projects/v1/processes/${data}/pause`, { method: 'PUT' });
  },

  // 项目流程开始运行
  startProcessesProcess(data) {
    return request(`${http1}/projects/v1/processes/${data}/start`, { method: 'PUT' });
  },

  // 查询成员列表
  getProjectMember(params) {
    return request(`${http1}/projects/v1/member`, { params });
  },

  // 保存流程名称和描述
  saveProcessInfor(data) {
    return request(`${http1}/projects/v1/processes`, { method: 'PUT', data });
  },

  // 保存流程名称和描述
  deleteProcessInfor(data) {
    return request(`${http1}/projects/v1/processes/${data}/deleted`, { method: 'PUT' });
  },

  /**
   * 流程模型
   */
  // 查询流程模型的参数列表
  getProcessParam(params) {
    return request(`${http2}/v1/process/${params}/params`);
  },

  /**
   * 任务模型
   */
  // 查询任务模型参数列表
  getTaskParam(params) {
    return request(`${http2}/v1/task/${params}/params`);
  },
};

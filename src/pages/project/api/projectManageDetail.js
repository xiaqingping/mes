import request from '@/utils/request';

let http1 = 'http://192.168.20.6:8166';
if (process.env.NODE_ENV !== 'development') {
  http1 = '';
}

let http2 = 'http://192.168.20.12:8360';
if (process.env.NODE_ENV !== 'development') {
  http2 = '/projectmodel';
}

export default {
  /**
   * 项目管理
   */

  // 查询项目基础信息及流程列表
  getProjectProcess(params) {
    return request(`${http1}/projects/v1/${params}`);
  },

  // 查询流程参数值
  getProcessParamValue(params) {
    return request(`${http1}/projects/v1/processes/${params}/parameter`);
  },

  // 查询任务列表
  getProjectTask(params) {
    return request(`${http1}/projects/v1/tasks`, { params });
  },

  // 查询成员列表
  getProjectMember(params) {
    return request(`${http1}/projects/v1/member`, { params });
  },

  // 保存流程名称和描述
  saveProcessInfor(data) {
    return request(`${http1}/projects/v1/processes`, { method: 'PUT', data });
  },

  // 删除流程
  deleteProjectProcess(data) {
    return request(`${http1}/projects/v1/processes/${data}/deleted`, { method: 'PUT' });
  },

  // 项目流程暂停运行
  pauseProcessesProcess(data) {
    return request(`${http1}/projects/v1/processes/${data}/pause`, { method: 'PUT' });
  },

  // 项目流程开始运行
  startProcessesProcess(data) {
    return request(`${http1}/projects/v1/processes/${data}/start`, { method: 'PUT' });
  },

  // 修改成员权限
  updateMemberJurisdiction(data) {
    return request(`${http1}/projects/v1/member/${data.id}/jurisdiction`, { method: 'PUT' });
  },

  // 删除项目成员
  deleteMember(data) {
    return request(`${http1}/projects/v1/member/${data}/deleted`, { method: 'PUT' });
  },

  // 任务执行记录参数查询
  getExecRecordParam(data) {
    return request(`${http1}/projects/v1/tasks/execRecord/${data}/param`);
  },

  // 任务执行记录开始运行
  startExecRecord(data) {
    return request(`${http1}/projects/v1/tasks/execRecord/${data}/start`, { method: 'PUT' });
  },

  // 任务执行记录暂停运行
  pauseExecRecord(data) {
    return request(`${http1}/projects/v1/tasks/execRecord/${data}/pause`, { method: 'PUT' });
  },

  /**
   * 流程模型
   */
  // 查询流程模型的参数列表
  getProcessParam(params) {
    return request(`${http2}/v1/process/${params}/params`);
  },

  // 根据流程ID查询流程进度接口
  getProcessesProgress(params) {
    return request(`${http2}/projects/v1/processes/progress`, { params });
  },

  /**
   * 任务模型
   */
  // 查询任务模型参数列表
  getTaskParam(params) {
    return request(`${http2}/v1/task/${params}/params`);
  },
};

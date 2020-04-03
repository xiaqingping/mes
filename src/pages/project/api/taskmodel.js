import request from '@/utils/request';

const http = 'http://192.168.20.12:8360';
export default {
  // 任务模型模糊搜索
  searchTaskModel(params) {
    return request(`${http}/v1/task/${params}/search`);
  },

  // 查询发布人
  searchPublisherName(params) {
    return request(`${http}/v1/task/publisher/${params}/search`);
  },
  // 获取任务列表
  getTaskModels(params) {
    return request(`${http}/v1/task/task`, {
      params,
    });
  },

  // 前置任务模板列表
  getPreTasks(id) {
    return request(`${http}/v1/task/${id}/preTasks`);
  },

  // 任务模型编号模糊搜索
  getTaskNameAndCode(data) {
    return request(`${http}/v1/task/${data}/search`);
  },

  // 查询出所有的前置任务，包括前置任务的前置任务
  getAllPreTasks(id) {
    return request(`${http}/v1/task/${id}/allPreTasks`);
  },

  // 获取后置列表
  getPostTasks(id) {
    return request(`${http}/v1/task/${id}/postTasks`);
  },

  // 获取任务模型详细信息
  getTaskModelDetail(id) {
    return request(`${http}/v1/task/${id}`);
  },

  // 新建模型
  createTaskModel(data) {
    return request(`${http}/v1/task`, {
      method: 'POST',
      data
    });
  },

  // 获取某项任务的详细信息---现在获取参数列表
  getArgumentList(id) {
    return request(`${http}/v1/task/${id}`);
  }
};

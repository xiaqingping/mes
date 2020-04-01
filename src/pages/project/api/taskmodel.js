import request from '@/utils/request';

const http = "http://192.168.20.12:8360/"
export default {

  // 任务模型模糊搜索
  searchTaskModel(params) {
    return request(`${http}v1/task/${params}/codeFuzzySearch`);
  },


  // 查询发布人
  searchPublisherName(params) {
    return request(`${http}v1/task/${params}/publisherFuzzySearch`);
  },
  // 前置参数列表
  getOwnTaskModel(params) {
    return request(`${http}v1/task/${params}/publisherFuzzySearch`);
  }

  // // 查询利润中心主数据
  // getProfitCenters() {
  //   return request('/profitCenters/v1');
  // },
};

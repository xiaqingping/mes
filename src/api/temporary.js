// 临时接口
import request from '@/utils/request';

export default {
  /* 查询销售分析
  type  网点是 office, 大区是region, 销售员是saler
  */
  getSalesAnalysis(params, type) {
    return request(`/dataanalysis/salesAnalysis/v1/${type}`, {
      params,
    });
  },

  // 查询利润中心+公司代码数据列表
  getProfitCenterCompany() {
    return request('/profitCenterCompany/v1');
  },

  // 查询利润中心主数据
  getProfitCenters() {
    return request('/profitCenters/v1');
  },
};

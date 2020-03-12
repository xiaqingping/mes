// 临时接口
import request from '@/utils/request';

export default {
  // 网点查询销售分析
  getSalesAnalysisOffice(params) {
    return request('/dataanalysis/v1/salesAnalysis/office', {
      params,
    });
  },

  // 大区查询销售分析
  getSalesAnalysisRegion(params) {
    return request('/dataanalysis/v1/salesAnalysis/region', {
      params,
    });
  },

  // 销售员查询销售分析
  getSalesAnalysisSaler(params) {
    return request('/dataanalysis/v1/salesAnalysis/saler', {
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

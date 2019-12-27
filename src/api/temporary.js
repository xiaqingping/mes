// 临时接口
import request from '@/utils/request';

export default {
  /** ****************************** 用户 *********************************** */
  // 查询
  getSalesAnalysisOffice(params) {
    return request('http://192.168.19.71:8550/v1/salesAnalysis/office', { params });
  },

  getProfitCenterCompany() {
    return request('http://192.168.20.43:8001/profitCenterCompany/v1');
  },

  getProfitCenters() {
    return request('http://192.168.20.43:8001/profitCenters/v1');
  },

  getSalesAnalysisRegion(params) {
    return request('http://192.168.19.71:8550/v1/salesAnalysis/region', { params });
  },


};

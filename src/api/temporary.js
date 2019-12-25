// 临时接口
import request from '@/utils/request';

export default {
  /** ****************************** 用户 *********************************** */
  // 查询
  getXXX(params) {
    return request('http://192.168.20.43:8550/v1/salesAnalysis/region', { params });
  },
};

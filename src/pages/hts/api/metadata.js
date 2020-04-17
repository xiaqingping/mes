import request from '@/utils/request';

// 元数据分析
const http = 'http://192.168.20.6:8167';


export default {
  // 查询元数据分析列表
  getMetadatas(params) {
    return request(`${http}/metadatas/v1/analysisRecords`, { params });
  },

  // 查询元数据原始参数
  getMetadataOriginalParam(params) {
    return request(`${http}/metadatas/v1/analysisRecords/${params}/originalParam`);
  },

  // 查询元数据参数
  getMetadataAnalysisParam(params) {
    return request(`${http}/metadatas/v1/analysisRecords/${params}/analysisParam`);
  },
}

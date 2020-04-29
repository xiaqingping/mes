import request from '@/utils/request';

// 2组
let http2 = '/ngssamples';
if (process.env.NODE_ENV !== 'development') {
  http2 = '/ngssamples';
}

export default {
  // 样品模糊搜索
  getSampleCodeAndName(data) {
    return request(`${http2}/v1/${data}/search`);
  },

  // 样品列表(分页)
  getSample(params) {
    return request(`${http2}/v1/`, {
      params,
    });
  },

  // 样品保存
  addSample(data) {
    return request(`${http2}/v1/`, {
      method: 'POST',
      data,
    });
  },

  // 样品详细页
  getSampleDetail(id) {
    return request(`${http2}/v1/${id}`);
  },

  // 解析序列文件返回样品详细信息
  getSequenceFileAnalysis(data) {
    return request(`${http2}/v1/sequenceFile/analysis`, {
      method: 'POST',
      data,
    });
  },

  // 上传图片
  UploadFiles(uploadUrl, params) {
    return request(uploadUrl, {
      method: 'POST',
      ...params,
    });
  },
};

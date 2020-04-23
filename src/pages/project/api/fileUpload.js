/*
 * 解析excel
 * https://devapi.sangon.com:30443/api/fileprocess/swagger-ui.html
 */

import request from '@/utils/request';

export default {
  // 解析EXCEL数据返回页面
  getFileProcessExcels(data) {
    return request('/fileProcess/v1/excels', {
      method: 'POST',
      data,
    });
  },

  // 解析csv数据返回页面
  getFileProcessCsvs(data) {
    return request('/fileProcess/v1/csvs', {
      method: 'POST',
      data,
    });
  },
};

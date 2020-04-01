/*
 * 文件服务
 * https://devapi.sangon.com:8443/api/disk/swagger-ui.html
 */

import request, { baseURL } from '@/utils/request';

const sourceKeyList = [
  // 采购管理
  'project_manage', // 项目管理
  'project_task_model', // 项目任务模型
  'project_process_model', // 项目流程模型
];

/**
 * 验证 sourceKey 是否定义，没有定义 sourceKey 的无法直接使用
 * @param {String} sourceKey
 */
function verifySourceKey(sourceKey) {
  if (sourceKeyList.indexOf(sourceKey) === -1) {
    console.log(`sourceKey=${sourceKey}未定义，无法使用`);
    return false;
  }
  return true;
}

export default {
  // 查询文件
  getFiles(params) {
    return request('/zuul/api/disk/v1/files', { params });
  },
  // 删除文件
  deleteFiles(id) {
    return request(`/zuul/api/disk/v1/files/${id}`, { method: 'DELETE' });
  },
  // 复制文件
  copyFiles(data) {
    if (!verifySourceKey(data.sourceKey)) return false;
    return request('/zuul/api/disk/v1/files/copy', { method: 'POST', data });
  },
  // 单个下载文件
  downloadFiles(id, params) {
    if (params && params.view) {
      const { token } = localStorage;
      return `${baseURL}/disk/v1/files/download/${id}?Authorization=${token}&view=true`;
    }
    return request(`/zuul/api/disk/v1/files/download/${id}`, { params });
  },
  // 批量上传文件
  uploadMoreFiles(sourceKey, sourceCode) {
    if (!verifySourceKey(sourceKey)) return false;
    const { origin } = new URL(baseURL);
    return `${origin}/zuul/api/disk/v1/files/upload_more/${sourceKey}/${sourceCode}`;
  },
  // 单个上传文件
  uploadFiles(sourceKey, sourceCode) {
    if (!verifySourceKey(sourceKey)) return false;
    const { origin } = new URL(baseURL);
    return `${origin}/zuul/api/disk/v1/files/upload/${sourceKey}/${sourceCode}`;
  },
};

/*
 * 文件服务
 * https://devapi.sangon.com:8443/api/disk/swagger-ui.html
 */

import request, { baseURL } from '@/utils/request';

const sourceKeyList = [
  // 采购管理
  'purchase_order', // 采购订单
  // 业务伙伴
  'bp_organization_certification', // 组织认证资料提交
  'bp_pi_certification', // PI认证资料提交
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
    return request('/zuul/api/disk/v1/files/copy', { method: 'POST', data });
  },
  // 单个下载文件
  downloadFiles(id, params) {
    if (params && params.view) return `${baseURL}/disk/v1/files/download/${id}?Authorization=${localStorage.token}&view=true`;
    return request(`/zuul/api/disk/v1/files/download/${id}`, { params });
  },
  // 批量上传文件
  uploadMoreFiles(sourceKey, sourceCode) {
    if (!verifySourceKey(sourceKey)) return false;
    return `${new URL(baseURL).origin}/zuul/api/disk/v1/files/upload_more/${sourceKey}/${sourceCode}`;
  },
  // 单个上传文件
  uploadFiles(sourceKey, sourceCode) {
    if (!verifySourceKey(sourceKey)) return false;
    return `${new URL(baseURL).origin}/zuul/api/disk/v1/files/upload/${sourceKey}/${sourceCode}`;
  },
};

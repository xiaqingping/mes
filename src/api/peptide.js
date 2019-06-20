/*
 *多肽
 * http://192.168.19.71:8289/swagger-ui.html    peptideorder
 * http://192.168.19.71:8288/swagger-ui.html   peptide-base
 */

import request from '../assets/js/request';

export default {
  /** ****************************** 多肽订单 ************************************/
  // 获取订单列表
  getOrder (params) {
    return request(`/peptideorder/v1/orders/easyui`, { params });
  },

  /** ****************************** 多肽纯度 ************************************/
  // 获取纯度(全部)
  getPurityAll (params) {
    return request(`/peptide-base/v1/puritys`, { params });
  },

  // 获取纯度列表（分页获取）
  getPurity (params) {
    return request(`/peptide-base/v1/puritys/easyui`, { params });
  },

  // 创建纯度
  insertPurity (params) {
    return request(`/peptide-base/v1/puritys`, { method: 'POST', data: params });
  },

  // 恢复纯度
  resumePurity (params) {
    return request(`/peptide-base/v1/puritys/restore/${params}`, { method: 'POST' });
  },

  // 删除纯度
  deletePurity (params) {
    return request(`/peptide-base/v1/puritys/${params}`, { method: 'DELETE' });
  },

  /** ****************************** 多肽合成产品 ************************************/
  // 获取合成产品
  getProduct (params) {
    return request(`/peptide-base/v1/synthesisProducts/easyui`, { params });
  },

  // 创建氨基酸
  insertProduct (params) {
    return request(`/peptide-base/v1/synthesisProducts`, { method: 'POST', data: params });
  },

  // 恢复合成产品
  resumeProduct (params) {
    return request(`/peptide-base/v1/synthesisProducts/restore/${params}`, { method: 'POST' });
  },

  // 删除合成产品
  deleteProduct (params) {
    return request(`/peptide-base/v1/synthesisProducts/${params}`, { method: 'DELETE' });
  },

  /** ****************************** 多肽氨基酸 ************************************/
  // 获取氨基酸
  getAminoAcid (params) {
    return request(`/peptide-base/v1/aminoAcid/easyui`, { params });
  },

  // 创建氨基酸
  insertAminoAcid (params) {
    return request(`/peptide-base/v1/aminoAcid`, { method: 'POST', data: params });
  },

  // 获取氨基酸(全部)
  getAminoAcidAll (params) {
    return request(`/peptide-base/v1/aminoAcid/easyui`, { params });
  },

  // 恢复氨基酸
  resumeAminoAcid (params) {
    return request(`/peptide-base/v1/aminoAcid/restore/${params}`, { method: 'POST' });
  },

  // 删除氨基酸
  deleteAminoAcid (params) {
    return request(`/peptide-base/v1/aminoAcid/${params}`, { method: 'DELETE' });
  },

  /** ****************************** 多肽修饰 ********************************/
  // 获取修饰
  getModifications (params) {
    return request(`/peptide-base/v1/modifications/easyui`, { params });
  },

  // 创建修饰
  insertModifications (params) {
    return request(`/peptide-base/v1/modifications`, { method: 'POST', data: params });
  },

  // 恢复修饰
  resumeModifications (params) {
    return request(`/peptide-base/v1/modifications/restore/${params}`, { method: 'POST' });
  },

  // 删除修饰
  deleteModifications (params) {
    return request(`/peptide-base/v1/modifications/${params}`, { method: 'DELETE' });
  },

  /** ****************************** 多肽修饰类别 ********************************/
  // 获取修饰类别（全部）
  getModificationTypesAll (params) {
    return request(`/peptide-base/v1/modificationTypes`, { params });
  },

  // 获取修饰类别（分页获取）
  getModificationTypes (params) {
    return request(`/peptide-base/v1/modificationTypes/easyui`, { params });
  },

  // 创建修饰类别
  insertModificationTypes (params) {
    return request(`/peptide-base/v1/modificationTypes`, { method: 'POST', data: params });
  },

  // 恢复修饰类别
  resumeModificationTypes (params) {
    return request(`/peptide-base/v1/modificationTypes/restore/${params}`, { method: 'POST' });
  },

  // 删除修饰类别
  deleteModificationTypes (params) {
    return request(`/peptide-base/v1/modificationTypes/${params}`, { method: 'DELETE' });
  },

  /** ****************************** 多肽修饰产品 ********************************/
  // 获取修饰产品（分页获取）
  getModificationProducts (params) {
    return request(`/peptide-base/v1/modificationProducts/easyui`, { params });
  },

  // 创建修饰产品
  insertModificationProducts (params) {
    return request(`/peptide-base/v1/modificationProducts`, { method: 'POST', data: params });
  },

  // 恢复修饰产品
  resumeModificationProducts (params) {
    return request(`/peptide-base/v1/modificationProducts/restore/${params}`, { method: 'POST' });
  },

  // 删除修饰产品
  deleteModificationProducts (params) {
    return request(`/peptide-base/v1/modificationProducts/${params}`, { method: 'DELETE' });
  },

  /** ****************************** 适用氨基酸 ************************************/
  // 保存适用氨基酸
  insertSuitableAminoAcids (params) {
    return request(`/peptide-base/v1/suitableAminoAcids`, { method: 'POST', data: params });
  },

  // 恢复适用氨基酸
  resumeSuitableAminoAcids (params) {
    return request(`/peptide-base/v1/suitableAminoAcids/restore/${params}`, { method: 'POST' });
  },

  // 删除适用氨基酸
  deleteSuitableAminoAcids (params) {
    return request(`/peptide-base/v1/suitableAminoAcids/${params}`, { method: 'DELETE' });
  },

  /** ****************************** 多肽二硫键产品 ************************************/
  // 获取二硫键产品（分页获取）
  getdisulfideBondProducts (params) {
    return request(`/peptide-base/v1/disulfideBondProducts/easyui`, { params });
  },

  // 创建二硫键产品
  insertdisulfideBondProducts (params) {
    return request(`/peptide-base/v1/disulfideBondProducts`, { method: 'POST', data: params });
  },

  // 恢复二硫键产品
  resumedisulfideBondProducts (params) {
    return request(`/peptide-base/v1/disulfideBondProducts/restore/${params}`, { method: 'POST' });
  },

  // 删除二硫键产品
  deletedisulfideBondProducts (params) {
    return request(`/peptide-base/v1/disulfideBondProducts/${params}`, { method: 'DELETE' });
  },

  /** ****************************** 获取产品 ************************************/
  // 获取产品
  getProductList (params) {
    return request(`/basic/v1/products`, { params });
  }
};

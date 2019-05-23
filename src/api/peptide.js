/*
 *多肽
 * http://192.168.19.71:8289/swagger-ui.html    peptideorder
 * http://192.168.19.71:8288/swagger-ui.html   peptide-base
 */

import request from '../assets/js/request';

export default {
  /******************************** 多肽订单 ************************************/
  // 获取订单列表
  getOrder(params) {
    return request(`/peptideorder/v1/orders/easyui`, {params});
  },


  /******************************** 多肽纯度 ************************************/
  //获取纯度(全部)
  getPurityAll() {
    return request(`/peptide-base/v1/puritys`);
  },

  //获取纯度列表（分页获取）
  getPurity(params) {
    return request(`/peptide-base/v1/puritys/easyui`, {params});
  },

  //恢复纯度
  resumePurity(params) {
    return request(`/peptide-base/v1/puritys/restore/${params}`, {method: 'POST'})
  },

  //删除纯度
  deletePurity(params) {
    return request(`/peptide-base/v1/puritys/${params}`, {method: 'DELETE'})
  },


  /******************************** 多肽合成产品 ************************************/
  //获取合成产品
  getProduct(params) {
    return request(`/peptide-base/v1/synthesisProducts/easyui`, {params})
  },

  //恢复合成产品
  resumeProduct(params) {
    return request(`/peptide-base/v1/synthesisProducts/restore/${params}`, {method: 'POST'})
  },

  //删除合成产品
  deleteProduct(params) {
    return request(`/peptide-base/v1/synthesisProducts/${params}`, {method: 'DELETE'})
  },


  /******************************** 多肽氨基酸 ************************************/
  //获取氨基酸
  getAminoAcid(params) {
    return request(`/peptide-base/v1/aminoAcid/easyui`, {params})
  },

  //恢复氨基酸
  resumeAminoAcid(params) {
    return request(`/peptide-base/v1/aminoAcid/restore/${params}`, {method: 'POST'})
  },

  //删除氨基酸
  deleteAminoAcid(params) {
    return request(`/peptide-base/v1/aminoAcid/${params}`, {method: 'DELETE'})
  },


  /******************************** 多肽修饰 ********************************/
  //获取修饰
  getModifications(params) {
    return request(`/peptide-base/v1/modifications/easyui`, {params})
  },

  //恢复修饰
  getModificationsResume(params) {
    return request(`/peptide-base/v1/modifications/restore/${params}`, {method: 'POST'})
  },

  //删除修饰
  getModificationsDelete(params) {
    return request(`/peptide-base/v1/modifications/${params}`, {method: 'DELETE'})
  },


  /******************************** 多肽修饰类别 ********************************/
  //获取修饰类别（全部）
  getModificationTypesAll() {
    return request(`/peptide-base/v1/modificationTypes`)
  },

  //获取修饰类别（分页获取）
  getModificationTypes(params) {
    return request(`/peptide-base/v1/modificationTypes/easyui`, {params})
  },

  //恢复修饰类别
  resumeModifications(params) {
    return request(`/peptide-base/v1/modificationTypes/restore/${params}`, {method: 'POST'})
  },

  //删除修饰类别
  deleteModifications(params) {
    return request(`/peptide-base/v1/modificationTypes/${params}`, {method: 'DELETE'})
  },


  /******************************** 多肽修饰产品 ********************************/
  //获取修饰产品（分页获取）
  getModificationProducts(params) {
    return request(`/peptide-base/v1/modificationProducts/easyui`, {params})
  },

  //恢复修饰产品
  resumeModificationProducts(params) {
    return request(`/peptide-base/v1/modificationProducts/restore/${params}`, {method: 'POST'})
  },

  //删除修饰产品
  deleteModificationProducts(params) {
    return request(`/peptide-base/v1/modificationProducts/${params}`, {method: 'DELETE'})
  },

  /******************************** 多肽二硫键产品 ************************************/
  //获取二硫键产品（分页获取）
  getdisulfideBondProducts(params) {
    return request(`/peptide-base/v1/disulfideBondProducts/easyui`, {params})
  },

  //恢复二硫键产品
  resumedisulfideBondProducts(params) {
    return request(`/peptide-base/v1/disulfideBondProducts/restore/${params}`, {method: 'POST'})
  },

  //删除二硫键产品
  deletedisulfideBondProducts(params) {
    return request(`/peptide-base/v1/disulfideBondProducts/${params}`, {method: 'DELETE'})
  },
};

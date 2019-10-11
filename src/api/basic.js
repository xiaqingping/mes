/*
 * 基础服务
 * https://devapi.sangon.com:8443/api/basic/swagger-ui.html
 */

import request from '@/utils/request';

export default {
  // 查询工厂列表
  getFactorys() {
    return request('/basic/v1/factorys');
  },
  // 查询开票类型
  getInvtypes() {
    return request('/basic/v1/invtypes');
  },
  // 查询币种列表
  currencys() {
    return request('/basic/v1/currencys');
  },
  // 查询仓库
  getStorages() {
    return request('/basic/v1/storages');
  },
  // 查询网点列表
  getOffices() {
    return request('/basic/v1/offices');
  },
  // 查询付款方式
  getPaymethods() {
    return request('/basic/v1/paymethods');
  },
  // 查询付款条件
  getPayterms() {
    return request('/basic/v1/payterms');
  },
  // 查询大区
  getRegions() {
    return request('/basic/v1/regions');
  },
  // 查询订货人
  getContacts() {
    return request('/basic/v1/contacts');
  },
  // 查询客户
  getCustomers() {
    return request('/basic/v1/customers');
  },
  // 查询负责人
  getSubcustomer() {
    return request('/basic/v1/subcustomer');
  },
  // 查询产品
  getProductList(params) {
    return request('/basic/v1/products', { params });
  },
  // 查询销售范围
  getSalesRange() {
    return request('/basic/v1/salesranges');
  },
  // 查询采购申请
  getPurReqList(params) {
    return request('/basic/v1/purchase_request/easyui', { params });
  },
};

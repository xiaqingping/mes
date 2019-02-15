/* eslint-disable func-names */ // TODO: 不写方法名会报错
/**
 * 产品服务
 */
import qs from 'qs';
import request from '@/utils/request';

const product = {};

/**
 * 产品类别
 */
// 查询产品类别
product.getCategorys = function(params) {
  return request(`/product/v1/product/categorys/easyui?${qs.stringify(params)}`);
};

// 保存产品类别
product.saveCategorys = function(data) {
  return request(`/product/v1/product/categorys`, {
    method: 'POST',
    data,
  });
};

// 恢复产品类别
product.restoreCategorys = function(id) {
  return request(`/product/v1/product/categorys/restore/${id}`, {
    method: 'PUT',
  });
};

// 删除产品类别
product.deleteCategorys = function(id) {
  return request(`/product/v1/product/categorys/${id}`, {
    method: 'DELETE',
  });
};

/**
 * 产品扩展信息
 */
// 查询产品扩展信息
product.getExtends = function(params) {
  return request(`/product/v1/product/extends?${qs.stringify(params)}`);
};

// 保存产品扩展信息
product.saveExtends = function(data) {
  return request(`/product/v1/product/extends`, {
    method: 'POST',
    data,
  });
};

// 恢复产品扩展信息
product.restoreExtends = function(id) {
  return request(`/product/v1/product/extends/restore/${id}`, {
    method: 'PUT',
  });
};

// 删除产品扩展信息
product.deleteExtends = function(id) {
  return request(`/product/v1/product/extends/${id}`, {
    method: 'DELETE',
  });
};

/**
 * 产品促销信息
 */
// 查询产品促销信息
product.getPromotions = function(params) {
  return request(`/product/v1/product/promotions?${qs.stringify(params)}`);
};

// 保存产品促销信息
product.savePromotions = function(data) {
  return request(`/product/v1/product/promotions`, {
    method: 'POST',
    data,
  });
};

// 恢复产品促销信息
product.restorePromotions = function(id) {
  return request(`/product/v1/product/promotions/restore/${id}`, {
    method: 'PUT',
  });
};

// 删除产品促销信息
product.deletePromotions = function(id) {
  return request(`/product/v1/product/promotions/${id}`, {
    method: 'DELETE',
  });
};

export default product;

/* eslint-disable func-names */ // TODO: 不写方法名会报错
/**
 * 积分服务
 */
// import qs from 'qs';
import request from '@/utils/request';

const integral = {};

/**
 * 积分
 */
// 查询积分
integral.getIntegral = function() {
  return request('/integral/v1/integrals/easyui');
};

/**
 * 积分订单
 */
// 查询积分订单
integral.getIntegralOrder = function() {
  return request('/integral/v1/integral_orders/easyui');
};

/**
 * 积分产品
 */
// 查询积分产品
integral.getIntegralProduct = function() {
  return request('/integral/v1/integral_products/easyui');
};

/**
 * 积分产品类型
 */
// 查询积分产品
integral.getIntegralProductType = function() {
  return request('/integral/v1/integral_product_types/easyui');
};

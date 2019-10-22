import { parse } from 'querystring';
/* eslint no-useless-escape:0 import/prefer-default-export:0 */

const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
export const isUrl = path => reg.test(path);
export const isAntDesignPro = () => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }

  return window.location.hostname === 'preview.pro.ant.design';
}; // 给官方演示站点用，用于关闭真实开发环境不需要使用的特性

export const isAntDesignProOrDev = () => {
  const { NODE_ENV } = process.env;

  if (NODE_ENV === 'development') {
    return true;
  }

  return isAntDesignPro();
};
export const getPageQuery = () => parse(window.location.href.split('?')[1]);

/**
 * 数据格式化
 * @param {Array} arr 需要遍历的数组
 * @param {any} value 输入数据
 * @param {string} key1 查找字段（默认id）
 * @param {string} key2 输出字段（默认name）
 */
export const formatter = (arr, value, key1, key2) => {
  if (!arr) return value;
  if (!(arr instanceof Array)) return value;

  const k1 = key1 || 'id';
  const k2 = key2 || 'name';

  for (let i = 0; i < arr.length; i++) {
      // eslint-disable-next-line eqeqeq
      if (arr[i][k1] == value) {
          return arr[i][k2];
      }
  }
  return value;
};

/**
 * 验证表单所有字段
 *   正确返回 [true, data]
 *   错误返回 [false, error]
 */
export const validateForm = form =>
  form.validateFields()
    .then(data => [true, data])
    .catch(error => [false, error]);

/**
 * 获取表单的值（不验证）
 * @param {*} form
 */
export const getFormValue = form => form.getFieldsValue();

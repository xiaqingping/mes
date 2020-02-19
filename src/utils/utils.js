import _ from 'lodash';
import { parse } from 'querystring';
import pathRegexp from 'path-to-regexp';
import { formatMessage } from 'umi/locale';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
export const isUrl = path => reg.test(path);

export const getPageQuery = () => parse(window.location.href.split('?')[1]);
/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */

export const getAuthorityFromRouter = (router = [], pathname) => {
  const authority = router.find(
    ({ routes, path = '/' }) =>
      (path && pathRegexp(path).exec(pathname)) ||
      (routes && getAuthorityFromRouter(routes, pathname)),
  );
  if (authority) return authority;
  return undefined;
};
export const getRouteAuthority = (path, routeData) => {
  let authorities;
  routeData.forEach(route => {
    // match prefix
    if (pathRegexp(`${route.path}/(.*)`).test(`${path}/`)) {
      if (route.authority) {
        authorities = route.authority;
      } // exact match

      if (route.path === path) {
        authorities = route.authority || authorities;
      } // get children authority recursively

      if (route.routes) {
        authorities = getRouteAuthority(path, route.routes) || authorities;
      }
    }
  });
  return authorities;
};

/**
 * 下拉列表数据格式化，为列表中的数据添加 text 属性。 text = code - name
 * @param {Array} list
 * @param {String} key1
 * @param {String} key2
 */
export const formatSelectData = (list, key1, key2) => {
  if (!list || list.length === 0) return [];
  return list.map(e => {
    const code = e[key1 || 'code'];
    const name = e[key2 || 'name'];
    return {
      ...e,
      text: `${code} - ${name}`,
    }
  });
};

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
  form
    .validateFields()
    .then(data => [true, data])
    .catch(error => [false, error]);

/**
 * 获取表单的值（不验证）
 * @param {Object}} form
 */
export const getFormValue = form => form.getFieldsValue();

/**
 * 生成UUID
 */
export const guid = () => {
  function S4() {
    // eslint-disable-next-line no-bitwise
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4();
};

/**
 * 深度对比两个对象数组，返回 next 相对与 pre 的（新增、修改、删除）对象
 * @param {Array[Object]} pre 旧的对象数组
 * @param {Array[Object]} next 新的对象数组
 * @param {String} key 新旧数据有相同的key，说明是同一条数据，需要深度对比，字段有无变更
 */
export const diff = (pre, next, key = 'id') => {
  // 新增add 修改update 删除del 相同equal

  // next 有，pre 没有的数据，则为新增数据
  const add = _.differenceWith(next, pre, (n, p) => p[key] === n[key]);

  // 在next中，过滤掉add数据 = 已有数据未修改 + 已有数据修改
  const nextOther = _.differenceWith(next, add, _.isEqual);

  // 在nextOther中，过滤掉pre数据 = 已有数据修改
  const update = _.differenceWith(nextOther, pre, _.isEqual);

  // pre有，next没有，则是删除数据
  const del = pre.filter(
    preItem => !nextOther.some(nextOtherItem => nextOtherItem[key] === preItem[key]),
  );

  return { add, del, update };
};

/**
 * 验证非空字段
 * @param {string} val 需要验证的值
 * @param {string} fieldName 需要验证的字段名
 * @returns {string} 如果验证错误返回错误信息，如果验证正确返回false
 */
export const validateEmpty = (val, fieldName) => {
  if (val.trim() === '') {
    return `${fieldName}不能为空`;
  }
  return false;
};

/**
 * 简化 formatMessage 使用
 * @param {String} id
 */
export const format = id => formatMessage({ id });

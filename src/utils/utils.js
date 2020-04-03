import _ from 'lodash';
import { parse } from 'querystring';
import pathRegexp from 'path-to-regexp';
import { formatMessage } from 'umi/locale';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
// eslint-disable-next-line max-len
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
    };
  });
};

/**
 * 根据 key1 在 arr 中遍历查找 value，并返回匹配数据的 key2
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
 * @param {Object} form
 */
export const validateForm = form =>
  form
    .validateFields()
    .then(data => [true, data])
    .catch(error => [false, error]);

/**
 * 获取表单的值（不验证）
 * @param {Object} form
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
 * 深度对比两个对象数组，返回 next 相对与 prev 的（新增、修改、删除）对象
 * @param {Array[Object]} prev 旧的对象数组
 * @param {Array[Object]} next 新的对象数组
 * @param {String} key 新旧数据有相同的key，说明是同一条数据，需要深度对比，字段有无变更
 */
export const diff = (prev, next, key = 'id') => {
  // 新增add 修改update 删除del 相同equal

  // next 有，prev 没有的数据，则为新增数据
  const add = _.differenceWith(next, prev, (n, p) => p[key] === n[key]);

  // 在next中，过滤掉add数据 = 已有数据未修改 + 已有数据修改
  const nextOther = _.differenceWith(next, add, _.isEqual);

  // 在nextOther中，过滤掉pre数据 = 已有数据修改
  const update = _.differenceWith(nextOther, prev, _.isEqual);

  // prev 有，next没有，则是删除数据
  const del = prev.filter(
    prevItem => !nextOther.some(nextOtherItem => nextOtherItem[key] === prevItem[key]),
  );

  return {
    add,
    del,
    update,
  };
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
export const format = id =>
  formatMessage({
    id,
  });

/**
 * 获取缓存数据
 * @param {String} namespace 全局 Store 命名空间
 * @param {Object} action
 * @param {Object} effects
 * @param {Object} defaultApi 默认请求接口列表
 * @param {Object} customApi 自定义请求接口列表
 */
export function* getCache(namespace, action, effects, defaultApi, customApi) {
  const { payload } = action;
  const { call, put, select } = effects;
  const { type, options } = payload;

  let targetState;

  // 一：如果目标上已经有数据了，则放弃本次请求
  targetState = yield select(state => state[namespace][type]);
  // 类型：数组，检查 length
  if (targetState instanceof Array && targetState.length > 0) return;

  // 二：检查浏览器缓存数据是否有目标数据
  targetState = JSON.parse(sessionStorage.getItem(`${namespace}/${type}`));

  if (!targetState) {
    // 三：确定请求方法
    // example: type = countrys，则 methodName = getCountrys，如果你的接口命名规则与此不同，则需要将你的方法写到 customApi 里
    let method;
    if (customApi[type]) {
      method = customApi[type];
    } else {
      const methodName = `get${type.slice(0, 1).toUpperCase()}${type.slice(1)}`;
      if (!defaultApi[methodName]) {
        console.error(`${namespace} getCache type=${type} 对应的接口不存在`);
        return;
      }
      method = defaultApi[methodName];
    }

    // 四：请求数据
    try {
      targetState = yield call(method, options);
    } catch (error) {
      console.error(`${namespace} getCache type=${type} 接口请求失败`);
    }
  }

  if (targetState) {
    // 五：设置数据
    yield put({
      type: 'setCache',
      payload: {
        type,
        targetState,
      },
    });
  }
}

/**
 * 设置数据缓存
 * @param {String} namespace 全局 Store 命名空间
 * @param {Object} payload { type 缓存目标, targetState 缓存目标数据 }
 * @param {Function} fun 数据处理方法
 */
export const setCache = (namespace, payload, fun) => {
  const { type, targetState } = payload;

  const data = (fun[type] && fun[type](targetState)) || targetState;

  sessionStorage.setItem(`${namespace}/${type}`, JSON.stringify(data));

  return {
    type,
    data,
  };
};

/** 参数说明：
 * 根据长度截取先使用字符串，超长部分追加…
 * str 对象字符串
 * len 目标字节长度
 * 返回值： 处理结果字符串
 */
export const cutString = (str, len) => {
  // length属性读出来的汉字长度为1
  if (!str) return false;
  if (str.length * 2 <= len) {
    return str;
  }
  let strlen = 0;
  let s = '';
  for (let i = 0; i < str.length; i++) {
    s += str.charAt(i);

    if (str.charCodeAt(i) > 128) {
      strlen += 2;

      if (strlen >= len) {
        return `${s.substring(0, s.length - 1)}...`;
      }
    } else {
      strlen += 1;

      if (strlen >= len) {
        return `${s.substring(0, s.length - 2)}...`;
      }
    }
  }
  return s;
};

// 任务模型获取操作列表
export const getOperates = v => {
  let operas = null;
  if (v * 1 === 1) {
    operas = ['发布', '修改', '删除', '查看'];
  } else if (v * 1 === 2) {
    operas = ['禁用', '升级', '查看'];
  } else if (v * 1 === 3) {
    operas = ['发布', '升级', '查看'];
  } else if (v * 1 === 4) {
    operas = ['禁用', '查看'];
  }
  return operas;
};

/**
 * 版本输出
 * @param {String} v 字符串版本号
 */
export const versionFun = v => {
  const version = v.substr(1);
  return [`V${((version * 10 + 1) / 10).toFixed(1)}`, `V${((version * 10 + 10) / 10).toFixed(1)}`];
};

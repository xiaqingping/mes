import axios from 'axios';
import { notification } from 'antd';
// import router from 'umi/router';
import hash from 'hash.js';
import { isAntdPro } from './utils';
import { baseURL, baseUrlConfig } from './baseURL';

const baseUrl = baseURL();

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [option] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, option) {
  const options = {
    expirys: isAntdPro(),
    ...option,
  };
  /**
   * Produce fingerprints based on url and parameters
   * Maybe url has the same parameters
   */
  const fingerprint = url + (options.body ? JSON.stringify(options.body) : '');
  const hashcode = hash
    .sha256()
    .update(fingerprint)
    .digest('hex');

  const defaultOptions = {
    withCredentials: 'true', // 携带cookie
    headers: {
      Authorization: localStorage.Authorization, // 携带Token验证
    },
  };
  const newOptions = { ...defaultOptions, ...options };
  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'DELETE'
  ) {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      };
    }
  }

  const expirys = options.expirys && 60;
  // options.expirys !== false, return the cache,
  if (options.expirys !== false) {
    const cached = sessionStorage.getItem(hashcode);
    const whenCached = sessionStorage.getItem(`${hashcode}:timestamp`);
    if (cached !== null && whenCached !== null) {
      const age = (Date.now() - whenCached) / 1000;
      if (age < expirys) {
        const response = new Response(new Blob([cached]));
        return response.json();
      }
      sessionStorage.removeItem(hashcode);
      sessionStorage.removeItem(`${hashcode}:timestamp`);
    }
  }

  let finalURL = '';
  // 根据 baseURL 和 baseUrlConfig 生成最终的 url
  if (url.indexOf('/api') !== 0) {
    const service = url.split('/')[1];
    if (baseUrlConfig[service]) {
      finalURL = baseUrlConfig[service] + url;
    } else {
      finalURL = baseUrl + url;
    }
  } else {
    finalURL = url;
  }

  return new Promise((resolve, reject) => {
    axios(finalURL, newOptions)
      .then(res => {
        resolve(res.data);
      })
      .catch(error => {
        const { response } = error;
        const { data } = response;

        // 登陆失效，跳转登陆页
        if (data.type === 41 && data.code === 40000) {
          // @HACK
          /* eslint-disable no-underscore-dangle */
          window.g_app._store.dispatch({
            type: 'login/logout',
          });
          return;
        }

        // 解析并显示错误提示
        let errMsg = ['系统异常，请与系统管理员联系！'];
        if (data.message) errMsg = [data.message];
        if (data.details && data.details.length > 0) errMsg = [].concat(errMsg, data.details);

        notification.error({
          message: `请求错误 ${response.status}: ${response.request.responseURL}`,
          description: errMsg.join('，'),
        });

        reject(data);
      });
  });
}

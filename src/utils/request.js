import axios from 'axios';
import { notification } from 'antd';
// import router from 'umi/router';
import apiConfig from './apiConfig';

axios.interceptors.request.use(req => {
  const baseURL = 'https://devapi.sangon.com:8443/api'; // TODO:
  const token = localStorage.Authorization;
  // const user = {};

  // 根据 baseURL 、 apiconfig req.url 得出最终要请求的 url
  const { url } = req;
  if (url.indexOf('/api/') === 0 || url.indexOf('http') === 0) {
    // 什么也不做
  } else {
    const service = url.split('/')[1];
    if (apiConfig[service]) {
      req.url = apiConfig[service] + url;
    } else {
      req.url = baseURL + url;
    }
  }

  // 为所有请求都设置token
  if (token) {
    req.headers.common.Authorization = token;
    // req.headers.common.usercode = user.loginCode;
    // req.headers.common.username = user.name;
  }
  return req;
});

/**
 * 请求数据，返回Promise
 * @param {String} url 请求url
 * @param {Object} options axios请求参数
 * @return {Object}
 */
export default function request(url, options) {
  const defaultOptions = {
    withCredentials: true
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
        ...newOptions.headers
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers
      };
    }
  }

  return new Promise((resolve, reject) => {
    axios(url, newOptions)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
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

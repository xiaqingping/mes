import axios from 'axios';
import { notification } from 'antd';
import { router } from 'umi';

const baseURLMap = {
  dev: 'https://devapi.sangon.com:8443/api',
  test: 'https://testapi.sangon.com:8443/api',
  pre: 'https://preapi.sangon.com/api',
  product: 'https://api.sangon.com/api',
};

const env = process.env.ENV || 'pre';

// 创建 axios 实例
const service = axios.create({
  baseURL: baseURLMap[env],
  timeout: 6000,
});

const err = error => {
  if (error.response) {
    let errMsg = ['系统异常,请与系统管理员联系!'];
    const data = error.response && error.response.data;

    if (data) {
      if (data.message) {
        errMsg = [data.message];
      }
      if (data.details && data.details.length > 0) {
        errMsg = data.details;
      }

      if (data.type === 41 && data.code === 40000) {
        localStorage.removeItem('token');
        router.push(`/user/login?redirect=${window.location.href}`);
      }
    } else {
      errMsg = [errMsg];
    }

    notification.error({
      message: (data && data.desc) || '错误提示',
      description: errMsg.join('，') || '请求错误！',
    });
    return Promise.reject(data);
  }
  return Promise.reject(error.response);
};

// 请求拦截
service.interceptors.request.use(config => {
  // 过滤请求中的无效字段
  // if (config.method === 'get') {
  //   for (const item in config.params) {
  //     if ( config.params[item] === ''
  //       || config.params[item] === undefined
  //       || config.params[item] === null
  //     ) {
  //       delete config.params[item];
  //     }
  //   }
  // } else {
  //   for (const item in config.data) {
  //     if (config.data[item] === null) {
  //       delete config.data[item];
  //     }
  //   }
  // }

  const token = localStorage.getItem('token');
  if (token) {
    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = token;
  }
  return config;
}, err);

// 响应拦截
service.interceptors.response.use(response => response.data, err);

export default service;

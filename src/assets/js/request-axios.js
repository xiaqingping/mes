import Vue from 'vue';
import axios from 'axios';
// import store from '@/store';
import notification from 'ant-design-vue/es/notification';

const baseURLMap = {
  dev: 'https://devapi.sangon.com:8443/api',
  test: 'https://testapi.sangon.com:8443/api',
  pre: 'https://preapi.sangon.com/api',
  product: 'https://api.sangon.com/api'
};

let baseURL = 'https://devapi.sangon.com:8443/api';
/**
 * 接口会根据所设置的环境变量改变，具体请阅读 README.md 文件中的《接口与环境设置》章节，如不设置环境变量，默认都是dev
 */
if (process.env.NODE_ENV === 'development') {
  if (process.env.VUE_APP_BASE_URL_TYPE) baseURL = baseURLMap[process.env.VUE_APP_BASE_URL_TYPE];
} else if (process.env.NODE_ENV === 'production') {
  if (process.env.VUE_APP_BASE_URL_TYPE) baseURL = baseURLMap[process.env.VUE_APP_BASE_URL_TYPE];
}

// 创建 axios 实例
const service = axios.create({
  baseURL,
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
        Vue.ls.remove('TOKEN');
        window.location.reload();
      }
    } else {
      errMsg = [errMsg];
    }

    notification.error({
      message: (data && data.desc) || '错误提示',
      description: errMsg.join('，') || '请求错误！',
    });
  }
  return Promise.reject(error);
};

// 请求拦截
service.interceptors.request.use(config => {
  // 过滤请求中的无效字段
  if (config.method === 'get') {
    // eslint-disable-next-line no-restricted-syntax
    for (const item in config.params) {
      if (config.params[item] === '' || config.params[item] === undefined || config.params[item] === null) {
        delete config.params[item];
      }
    }
  } else {
    // eslint-disable-next-line no-restricted-syntax
    for (const item in config.data) {
      if (config.data[item] === null) {
        delete config.data[item];
      }
    }
  }

  const token = Vue.ls.get('TOKEN');
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
}, err);

// 响应拦截
service.interceptors.response.use(response => response.data, err);

export default service;

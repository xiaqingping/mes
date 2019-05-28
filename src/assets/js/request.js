import Vue from 'vue';
import axios from 'axios';
// import store from '@/store';
import notification from 'ant-design-vue/es/notification';

let baseURL = '';
if (process.env.NODE_ENV === 'development') {
  baseURL = 'https://devapi.sangon.com:8443/api';
  // baseURL = 'https://preapi.sangon.com/api';
} else if (process.env.NODE_ENV === 'production') {
  if (process.env.BASE_URL_TYPE === 'dev') {
    baseURL = 'https://devapi.sangon.com:8443/api';
  } else if (process.env.BASE_URL_TYPE === 'test') {
    baseURL = 'https://testapi.sangon.com:8443/api';
  } else if (process.env.BASE_URL_TYPE === 'produce') {
    baseURL = 'https://api.sangon.com/api';
  } else {
    baseURL = 'https://devapi.sangon.com:8443/api';
  }
}

// 创建 axios 实例
const service = axios.create({
  // baseURL: baseURL, // api base_url
  timeout: 6000 // 请求超时时间
});

const err = (error) => {
  if (error.response) {
    let errMsg = ['系统异常,请与系统管理员联系!'];
    const data = error.response && error.response.data;

    if (data) {
      if (data.message) {
        errMsg = [data.message];
      }
      if (data.details && data.details.length > 0) {
        errMsg = [].concat(errMsg, data.details);
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
      description: errMsg.join('，') || '请求错误！'
    });
  }
  return Promise.reject(error);
};

// 请求拦截
service.interceptors.request.use(config => {
  // 添加 baseURL
  if (config.url.indexOf('/oldapi') !== 0) {
    config.url = baseURL + config.url;
  } else {
    config.url = baseURL + config.url;
    config.url = config.url.replace('/api/oldapi', '');
  }
  const token = Vue.ls.get('TOKEN');
  if (token) {
    config.headers['Authorization'] = token;
  }
  return config;
}, err);

// 响应拦截
service.interceptors.response.use((response) => {
  return response.data;
}, err);

export default service;

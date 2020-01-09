import axios from 'axios';
import { notification } from 'antd';
import { router } from 'umi';
import { formatMessage } from 'umi/locale';

const baseURLMap = {
  dev: 'https://devapi.sangon.com:8443/api',
  test: 'https://testapi.sangon.com:8443/api',
  pre: 'https://preapi.sangon.com/api',
  prod: 'https://api.sangon.com/api',
};

// BASE_API 是 .env 文件中定义的环境变量，如果没有设置过此环境变量，则默认值为pre（具体查看config.js）。
const env = BASE_API;
const baseURL = baseURLMap[env];

// 创建 axios 实例
const service = axios.create({
  baseURL: baseURLMap[env],
  timeout: 60000,
});

const requestErr = data => {
  let errMsg = ['系统异常,请与系统管理员联系!'];

  if (data) {
    if (data.message) {
      errMsg = [data.message];
    }
    if (data.details && data.details.length > 0) {
      errMsg = data.details;
    }

    if (data.type === 41 && data.code === 40000) {
      localStorage.removeItem('token');
      const URL = window.location.href;
      if (URL.indexOf('/user/login') === -1) {
        router.push(`/user/login?redirect=${encodeURIComponent(window.location.href)}`);
      }
    }
  } else {
    errMsg = [errMsg];
  }

  let message = (data && data.desc) || '错误提示';
  let description = errMsg.join('，') || '请求错误！';
  try {
    message = formatMessage({ id: message });
    description = formatMessage({ id: description });
  } catch (error) {
    console.log(`缺少错误消息国际化\nmessage:${message}\ndescription${description}`);
  }

  notification.error({
    message,
    description,
  });
};

const err = error => {
  const { response = {} } = error;
  const { data } = response;
  requestErr(data);
  return Promise.reject(data);
};

// 请求拦截
service.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  // GET请求处理请求参数
  // 去掉首尾空格
  if (config.method === 'get') {
    const { params } = config;
    // eslint-disable-next-line no-restricted-syntax
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        const element = params[key];
        if (typeof element === 'string') {
          config.params[key] = element.trim();
        }
      }
    }
  }
  if (token) {
    config.headers.Authorization = token;

    // FIXME: 开发时代理临时接口（配合webpack proxy 使用）
    if (process.env.NODE_ENV === 'development') {
      if (config.url.indexOf('http://192.168.19.71:8550/') > -1) {
        config.url = config.url.replace('http://192.168.19.71:8550/', '/192.168.19.71:8550/');
        config.baseURL = '/';
      }
      if (config.url.indexOf('http://192.168.19.71:8001/') > -1) {
        config.url = config.url.replace('http://192.168.19.71:8001/', '/192.168.19.71:8001/');
        config.baseURL = '/';
      }
    }
  }

  if (config.url.indexOf('/zuul/api/disk/') > -1) {
    // disk 服务接口在定义时已经有了 /api/ 所以拼接baseURL时，去掉baseURL的 /api/
    config.url = new URL(baseURLMap[env]).origin + config.url;
  }

  return config;
}, err);

// 响应拦截
service.interceptors.response.use(response => response.data, err);

export default service;
export { baseURL, requestErr };

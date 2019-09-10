/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification } from 'antd';
import { router } from 'umi';

const baseURLMap = {
  dev: 'https://devapi.sangon.com:8443/api',
  test: 'https://testapi.sangon.com:8443/api',
  pre: 'https://preapi.sangon.com/api',
  prod: 'https://api.sangon.com/api',
};

const env = process.env.ENV || 'pre';

/**
 * 异常处理程序
 */
const errorHandler = error => {
  const { response } = error;

  if (response && response.status) {
    response.json().then(data => {
      let errMsg = ['系统异常,请与系统管理员联系!'];
      if (data) {
        if (data.message) {
          errMsg = [data.message];
        }
        if (data.details && data.details.length > 0) {
          errMsg = data.details;
        }

        if (data.type === 41 && data.code === 40000) {
          sessionStorage.removeItem('token');
          // TODO:
          // window.location.reload();
          router.push('/user/login');
        }
        notification.error({
          message: (data && data.desc) || '错误提示',
          description: errMsg.join('，') || '请求错误！',
        });
      } else {
        errMsg = [errMsg];
      }
    });
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }

  return response;
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  prefix: baseURLMap[env],
  errorHandler,
  credentials: 'include', // 默认请求是否带上cookie
});

request.interceptors.request.use((url, options) => {
  // eslint-disable-next-line no-param-reassign
  options.headers.Authorization = sessionStorage.getItem('token');
  return ({ url, options });
});

export default request;

import axios from 'axios';

/**
 * 请求数据
 * @param {String} url 请求url
 * @param {Object} options axios请求参数
 * @return {Object}
 */
export default function request(url, options) {
  const defaultOptions = {
    withCredentials: true
  };
  const newOptions = { ...defaultOptions, ...options };
  if (newOptions.method === 'POST' || newOptions.method === 'PUT' || newOptions.method === 'DELETE') {
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
      .then(function(res) {
        resolve(res.data);
      })
      .catch(function(error) {
        let errMsg = '系统异常,请与系统管理员联系!';
        const err = error.response && error.response.data;

        if (err) {
          if (err.message) {
            errMsg = [err.message];
          }
          if (err.details && err.details.length > 0) {
            errMsg = [].concat(errMsg, err.details);
          }
        } else {
          errMsg = [errMsg];
        }

        if (typeof window === 'object' && window.$nuxt) {
          window.$nuxt.$notification.error({
            message: (err && err.desc) || '错误提示',
            description: errMsg.join('<br>') || 'request error!'
          });
        }

        reject(err);
      });
  });
}

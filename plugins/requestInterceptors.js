import axios from 'axios';
import apiConfig from '~/assets/js/apiConfig';

export default () => {
  axios.interceptors.request.use(request => {
    let baseURL = '';
    if (process.env.NODE_ENV === 'development') {
      // baseURL = 'https://devapi.sangon.com:8443/api';
      baseURL = 'https://preapi.sangon.com/api';
    } else if (process.env.NODE_ENV === 'production') {
      baseURL = 'https://api.sangon.com/api';
    }

    // 根据 baseURL 、 apiconfig 、request.url 得出最终要请求的 url
    const url = request.url;
    if (url.indexOf('/api/') === 0 || url.indexOf('http') === 0) {
      // 什么也不做
    } else {
      const service = url.split('/')[1];
      if (apiConfig[service]) {
        request.url = apiConfig[service] + url;
      } else {
        request.url = baseURL + url;
      }
    }

    return request;
  });
};

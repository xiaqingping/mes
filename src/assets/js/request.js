import { extend } from 'umi-request';

const baseURLMap = {
  dev: 'https://devapi.sangon.com:8443/api',
  test: 'https://testapi.sangon.com:8443/api',
  pre: 'https://preapi.sangon.com/api',
  prod: 'https://api.sangon.com/api'
};

const env = process.env.ENV || 'dev';

const request = extend({
  prefix: baseURLMap[env], // prefix
  errorHandler: error => {
    // 集中处理错误
    console.log(error);
  },
});

export default request;

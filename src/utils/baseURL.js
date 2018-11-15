export function baseURL() {
  let url = '';
  if (process.env.NODE_ENV === 'development') {
    url = 'https://devapi.sangon.com:8443/api';
  } else if (process.env.NODE_ENV === 'production') {
    url = 'https://api.sangon.com/api';
  }

  if (window.location.hostname === 'testmes.sangon.com') {
    url = 'https://testapi.sangon.com/api';
  } else if (window.location.hostname === 'uatmes.sangon.com') {
    url = 'https://uatapi.sangon.com/api';
  }

  return url;
}

// 微服务接口配置（替换掉特定微服务的baseURL）
export const baseUrlConfig = {
  user: '',
};

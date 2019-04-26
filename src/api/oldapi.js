/*
 * 旧接口 没有微服务化
 */

import request from '../assets/js/request';

export default {
  // 获取角色
  getRole () {
    return request(`/oldapi/role_getAll`);
  }
};

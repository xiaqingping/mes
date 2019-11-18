/*
 * 区域
 * https://devapi.sangon.com:8443/api/area/swagger-ui.html
 */

import request from '@/utils/request';

export default {
  // 根据parentId查询返回地址区域列表，传0返回第一级（国家）
  byParentIdGetArea (parentId) {
    return request(`/area/v1/area/parent/code/${parentId}`).then(res => res.map(e => {
        let isLeaf = false;
        if (e.level === 5) isLeaf = true;
        return { ...e, isLeaf };
      }));
  },
};

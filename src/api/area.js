/*
 * 区域
 * https://devapi.sangon.com:8443/api/area/swagger-ui.html
 */

import request from '@/utils/request';

export default {
  // 根据parentId查询返回地址区域列表，传0返回第一级（国家）
  byParentIdGetArea (parentId) {
    return request(`/area/v1/area/parent/code/${parentId}`).then(res => res.map(e => {
      // isHaveLow: 是否有下一级 [1 有, 2 没有]
      // isMustLow: 是否必须选下一级 [1 必须, 0 不必须]
      const isLeaf = e.isHaveLow === 2;
      return { ...e, isLeaf };
    }));
  },
};

/*
 * 员工
 * https://devapi.sangon.com:8443/api/employees/swagger-ui.html
 */

import request from '@/utils/request';

export default {
  // 按编号或名称模糊查询销售员 { code_or_name }
  // 查询所有存在销售范围、大区、网点的员工
  getSaler(params) {
    return request('/employees/v1/saler', { params });
  },
}

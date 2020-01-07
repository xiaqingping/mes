// 操作记录
module.exports = {
  path: '/operation',
  name: 'operation',
  icon: 'user',
  routes: [{
      name: 'operation',
      path: '/operation/operation',
      component: './operation/operation',
    },
    {
      name: 'operation-type',
      path: '/operation/operation-type',
      component: './operation/operation-type',
    },
  ],
};

// 客户关系
module.exports = {
  path: '/bp',
  name: 'bp',
  icon: 'user',
  routes: [
    {
      name: 'maintain',
      path: '/bp/maintain',
      hideChildrenInMenu: true,
      routes: [
        {
          path: '/bp/maintain',
          component: './partner/maintain',
        },
        {
          name: 'add',
          path: '/bp/maintain/add',
          component: './partner/maintain_edit',
        },
        {
          name: 'edit',
          path: '/bp/maintain/edit/:id',
          component: './partner/maintain_edit',
        },
        {
          name: 'details',
          path: '/bp/maintain/details/:id',
          component: './partner/maintain_details',
        },
      ],
    },
    {
      name: 'operation',
      path: '/bp/operation',
      component: './partner/operation',
    },
    {
      name: 'verification',
      path: '/bp/verification',
      component: './partner/verification',
    },
  ],
};

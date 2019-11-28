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
          component: './bp/maintain',
        },
        {
          name: 'add',
          path: '/bp/maintain/add',
          component: './bp/maintain_edit',
        },
        {
          name: 'edit',
          path: '/bp/maintain/edit/:id',
          component: './bp/maintain_edit',
        },
        {
          name: 'details',
          path: '/bp/maintain/details/:id',
          component: './bp/maintain_details',
        },
      ],
    },
    {
      name: 'operation',
      path: '/bp/operation',
      component: './bp/operation',
    },
    {
      name: 'verification',
      path: '/bp/verification',
      component: './bp/verification',
    },
  ],
};

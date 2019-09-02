// 客户关系
module.exports = {
  path: '/partner',
  name: 'partner',
  icon: 'smile',
  routes: [
    {
      name: 'maintain',
      path: '/partner/maintain',
      hideChildrenInMenu: true,
      routes: [
        {
          path: '/partner/maintain',
          component: './partner/maintain',
        },
        {
          name: 'details',
          path: '/partner/maintain/details/:id',
          component: './partner/maintain_details',
        },
        {
          name: 'details',
          path: '/partner/maintain/edit/:id?',
          component: './partner/maintain_edit',
        },
      ],
    },
    {
      name: 'operation',
      path: '/partner/operation',
      component: './partner/operation',
    },
    {
      name: 'verification',
      path: '/partner/verification',
      component: './partner/verification',
    },
  ],
};

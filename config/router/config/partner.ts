// 客户关系
module.exports = {
  path: '/partner',
  name: 'partner',
  icon: 'smile',
  routes: [
    {
      name: 'customer',
      path: '/partner/customer',
      hideChildrenInMenu: true,
      routes: [
        {
          path: '/partner/customer',
          component: './partner/customer',
        },
        {
          name: 'details',
          path: '/partner/customer/details',
          component: './partner/customer_details',
        },
      ],
    },
  ],
};

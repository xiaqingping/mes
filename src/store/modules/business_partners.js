import { PageView } from '@/layouts';

export default {
  path: '/business_partners',
  name: 'business_partners',
  redirect: '/business_partners/customer',
  component: PageView,
  meta: { title: '业务伙伴', keepAlive: true, icon: 'dashboard', permission: [ 'dashboard' ] },
  children: [
    {
      path: '/business_partners/customer',
      name: 'business_partners-customer',
      component: () => import('@/views/business_partners/customer'),
      meta: { title: '客户维护', keepAlive: false, permission: [ 'dashboard' ] },
      children: [
        {
          path: '/business_partners/customer/customer_details',
          name: 'business_partners-customer-details',
          component: () => import('@/views/business_partners/customer_details'),
          meta: { title: '编辑', keepAlive: false, permission: [ 'dashboard' ] }
        }
      ]
    }
  ]
};

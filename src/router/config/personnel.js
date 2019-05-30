import { PageView } from '@/layouts';

export default {
  path: '/personnel',
  name: 'personnel',
  redirect: '/personnel/payroll',
  component: PageView,
  meta: { title: '人事管理', keepAlive: true, icon: 'dashboard', permission: [ 'dashboard' ] },
  children: [
    {
      path: '/personnel/payroll',
      name: 'personnel-payroll',
      component: () => import('@/views/personnel/payroll'),
      meta: { title: '工资管理', keepAlive: false, permission: [ 'dashboard' ] }
    },
    {
      path: '/personnel/payroll_mangement',
      name: 'payroll_mangement',
      component: () => import('@/views/personnel/payroll_mangement'),
      meta: { title: '工资项管理', keepAlive: false, permission: [ 'dashboard' ] }
    }
  ]
};

import { PageView } from '@/layouts';

export default {
  path: '/seq',
  name: 'seq',
  redirect: '/seq/series',
  component: PageView,
  meta: { title: '测序管理', keepAlive: true, icon: 'dashboard', permission: [ 'dashboard' ] },
  children: [
    // {
    //   path: '/seq/sample_order',
    //   name: 'seq-sample-order',
    //   component: () => import('@/views/seq/sample_order'),
    //   meta: { title: '取样单', keepAlive: false, permission: [ 'dashboard' ] }
    // },
    // {
    //   path: '/seq/order',
    //   name: 'seq-order',
    //   component: () => import('@/views/seq/order'),
    //   meta: { title: '测序订单', keepAlive: false, permission: [ 'dashboard' ] }
    // },
    // {
    //   path: '/seq/sample_prepares',
    //   name: 'seq-sample_prepares',
    //   component: () => import('@/views/seq/sample_prepares'),
    //   meta: { title: '样品制备', keepAlive: false, permission: [ 'dashboard' ] }
    // },
    // {
    //   path: '/seq/sample_composes',
    //   name: 'seq-sample_composes',
    //   component: () => import('@/views/seq/sample_composes'),
    //   meta: { title: '样品排版', keepAlive: false, permission: [ 'dashboard' ] }
    // },
    // {
    //   path: '/seq/reaction',
    //   name: 'seq-reaction',
    //   component: () => import('@/views/seq/reaction'),
    //   meta: { title: '测序反应', keepAlive: false, permission: [ 'dashboard' ] }
    // },
    // {
    //   path: '/seq/reaction_composes',
    //   name: 'seq-reaction_composes',
    //   component: () => import('@/views/seq/reaction_composes'),
    //   meta: { title: '反应排版', keepAlive: false, permission: [ 'dashboard' ] }
    // },
    // {
    //   path: '/seq/seqresult',
    //   name: 'seq-seqresult',
    //   component: () => import('@/views/seq/seqresult'),
    //   meta: { title: '结果分析', keepAlive: false, permission: [ 'dashboard' ] }
    // },
    // {
    //   path: '/seq/sample',
    //   name: 'seq-sample',
    //   component: () => import('@/views/seq/sample'),
    //   meta: { title: '样品管理', keepAlive: false, permission: [ 'dashboard' ] }
    // },
    // {
    //   path: '/seq/primer',
    //   name: 'seq-primer',
    //   component: () => import('@/views/seq/primer'),
    //   meta: { title: '引物管理', keepAlive: false, permission: [ 'dashboard' ] }
    // },
    // {
    //   path: '/seq/seqtype',
    //   name: 'seq-seqtype',
    //   component: () => import('@/views/seq/seqtype'),
    //   meta: { title: '测序类型', keepAlive: false, permission: [ 'dashboard' ] }
    // },
    // {
    //   path: '/seq/sample_type',
    //   name: 'seq-sample_type',
    //   component: () => import('@/views/seq/sample_type'),
    //   meta: { title: '样品类型', keepAlive: false, permission: [ 'dashboard' ] }
    // },
    // {
    //   path: '/seq/sample_resistance',
    //   name: 'seq-sample_resistance',
    //   component: () => import('@/views/seq/sample_resistance'),
    //   meta: { title: '样品抗性', keepAlive: false, permission: [ 'dashboard' ] }
    // },
    // {
    //   path: '/seq/sample_feature',
    //   name: 'seq-sample_feature',
    //   component: () => import('@/views/seq/sample_feature'),
    //   meta: { title: '样品特性', keepAlive: false, permission: [ 'dashboard' ] }
    // },
    {
      path: '/seq/seqdevice',
      name: 'seq-seqdevice',
      component: () => import('@/views/seq/seqdevice'),
      meta: { title: '测序仪', keepAlive: false, permission: [ 'dashboard' ] }
    },
    {
      path: '/seq/seqfactory',
      name: 'seq-seqfactory',
      component: () => import('@/views/seq/seqfactory'),
      meta: { title: '测序点', keepAlive: false, permission: [ 'allow' ] }
    },
    {
      path: '/seq/series',
      name: 'seq-series',
      component: () => import('@/views/seq/series'),
      meta: { title: '载体系列', keepAlive: false, permission: [ 'dashboard' ] }
    },
    {
      path: '/seq/carrier',
      name: 'seq-carrier',
      component: () => import('@/views/seq/carrier'),
      meta: { title: '载体管理', keepAlive: false, permission: [ 'dashboard' ] }
    },
    {
      path: '/seq/sample_dose',
      name: 'seq-sample-dose',
      component: () => import('@/views/seq/sample_dose'),
      meta: { title: '样品用量', keepAlive: false, permission: [ 'dashboard' ] }
    },
    {
      path: '/seq/product',
      name: 'seq-product',
      component: () => import('@/views/seq/product'),
      meta: { title: '测序产品', keepAlive: false, permission: [ 'dashboard' ] }
    }
  ]
};

import { PageView } from '@/layouts';

export default {
  path: '/peptide',
  name: 'peptide',
  redirect: '/peptide/peptide_order',
  component: PageView,
  meta: { title: '多肽合成', keepAlive: true, icon: 'dashboard', permission: [ 'dashboard' ] },
  children: [
    {
      path: '/peptide/peptide_order',
      name: 'peptide-peptide-order',
      component: () => import('@/views/peptide/peptide_order'),
      meta: { title: '多肽订单管理', keepAlive: false, permission: [ 'dashboard' ] }
    },
    {
      path: '/peptide/peptide_purity',
      name: 'peptide-peptide-purity',
      component: () => import('@/views/peptide/peptide_purity'),
      meta: { title: '多肽纯度', keepAlive: false, permission: [ 'dashboard' ] }
    },
    {
      path: '/peptide/peptide_product',
      name: 'peptide-peptide-product',
      component: () => import('@/views/peptide/peptide_product'),
      meta: { title: '多肽合成产品', keepAlive: false, permission: [ 'dashboard' ] }
    },
    {
      path: '/peptide/peptide_amino_acid',
      name: 'peptide-peptide-amino-acid',
      component: () => import('@/views/peptide/peptide_amino_acid'),
      meta: { title: '多肽氨基酸', keepAlive: false, permission: [ 'dashboard' ] }
    },
    {
      path: '/peptide/peptide_modifications',
      name: 'peptide-peptide-modifications',
      component: () => import('@/views/peptide/peptide_modifications'),
      meta: { title: '多肽修饰', keepAlive: false, permission: [ 'dashboard' ] }
    },
    {
      path: '/peptide/peptide_modificationsType',
      name: 'peptide-peptide-modifications-type',
      component: () => import('@/views/peptide/peptide_modificationsType'),
      meta: { title: '修饰类别', keepAlive: false, permission: [ 'dashboard' ] }
    },
    {
      path: '/peptide/peptide_modificationProducts',
      name: 'peptide-peptide-modification-products',
      component: () => import('@/views/peptide/peptide_modificationProducts'),
      meta: { title: '多肽修饰产品', keepAlive: false, permission: [ 'dashboard' ] }
    },
    {
      path: '/peptide/peptide_disulfideBondProducts',
      name: 'peptide-peptide-modification-disulfideBondProducts',
      component: () => import('@/views/peptide/peptide_disulfideBondProducts'),
      meta: { title: '多肽二硫键产品', keepAlive: false, permission: [ 'dashboard' ] }
    }
  ]
};

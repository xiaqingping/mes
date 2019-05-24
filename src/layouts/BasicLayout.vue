<template>
  <!-- <global-layout>
    <transition name="page-transition">
      <route-view />
    </transition>
  </global-layout> -->
  <a-layout>
    <side-menu
      :collapsed="collapsed"
      :theme="theme"
      :menus="menus"
      mode="inline"
      :collapsible="true"
    ></side-menu>
  </a-layout>
</template>

<script>
import { mapState } from 'vuex';

import RouteView from '@/layouts/RouteView';
// import MultiTab from '@/components/MultiTab';
import GlobalLayout from '@/components/page/GlobalLayout';
import SideMenu from '@/components/menu/SideMenu';

export default {
  name: 'BasicLayout',
  components: {
    RouteView,
    // MultiTab,
    GlobalLayout,
    SideMenu
  },
  data () {
    return {
      device: 'desktop',
      mode: 'sidemenu',
      theme: 'dark',
      width: '256',
      menus: []
      // menus: [
      //   // { serial: 1000, name: '主页', icon: 'pie-chart', url: '/' },
      //   {
      //     serial: 2000,
      //     name: '测序管理',
      //     icon: 'appstore',
      //     children: [
      //       { serial: 2001, name: '取样单', icon: 'pie-chart', url: '/seq/sample_order' },
      //       { serial: 2002, name: '测序订单', icon: 'pie-chart', url: '/seq/order' }
      //       // { serial: 2003, name: '样品制备', icon: 'pie-chart', url: '/seq/sample_prepare' },
      //       // { serial: 2004, name: '样品排板', icon: 'pie-chart', url: '/seq/sample_prepare' },
      //       // { serial: 2005, name: '测序反应', icon: 'pie-chart', url: '/seq/sample_prepare' },
      //       // { serial: 2006, name: '反应排版', icon: 'pie-chart', url: '/seq/sample_prepare' },
      //       // { serial: 2007, name: '结果分析', icon: 'pie-chart', url: '/seq/sample_prepare' },
      //       // { serial: 2008, name: '样品管理', icon: 'pie-chart', url: '/seq/sample_prepare' },
      //       // { serial: 2009, name: '引物管理', icon: 'pie-chart', url: '/seq/sample_prepare' },
      //       // { serial: 2010, name: '测序类型', icon: 'pie-chart', url: '/seq/sample_prepare' },
      //       // { serial: 2011, name: '样品类型', icon: 'pie-chart', url: '/seq/sample_prepare' },
      //       // { serial: 2012, name: '样品抗性', icon: 'pie-chart', url: '/seq/sample_prepare' },
      //       // { serial: 2013, name: '样品特性', icon: 'pie-chart', url: '/seq/sample_prepare' },
      //       // { serial: 2014, name: '测序仪', icon: 'pie-chart', url: '/seq/sample_prepare' },
      //       // { serial: 2015, name: '测序点', icon: 'pie-chart', url: '/seq/sample_prepare' },
      //       // { serial: 2016, name: '载体系列', icon: 'pie-chart', url: '/seq/sample_prepare' },
      //       // { serial: 2017, name: '载体管理', icon: 'pie-chart', url: '/seq/sample_prepare' },
      //       // { serial: 2018, name: '样品用量', icon: 'pie-chart', url: '/seq/sample_prepare' },
      //       // { serial: 2019, name: '测序产品', icon: 'pie-chart', url: '/seq/sample_prepare' },
      //       // { serial: 2020, name: '测序明细报表', icon: 'pie-chart', url: '/seq/sample_prepare' }
      //     ]
      //   },
      //   {
      //     serial: 3000,
      //     name: '系统管理',
      //     icon: 'setting',
      //     children: [
      //       { serial: 3001, name: '用户管理', icon: 'pie-chart', url: '/system/user' }
      //       // { serial: 3002, name: '编号规则', icon: 'pie-chart', url: '/system/code_rule' },
      //       // { serial: 3003, name: '用户权限', icon: 'pie-chart', url: '/system/authorization' },
      //       // { serial: 3004, name: '资源', icon: 'pie-chart', url: '/system/sources' },
      //       // { serial: 3005, name: '规则', icon: 'pie-chart', url: '/system/rule' },
      //       // { serial: 3006, name: '分组', icon: 'pie-chart', url: '/system/group' }
      //     ]
      //   },
      //   {
      //     serial: 8000,
      //     name: '多肽合成',
      //     icon: 'deployment-unit',
      //     children: [
      //       { serial: 8001, name: '多肽订单管理', icon: 'pie-chart', url: '/peptide/peptide_order' },
      //       { serial: 8002, name: '多肽纯度', icon: 'pie-chart', url: '/peptide/peptide_purity' },
      //       { serial: 8003, name: '多肽合成产品', icon: 'pie-chart', url: '/peptide/peptide_product' },
      //       { serial: 8004, name: '多肽氨基酸', icon: 'pie-chart', url: '/peptide/peptide_amino_acid' },
      //       { serial: 8005, name: '多肽修饰', icon: 'pie-chart', url: '/peptide/peptide_modifications' },
      //       { serial: 8006, name: '修饰类别', icon: 'pie-chart', url: '/peptide/peptide_modificationsType' },
      //       { serial: 8007, name: '多肽修饰产品', icon: 'pie-chart', url: '/peptide/peptide_modificationProducts' },
      //       { serial: 8008, name: '多肽二硫键产品', icon: 'pie-chart', url: '/peptide/peptide_disulfideBondProducts' }
      //     ]
      //   }
      // ]
    };
  },
  created () {
    console.log(this.mainMenu);
    this.menus = this.mainMenu.find(item => item.path === '/').children;
    console.log(this.menus);
    this.collapsed = !this.sidebarOpened;
  },
  computed: {
    ...mapState({
      // 动态主路由
      mainMenu: state => state.permission.addRouters,
      collapsed: state => state.collapsed
    })
  }
};
</script>

<style lang="scss" scoped>
  .page-transition-enter {
    opacity: 0;
  }

  .page-transition-leave-active {
    opacity: 0;
  }

  .page-transition-enter .page-transition-container,
  .page-transition-leave-active .page-transition-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }
</style>

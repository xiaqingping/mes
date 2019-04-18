<template>
  <div class="sider" :class="{'sider-close': collapsed}">
    <div class="logo">
      <h1>MES</h1>
    </div>
    <div class="menu-box">
      <a-menu
        :default-selected-keys="defaultSelectedKeys"
        :default-open-keys="defaultOpenKeys"
        :open-keys="defaultOpenKeys"
        mode="inline"
        theme="dark"
        :inline-collapsed="collapsed"
        @openChange="onOpenChange"
      >
        <template v-for="item in list">
          <a-menu-item v-if="!item.children" :key="item.serial">
            <a-icon :type="item.icon" />
            <span>{{ item.name }}</span>
          </a-menu-item>
          <sub-menu v-else :key="item.serial" :menu-info="item" />
        </template>
      </a-menu>
    </div>
  </div>
</template>

<script>
import SubMenu from './SubMenu';
// import { menu } from '~/assets/js/config';

export default {
  components: {
    SubMenu
  },
  props: {
    collapsed: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      rootSubmenuKeys: [1000, 2000, 3000],
      defaultOpenKeys: [],
      defaultSelectedKeys: [],
      // menu,
      list: [
        { serial: 1000, name: '主页', icon: 'pie-chart', url: '/' },
        {
          serial: 2000,
          name: '测序管理',
          icon: 'appstore',
          children: [
            { serial: 2001, name: '取样单', icon: 'pie-chart', url: '/seq/sample_order' },
            { serial: 2002, name: '测序订单', icon: 'pie-chart', url: '/seq/order' },
            { serial: 2003, name: '样品制备', icon: 'pie-chart', url: '/seq/sample_prepare' },
            { serial: 2004, name: '样品排板', icon: 'pie-chart', url: '/seq/sample_prepare' },
            { serial: 2005, name: '测序反应', icon: 'pie-chart', url: '/seq/sample_prepare' },
            { serial: 2006, name: '反应排版', icon: 'pie-chart', url: '/seq/sample_prepare' },
            { serial: 2007, name: '结果分析', icon: 'pie-chart', url: '/seq/sample_prepare' },
            { serial: 2008, name: '样品管理', icon: 'pie-chart', url: '/seq/sample_prepare' },
            { serial: 2009, name: '引物管理', icon: 'pie-chart', url: '/seq/sample_prepare' },
            { serial: 2010, name: '测序类型', icon: 'pie-chart', url: '/seq/sample_prepare' },
            { serial: 2011, name: '样品类型', icon: 'pie-chart', url: '/seq/sample_prepare' },
            { serial: 2012, name: '样品抗性', icon: 'pie-chart', url: '/seq/sample_prepare' },
            { serial: 2013, name: '样品特性', icon: 'pie-chart', url: '/seq/sample_prepare' },
            { serial: 2014, name: '测序仪', icon: 'pie-chart', url: '/seq/sample_prepare' },
            { serial: 2015, name: '测序点', icon: 'pie-chart', url: '/seq/sample_prepare' },
            { serial: 2016, name: '载体系列', icon: 'pie-chart', url: '/seq/sample_prepare' },
            { serial: 2017, name: '载体管理', icon: 'pie-chart', url: '/seq/sample_prepare' },
            { serial: 2018, name: '样品用量', icon: 'pie-chart', url: '/seq/sample_prepare' },
            { serial: 2019, name: '测序产品', icon: 'pie-chart', url: '/seq/sample_prepare' },
            { serial: 2020, name: '测序明细报表', icon: 'pie-chart', url: '/seq/sample_prepare' }
          ]
        },
        {
          serial: 3000,
          name: '系统管理',
          icon: 'setting',
          children: [
            { serial: 3001, name: '用户管理', icon: 'pie-chart', url: '/system/user' },
            { serial: 3002, name: '编号规则', icon: 'pie-chart', url: '/system/code_rule' },
            { serial: 3003, name: '用户权限', icon: 'pie-chart', url: '/system/authorization' },
            { serial: 3004, name: '资源', icon: 'pie-chart', url: '/system/sources' },
            { serial: 3005, name: '规则', icon: 'pie-chart', url: '/system/rule' },
            { serial: 3006, name: '分组', icon: 'pie-chart', url: '/system/group' }
          ]
        }
      ]
    };
  },
  methods: {
    onOpenChange(openKeys) {
      const latestOpenKey = openKeys.find(key => this.defaultOpenKeys.indexOf(key) === -1);
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.defaultOpenKeys = openKeys;
      } else {
        this.defaultOpenKeys = latestOpenKey ? [latestOpenKey] : [];
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.sider {
  position: fixed;
  width: 256px;
  height: 100%;
  background: #001529;
  &.sider-close {
    width: 80px;
  }
}
.logo {
  height: 64px;
  line-height: 64px;
  background: #002140;
  h1 {
    font-size: 20px;
    color: #fff;
    text-align: center;
  }
}
.menu-box {
  position: absolute;
  top: 64px;
  bottom: 0;
  width: 100%;
  overflow-y: auto;
}
</style>

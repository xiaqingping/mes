<template>
  <div style="width: 256px; height:100%; background: #001529;">
    <div style="height:64px; line-height:64px;">
      <h1 style="font-size:20px; color:#fff; text-align:center;">
        MES
      </h1>
    </div>
    <a-menu
      :default-selected-keys="[21]"
      :default-open-keys="openKeys"
      :open-keys="openKeys"
      mode="inline"
      theme="dark"
      :inline-collapsed="collapsed"
      @openChange="onOpenChange"
    >
      <template v-for="item in list">
        <a-menu-item v-if="!item.children" :key="item.key">
          <a-icon type="pie-chart" />
          <span>{{ item.title }}</span>
        </a-menu-item>
        <sub-menu v-else :key="item.key" :menu-info="item" />
      </template>
    </a-menu>
  </div>
</template>

<script>
import SubMenu from './SubMenu';

export default {
  components: {
    'sub-menu': SubMenu
  },
  data() {
    return {
      collapsed: false,
      rootSubmenuKeys: [1, 2, 3],
      openKeys: [2],
      list: [
        { key: 1, title: '主页', icon: 'pie-chart', url: '/' },
        {
          key: 2,
          title: '测序管理',
          icon: 'appstore',
          children: [
            { key: 21, title: '取样单', icon: 'pie-chart', url: '/2' },
            { key: 22, title: '测序订单', icon: 'pie-chart', url: '/2' },
            { key: 23, title: '样品制备', icon: 'pie-chart', url: '/' }
          ]
        },
        {
          key: 3,
          title: '系统管理',
          icon: 'appstore',
          children: [
            { key: 31, title: '用户管理', icon: 'pie-chart', url: '/user-list' },
            { key: 32, title: '编号规则', icon: 'pie-chart', url: '/user-list' },
            { key: 33, title: '用户权限', icon: 'pie-chart', url: '/user-list' },
            { key: 34, title: '资源', icon: 'pie-chart', url: '/user-list' },
            { key: 35, title: '规则', icon: 'pie-chart', url: '/user-list' },
            { key: 36, title: '分组', icon: 'pie-chart', url: '/user-list' }
          ]
        }
      ]
    };
  },
  methods: {
    onOpenChange(openKeys) {
      const latestOpenKey = openKeys.find(key => this.openKeys.indexOf(key) === -1);
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.openKeys = openKeys;
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : [];
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

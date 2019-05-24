<template>
  <div class="sider">
    <div class="logo">
      <h1>MES</h1>
    </div>
    <div class="menu-box">
      <a-menu
        :default-selected-keys="defaultSelectedKeys"
        :default-open-keys="defaultOpenKeys"
        :open-keys="defaultOpenKeys"
        mode="inline"
        :theme="theme"
        :inline-collapsed="collapsed"
        @openChange="onOpenChange"
      >
        <template v-for="item in menus">
          <a-menu-item v-if="!item.children" :key="item.serial">
            <router-link :to="item.url">
              <a-icon :type="item.icon" />
              <span>{{ item.name }}</span>
            </router-link>
          </a-menu-item>
          <sub-menu v-else :key="item.serial" :menu-info="item" />
        </template>
      </a-menu>
    </div>
  </div>
</template>

<script>
import SubMenu from './SubMenu';

export default {
  components: {
    SubMenu
  },
  props: {
    collapsed: {
      default: false,
      type: Boolean
    },
    theme: {
      default: 'dark',
      type: String
    },
    menus: {
      default () {
        return [];
      },
      type: Array
    }
  },
  data () {
    return {
      rootSubmenuKeys: [2000, 3000, 8000],
      defaultOpenKeys: [],
      defaultSelectedKeys: []
    };
  },
  methods: {
    onOpenChange (openKeys) {
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
  width: 100%;
  height: 100%;
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

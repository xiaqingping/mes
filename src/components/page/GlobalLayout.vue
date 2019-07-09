<template>
  <a-layout class="default-layout">
    <a-layout-sider
      :trigger="null"
      collapsible
      v-model="collapsed">
      <side-menu
        :collapsed="collapsed"
        :theme="theme">
      </side-menu>
    </a-layout-sider>
    <a-layout>
      <global-header
        :mode="mode"
        :theme="theme"
        :collapsed="collapsed"
        :device="device"
      />
      <a-layout-content>
        <slot></slot>
      </a-layout-content>
      <!-- <a-layout-footer style="padding: 0;">
        <global-footer></global-footer>
      </a-layout-footer> -->
    </a-layout>
  </a-layout>
</template>

<script>
import { mapState } from 'vuex';

import SideMenu from '@/components/menu/SideMenu';
import GlobalHeader from '@/components/page/GlobalHeader';
import GlobalFooter from '@/components/page/GlobalFooter';

export default {
  components: {
    SideMenu,
    GlobalHeader,
    GlobalFooter
  },
  data () {
    return {
      device: 'desktop',
      mode: 'sidemenu',
      theme: 'dark',
      width: '256'
    };
  },
  computed: {
    ...mapState({
      collapsed: state => state.collapsed
    })
  }
};
</script>

<style lang="scss" scoped>
html {
  font-family: "微软雅黑", Arial;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}
.default-layout {
  height: 100%;
}
</style>

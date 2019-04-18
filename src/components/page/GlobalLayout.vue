<template>
  <div class="default-layout">
    <div class="left">
      <side-menu :collapsed="collapsed" />
    </div>
    <div class="content" :class="{'content-open': collapsed}">
      <global-header
        :mode="mode"
        :menus="menus"
        :theme="theme"
        :collapsed="collapsed"
        :device="device"
      />
      <slot></slot>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';

import SideMenu from '@/components/menu/SideMenu';
import GlobalHeader from '@/components/page/GlobalHeader';

export default {
  components: {
    SideMenu,
    GlobalHeader
  },
  data () {
    return {
      collapsible: true,
      device: 'desktop',
      menus: [],
      mode: 'sidemenu',
      theme: 'dark'
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
    font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    sans-serif;
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

    .left {
    float: left;
    height: 100vh;
    }

    .content {
    margin-left: 256px;
    &.content-open {
    margin-left: 80px;
    }
    }
  </style>

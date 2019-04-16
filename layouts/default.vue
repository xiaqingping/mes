<template>
  <div class="default-layout">
    <div class="left">
      <side-nav />
    </div>
    <div class="content">
      <global-header
        :mode="mode"
        :menus="menus"
        :theme="theme"
        :collapsed="collapsed"
        :device="device"
      />
      <nuxt />
    </div>
  </div>
</template>

<script>
import SideNav from '~/components/SideNav';
import GlobalHeader from '~/components/GlobalHeader';

export default {
  components: {
    SideNav,
    GlobalHeader
  },
  props: {
    // collapsed: {
    //   type: Boolean,
    //   required: false,
    //   default: false
    // }
  },
  data() {
    return {
      collapsible: true,
      collapsed: false,
      device: 'desktop',
      menus: [],
      mode: 'sidemenu',
      theme: 'dark'
    };
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
}
</style>

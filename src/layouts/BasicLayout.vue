<template>
  <a-layout>
    <side-menu
      :collapsed="collapsed"
      :theme="theme"
      :menus="menus"
      mode="inline"
      :collapsible="true"
    ></side-menu>

    <a-layout>
      <global-header
        :theme="theme"
        :collapsed="collapsed"
        @toggle="toggle"
      />
      <a-layout-content :style="{ height: '100%', paddingTop: '0' }">
        <multi-tab></multi-tab>
        <transition name="page-transition">
          <route-view />
        </transition>
      </a-layout-content>

      <a-layout-footer :style="{padding: 0}">
        <global-footer />
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script>
import { mapState } from 'vuex';

import RouteView from '@/layouts/RouteView';
import GlobalHeader from '@/components/page/GlobalHeader';
import GlobalFooter from '@/components/page/GlobalFooter';
import SideMenu from '@/components/menu/SideMenu';
import MultiTab from '@/components/MultiTab';

export default {
  name: 'BasicLayout',
  components: {
    RouteView,
    GlobalHeader,
    GlobalFooter,
    SideMenu,
    MultiTab
  },
  data () {
    return {
      theme: 'dark',
      collapsed: false,
      menus: []
    };
  },
  created () {
    this.menus = this.mainMenu.find(item => item.path === '/').children;

    this.$store.dispatch('basic/getCache', { type: 'factorys' });
    this.$store.dispatch('basic/getCache', { type: 'offices' });
    this.$store.dispatch('basic/getCache', { type: 'paymethods' });
    this.$store.dispatch('basic/getCache', { type: 'payterms' });
    this.$store.dispatch('basic/getCache', { type: 'regions' });
  },
  computed: {
    ...mapState({
      // 动态主路由
      mainMenu: state => state.permission.addRouters
    })
  },
  methods: {
    toggle () {
      this.collapsed = !this.collapsed;
    }
  }
};
</script>

<style lang="scss">
@import '@/assets/scss/index.scss';

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

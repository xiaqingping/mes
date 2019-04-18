<template>
  <a-layout-header v-if="!headerBarFixed" :class="[fixedHeader && 'ant-header-fixedHeader', sidebarOpened ? 'ant-header-side-opened' : 'ant-header-side-closed', ]" :style="{ padding: '0' }">
    <div v-if="mode === 'sidemenu'" class="header">
      <a-icon
        v-if="device==='mobile'"
        class="trigger"
        :type="collapsed ? 'menu-fold' : 'menu-unfold'"
        @click="toggle"
      />
      <a-icon
        v-else
        class="trigger"
        :type="collapsed ? 'menu-unfold' : 'menu-fold'"
        @click="toggle"
      />
      <user-menu />
    </div>
  </a-layout-header>
</template>

<script>
import UserMenu from './tools/UserMenu';

export default {
  name: 'GlobalHeader',
  components: {
    UserMenu
  },
  props: {
    mode: {
      type: String,
      default: 'sidemenu'
    },
    menus: {
      type: Array,
      required: true
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    device: {
      type: String,
      required: false,
      default: 'desktop'
    }
  },
  data() {
    return {
      headerBarFixed: false,
      fixedHeader: false,
      sidebarOpened: false
    };
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      if (this.autoHideHeader) {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        if (scrollTop > 100) {
          this.headerBarFixed = true;
        } else {
          this.headerBarFixed = false;
        }
      } else {
        this.headerBarFixed = false;
      }
    },
    toggle() {
      this.$store.commit('setting/toggleSideMenu');
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  height: 64px;
  padding: 0 12px 0 0;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  position: relative;
}

.trigger {
  font-size: 20px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

.header {
  &.dark {
    .user-wrapper {
      .action {
        color: rgba(255, 255, 255, 0.85);

        &:hover {
          background: rgba(255, 255, 255, 0.16);
        }
      }
    }
  }
}
</style>

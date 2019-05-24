<template functional>
  <a-sub-menu :key="props.menuInfo.serial">
    <span slot="title">
      <a-icon :type="props.menuInfo.icon"/>
      <span>{{ props.menuInfo.name }}</span>
    </span>
    <template v-for="item in props.menuInfo.children">
      <a-menu-item v-if="!item.children || !item.children.length" :key="item.serial">
        <router-link :to="item.url">
          <!-- <a-icon type="pie-chart" /> -->
          <span>{{ item.name }}</span>
        </router-link>
      </a-menu-item>
      <sub-menu v-else :key="item.serial" :menu-info="item"/>
    </template>
  </a-sub-menu>
</template>

<script>
export default {
  props: {
    menuInfo: {
      type: Object,
      default () {
        return {};
      }
    }
  }
};
</script>

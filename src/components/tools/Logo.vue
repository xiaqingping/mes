<template>
  <div class="logo">
    <router-link to="/">
      <h1>{{ title }}</h1>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'Logo',
  props: {
    title: {
      type: String,
      default: 'MES',
      required: false
    }
  }
};
</script>

<style lang="scss" scoped>
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

</style>

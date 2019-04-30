<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  mounted () {
    console.log(this);
  }
};
</script>

<style lang="scss">
  #app {
    height: 100%;
  }
  .page {
    .page-head {
      padding: 16px 32px 16px 32px;
      background: #fff;
      .breadcrumb {
        font-size: 14px;
        margin-bottom: 16px;
      }
      .page-title {
        font-size: 20px;
        margin: 0;
      }
    }
    .page-content {
      margin: 24px;
      background: #fff;
    }
  }
</style>

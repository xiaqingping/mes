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
  .page-content {
    margin: 24px;
    padding: 24px 32px;
    background: #fff;

    // 表格筛选条件
    .table-search {
      .ant-form-inline {
        .ant-form-item {
          display: flex;
          margin-bottom: 12px;
          margin-right: 0;
          .ant-form-item-control-wrapper {
            flex: 1 1;
            display: inline-block;
            vertical-align: middle;
          }
        }
      }
    }

    // 表格操作
    .table-operator {
      margin-bottom: 18px;
      & > .ant-btn {
        margin-right: 8px;
      }
    }
  }
</style>

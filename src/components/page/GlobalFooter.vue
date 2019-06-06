<template>
  <div class="footer">
    <div class="links">
      <a href="https://www.sangon.com/" target="_blank">生工商城</a>
      <a href="http://www.bbi-lifesciences.com/" target="_blank">BBI官网</a>
      <a href="http://employee.sangon.com/" target="_blank">BBI集团员工自助系统</a>
    </div>
    <div class="copyright">
      Copyright
      <a-icon type="copyright"/>
      2019 <span>生工信息部出品</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LayoutFooter',
  data () {
    return {
    };
  }
};
</script>

<style lang="scss" scoped>
  .footer {
    padding: 0 16px;
    margin: 48px 0 24px;
    text-align: center;

    .links {
      margin-bottom: 8px;

      a {
        color: rgba(0, 0, 0, .45);

        &:hover {
          color: rgba(0, 0, 0, .65);
        }

        &:not(:last-child) {
          margin-right: 40px;
        }
      }
    }
    .copyright {
      color: rgba(0, 0, 0, .45);
      font-size: 14px;
    }
  }
</style>

<template>
  <div class="user-wrapper">
    <span class="action">
      <a-icon type="question-circle-o" />
    </span>

    <a-dropdown>
      <span class="action ant-dropdown-link user-dropdown-menu">
        <a-avatar class="avatar" size="small" :src="avatar" />
        <span>{{ nickname }}</span>
      </span>
      <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
        <a-menu-item key="0">
          <router-link to="/center">
            <a-icon type="user" />
            <span>个人中心</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="1">
          <router-link to="/settings">
            <a-icon type="setting" />
            <span>账户设置</span>
          </router-link>
        </a-menu-item>
        <a-menu-divider />
        <a-menu-item key="2">
          <a href="javascript:;" @click="logout">
            <a-icon type="logout" />
            <span>退出登录</span>
          </a>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
  </div>
</template>

<script>

export default {
  name: 'UserMenu',
  components: {},
  data () {
    return {
      avatar: 'https://blog.maxmeng.top/images/avatar.jpg',
      nickname: 'max'
    };
  },
  methods: {
    logout () {
      const that = this;

      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        onOk () {
          that.$ls.remove('TOKEN');
          that.$router.push('/user/login');
        },
        onCancel () {}
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.user-wrapper {
  float: right;
  height: 100%;

  .action {
    cursor: pointer;
    padding: 0 12px;
    display: inline-block;
    transition: all 0.3s;
    height: 100%;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }

    .avatar {
      margin: 20px 8px 20px 0;
      color: #1890ff;
      background: hsla(0, 0%, 100%, 0.85);
      vertical-align: middle;
    }

    .icon {
      font-size: 16px;
      padding: 4px;
    }
  }
}
</style>

<template>
  <div class="main">
    <a-form
      id="formLogin"
      ref="formLogin"
      class="user-layout-login"
      :form="form"
      @submit="handleSubmit"
    >
      <a-tabs
        :active-key="customActiveKey"
        :tab-bar-style="{ textAlign: 'center', borderBottom: 'unset' }"
        @change="handleTabClick"
      >
        <a-tab-pane key="usercode" tab="账号密码登陆">
          <a-form-item>
            <a-input
              v-decorator="[
                'usercode',
                {rules: [{ required: true, message: '请输入帐户名或邮箱地址' }], validateTrigger: 'change'}
              ]"
              size="large"
              type="text"
              placeholder="帐户名或邮箱地址"
            >
              <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }" />
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-input
              v-decorator="[
                'password',
                {rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur'}
              ]"
              size="large"
              type="password"
              autocomplete="false"
              placeholder="密码"
            >
              <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
            </a-input>
          </a-form-item>
        </a-tab-pane>
        <a-tab-pane key="mobile" tab="手机号登陆">
          <a-form-item>
            <a-input
              v-decorator="['mobile', {rules: [{ required: true, pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号' }], validateTrigger: 'change'}]"
              size="large"
              type="text"
              placeholder="手机号"
            >
              <a-icon slot="prefix" type="mobile" :style="{ color: 'rgba(0,0,0,.25)' }" />
            </a-input>
          </a-form-item>

          <a-row :gutter="16">
            <a-col class="gutter-row" :span="16">
              <a-form-item>
                <a-input
                  v-decorator="['captcha', {rules: [{ required: true, message: '请输入验证码' }], validateTrigger: 'blur'}]"
                  size="large"
                  type="text"
                  placeholder="验证码"
                >
                  <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }" />
                </a-input>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" :span="8">
              <a-button
                class="getCaptcha"
                tabindex="-1"
                :disabled="state.smsSendBtn"
                @click.stop.prevent="getCaptcha"
                v-text="!state.smsSendBtn && '获取验证码' || (state.time+' s')"
              />
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>

      <a-form-item>
        <a-checkbox v-decorator="['rememberMe']">
          自动登陆
        </a-checkbox>
        <router-link class="forge-password" to="/recover" style="float: right;">
          忘记密码
        </router-link>
      </a-form-item>

      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          html-type="submit"
          class="login-button"
          :loading="state.loginBtn"
          :disabled="state.loginBtn"
        >
          确定
        </a-button>
      </a-form-item>

      <div class="user-login-other">
        <span>其他登陆方式</span>
        <a>
          <a-icon class="item-icon" type="alipay-circle" />
        </a>
        <a>
          <a-icon class="item-icon" type="taobao-circle" />
        </a>
        <a>
          <a-icon class="item-icon" type="weibo-circle" />
        </a>
        <router-link class="register" to="/register">
          注册用户
        </router-link>
      </div>
    </a-form>
  </div>
</template>

<script>
export default {
  layout: 'user',
  data () {
    return {
      customActiveKey: 'usercode',
      loginBtn: false,
      stepCaptchaVisible: false,
      form: this.$form.createForm(this),
      state: {
        time: 60,
        loginBtn: false,
        smsSendBtn: false
      }
    };
  },
  methods: {
    handleTabClick (key) {
      this.customActiveKey = key;
      // this.form.resetFields()
    },
    handleSubmit (e) {
      var self = this;
      e.preventDefault();
      const {
        form: { validateFields },
        state,
        customActiveKey
      } = this;

      state.loginBtn = true;

      const validateFieldsKey = customActiveKey === 'usercode' ? ['usercode', 'password'] : ['mobile', 'captcha'];

      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          const loginParams = { ...values };
          loginParams.usercode = values.usercode;
          loginParams.password = values.password;
          const login = customActiveKey === 'usercode' ? self.$api.user.loginByPwd : self.$api.user.loginByCode;
          login(loginParams)
            .then(res => {
              this.loginSuccess(res);
            })
            .finally(() => (state.loginBtn = false));
        } else {
          setTimeout(() => {
            state.loginBtn = false;
          }, 600);
        }
      });
    },
    getCaptcha (e) {
      e.preventDefault();
      const {
        form: { validateFields },
        state
      } = this;

      validateFields(['mobile'], { force: true }, (err, values) => {
        if (!err) {
          state.smsSendBtn = true;

          const interval = window.setInterval(() => {
            if (state.time-- <= 0) {
              state.time = 60;
              state.smsSendBtn = false;
              window.clearInterval(interval);
            }
          }, 1000);

          const hide = this.$message.loading('验证码发送中..', 0);
          self.$api.user
            .getVerifycode(values.mobile)
            .then(res => {
              setTimeout(hide, 2500);
              this.$notification.success({
                message: '提示',
                description: '验证码获取成功，请注意查收',
                duration: 8
              });
            })
            .catch(err => {
              console.log(err);
              setTimeout(hide, 1);
              clearInterval(interval);
              state.time = 60;
              state.smsSendBtn = false;
            });
        }
      });
    },
    stepCaptchaCancel () {
      this.Logout().then(() => {
        this.loginBtn = false;
        this.stepCaptchaVisible = false;
      });
    },
    loginSuccess (res) {
      this.$ls.set('TOKEN', res.authorization);
      const redirect = this.$route.query.redirect;
      this.$router.push(redirect || '/');

      this.$store.dispatch('basic/get_factorys');
      this.$store.dispatch('basic/get_offices');
      this.$store.dispatch('basic/get_paymethods');
      this.$store.dispatch('basic/get_payterms');
      this.$store.dispatch('basic/get_regions');

      this.$notification.success({
        message: '欢迎',
        description: `${res.name}，欢迎回来`
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>

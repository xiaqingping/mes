import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import Link from 'umi/link';
import { Checkbox, Alert, Icon } from 'antd';
import Login from '@/components/Login';
import styles from './Login.less';

import { loginByPwd, loginByCode, getVerifycode } from '@/services/user';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
  };

  onTabChange = type => {
    this.setState({ type });
  };

  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      this.loginForm.validateFields(['usercode'], {}, (err, values) => {
        console.log(values);
        if (err) {
          reject(err);
        } else {
          // const { dispatch } = this.props;
          // dispatch({
          //   type: 'login/getCaptcha',
          //   payload: values.usercode,
          // })
          //   .then(resolve)
          //   .catch(reject);
          getVerifycode(values.usercode).then(res => {
            console.log(res);
          });
        }
      });
    });

  handleSubmit = (err, values) => {
    console.log(values);
    const { type } = this.state;
    if (!err) {
      // const { dispatch } = this.props;
      // dispatch({
      //   type: 'login/login',
      //   payload: {
      //     ...values,
      //     type,
      //   },
      // });
      const cb = res => {
        localStorage.user = JSON.stringify(res);
        localStorage.Authorization = res.authorization;
        localStorage['antd-pro-authority'] = JSON.stringify(['admin']);
      };

      if (type === 'account') {
        loginByPwd(values).then(res => cb(res));
      } else {
        loginByCode(values).then(res => cb(res));
      }
    }
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { login, submitting } = this.props;
    const { type, autoLogin } = this.state;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <Tab key="account" tab={formatMessage({ id: 'app.login.tab-login-credentials' })}>
            {login.status === 'error' &&
              login.type === 'account' &&
              !submitting &&
              this.renderMessage(formatMessage({ id: 'app.login.message-invalid-credentials' }))}
            <UserName name="usercode" placeholder="username: admin or user" />
            <Password
              name="password"
              placeholder="password: ant.design"
              onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
            />
          </Tab>
          <Tab key="mobile" tab={formatMessage({ id: 'app.login.tab-login-mobile' })}>
            {login.status === 'error' &&
              login.type === 'mobile' &&
              !submitting &&
              this.renderMessage(
                formatMessage({ id: 'app.login.message-invalid-verification-code' })
              )}
            <Mobile name="usercode" />
            <Captcha name="verifycode" countDown={120} onGetCaptcha={this.onGetCaptcha} />
          </Tab>
          <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              <FormattedMessage id="app.login.remember-me" />
            </Checkbox>
            <a style={{ float: 'right' }} href="">
              <FormattedMessage id="app.login.forgot-password" />
            </a>
          </div>
          <Submit loading={submitting}>
            <FormattedMessage id="app.login.login" />
          </Submit>
          <div className={styles.other}>
            <FormattedMessage id="app.login.sign-in-with" />
            <Icon type="alipay-circle" className={styles.icon} theme="outlined" />
            <Icon type="taobao-circle" className={styles.icon} theme="outlined" />
            <Icon type="weibo-circle" className={styles.icon} theme="outlined" />
            <Link className={styles.register} to="/User/Register">
              <FormattedMessage id="app.login.signup" />
            </Link>
          </div>
        </Login>
      </div>
    );
  }
}

export default LoginPage;

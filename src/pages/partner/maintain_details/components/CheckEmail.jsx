// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-nested-ternary */
import { Button, Modal, Tabs, Form, Input, Icon, Select } from 'antd';
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import './style.less';
import api from '@/api';

const { Option } = Select;
const FormItem = Form.Item;
const { TabPane } = Tabs;

class CheckEmail extends Component {
  state = {
    status: 1,
    oneQuestion: null,
    twoQuestion: null,
    threeQuestion: null,
    proceed: false,
    time: 60,
    btnText: 1,
    verifyRecordId: null,
  };

  // componentDidMount() {
  //   const { proceed } = this.props; // 继续验证的状态区别
  //   if (proceed) {
  //     this.setState({
  //       proceed: !!proceed,
  //       status: 5,
  //     });
  //   }
  // }

  setModalVisible = v => {
    this.setState({
      status: 1,
      oneQuestion: null,
      twoQuestion: null,
      threeQuestion: null,
      // proceed: false,
    });
    this.props.checkEmail(v);
  };

  // 用户自行变更验证input的数据
  handleSend = e => {
    e.preventDefault();
    if (this.props.form.getFieldValue('phone')) {
      this.setState({
        status: 2,
      });
    }
  };

  // 人工辅助变更验证input的数据
  handleNext = e => {
    e.preventDefault();
    if (this.props.form.getFieldValue('type')) {
      this.setState({
        status: 4,
      });
    }
  };

  // 人工提交问题
  handleQuestion = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (values.qone && parseInt(values.qone, 10) === 2) {
        this.setState({
          oneQuestion: 'success',
        });
      } else {
        this.setState({
          oneQuestion: 'error',
        });
      }
      if (values.qtwo && parseInt(values.qtwo, 10) === 4) {
        this.setState({
          twoQuestion: 'success',
        });
      } else {
        this.setState({
          twoQuestion: 'error',
        });
      }
      if (values.qthree && parseInt(values.qthree, 10) === 9) {
        this.setState({
          threeQuestion: 'success',
        });
      } else {
        this.setState({
          threeQuestion: 'error',
        });
      }
      if (!err) {
        const {
          details: {
            basic: { id },
          },
        } = this.props;
        // 问题提交
        api.bp
          .changeContactInfoAnswerVerify(id, {
            type: 2,
            answerList: [
              { questionId: 1, answer: '2' },
              { questionId: 2, answer: '4' },
              { questionId: 3, answer: '9' },
            ],
          })
          .then(res => {
            this.setState({
              status: 5,
              verifyRecordId: res.verifyRecordId,
            });
          });
      }
    });
  };

  handleCode = e => {
    e.preventDefault();
    if (this.props.form.getFieldValue('code')) {
      const { verifyRecordId } = this.state;
      // 提交验证码
      // eslint-disable-next-line max-len
      api.bp
        .changeContactInfoNewEmailVerifyCodeVerificationVerify(
          verifyRecordId,
          this.props.form.getFieldValue('code'),
        )
        .then(() => {
          clearInterval(this.timer);
          this.setState({
            time: 60,
            btnText: 1,
            status: 6,
          });
        });
    }
  };

  // 获取验证码功能
  // eslint-disable-next-line consistent-return
  getCode = () => {
    const { emailAccount } = this.props;
    if (!this.props.form.getFieldValue('userEmail') && !emailAccount) {
      return false;
    }
    this.time();
    this.setState({
      btnText: 3,
      time: 60,
    });
    const { verifyRecordId } = this.state;

    // 发送验证码
    // eslint-disable-next-line max-len
    api.bp.changeContactInfoNewEmailVerifyCodeSendingVerify(
      verifyRecordId,
      this.props.form.getFieldValue('userEmail'),
    );
  };

  // 倒计时
  time = () => {
    // 清除可能存在的定时器
    clearInterval(this.timer);
    const { time } = this.state;
    // 创建（重新赋值）定时器
    this.timer = setInterval(() => {
      // 当前时间回显-1
      this.setState(
        {
          time: time - 1,
        },
        () => {
          // 判断修改后时间是否小于1达到最小时间
          if (this.state.time <= 0) {
            // 清除定时器
            clearInterval(this.timer);
            this.setState({
              btnText: 2,
              time: 60,
            });
            // 结束定时器循环
            return;
          }
          // 循环自调用
          this.time();
        },
      );
    }, 1000);
  };

  // 用户自行变更
  userChange = () => {
    const { status } = this.state;
    if (status === 2) {
      return (
        <div style={{ height: '261px', textAlign: 'center', paddingTop: '28px' }}>
          <Icon type="check-circle" style={{ fontSize: '40px', color: '#54C31F' }} />
          <h2 style={{ fontWeight: '600', margin: '30px 0 20px' }}>
            {formatMessage({ id: 'bp.maintain_details.phone.sentSuccessfully' })}
          </h2>
          <h3 style={{ color: '#999999' }}>
            {formatMessage({ id: 'bp.maintain_details.phone.passMsg' })}
          </h3>
        </div>
      );
    }
    return (
      <Form layout="inline" onSubmit={this.handleSend}>
        <div style={{ height: '200px', textAlign: 'center', paddingTop: '68px' }}>
          <FormItem
            label={formatMessage({ id: 'bp.maintain_details.phone.contactInformation' })}
            name="phone"
          >
            <Input
              style={{ width: '300px' }}
              placeholder={formatMessage({ id: 'bp.maintain_details.phone.phoneOrEmail' })}
            />
          </FormItem>
        </div>
        <div
          style={{
            textAlign: 'right',
            padding: '10px 20px',
            borderTop: '1px solid #E8E8E8',
          }}
        >
          <FormItem>
            <Button type="primary" htmlType="submit">
              {formatMessage({ id: 'bp.maintain_details.phone.send' })}
            </Button>
          </FormItem>
        </div>
      </Form>
    );
  };

  // 人工辅助变更
  manChange = () => {
    const { proceed } = this.props;
    const { status, oneQuestion, twoQuestion, threeQuestion } = this.state;
    if (status === 4) {
      return (
        <Form
          layout="inline"
          style={{
            textAlign: 'center',
            paddingTop: '20px',
          }}
          onSubmit={this.handleQuestion}
        >
          <FormItem
            label={formatMessage({ id: 'bp.maintain_details.phone.question1' })}
            className="tools"
            hasFeedback
            validateStatus={oneQuestion}
            name="qone"
            rules={[
              // { required: true, message: '请输入内容' },
              {
                validator: (rule, value, callback) => {
                  if (parseInt(value, 10) !== 2 && value) {
                    this.setState({
                      oneQuestion: 'error',
                    });
                    // callback('您输入的答案有误！');
                  } else {
                    this.setState({
                      oneQuestion: 'success',
                    });
                  }
                  callback();
                },
              },
            ]}
          >
            <div
              style={{
                width: '300px',
                border: '1px solid #D6D6D6',
                textAlign: 'left',
                paddingLeft: '10px',
                height: '30px',
                lineHeight: '30px',
                marginTop: '5px',
                borderRadius: '3px',
              }}
            >
              <span>1+1=？</span>
            </div>

            <Input style={{ width: '300px' }} placeholder={formatMessage({ id: 'bp.inputHere' })} />
          </FormItem>
          <FormItem
            label={formatMessage({ id: 'bp.maintain_details.phone.question2' })}
            className="tools"
            hasFeedback
            validateStatus={twoQuestion}
            name="qtwo"
            rules={[
              // { required: true, message: '请输入内容' },
              {
                validator: (rule, value, callback) => {
                  if (parseInt(value, 10) !== 4 && value) {
                    this.setState({
                      twoQuestion: 'error',
                    });
                    // callback('您输入的答案有误！');
                  } else {
                    this.setState({
                      twoQuestion: 'success',
                    });
                  }
                  callback();
                },
              },
            ]}
          >
            <div
              style={{
                width: '300px',
                border: '1px solid #D6D6D6',
                textAlign: 'left',
                paddingLeft: '10px',
                height: '30px',
                lineHeight: '30px',
                marginTop: '5px',
                borderRadius: '3px',
              }}
            >
              <span>2*2=？</span>
            </div>
            <Input style={{ width: '300px' }} placeholder={formatMessage({ id: 'bp.inputHere' })} />
          </FormItem>
          <FormItem
            label={formatMessage({ id: 'bp.maintain_details.phone.question3' })}
            style={{ paddingBottom: '30px' }}
            hasFeedback
            validateStatus={threeQuestion}
            className="tools"
            name="qthree"
            rules={[
              // { required: true, message: '请输入内容' },
              {
                validator: (rule, value, callback) => {
                  if (parseInt(value, 10) !== 9 && value) {
                    this.setState({
                      threeQuestion: 'error',
                    });
                    // callback('您输入的答案有误！');
                  } else {
                    this.setState({
                      threeQuestion: 'success',
                    });
                  }
                  callback();
                },
              },
            ]}
          >
            <div
              style={{
                width: '300px',
                border: '1px solid #D6D6D6',
                textAlign: 'left',
                paddingLeft: '10px',
                height: '30px',
                lineHeight: '30px',
                marginTop: '5px',
                borderRadius: '3px',
              }}
            >
              <span>10-1=？</span>
            </div>
            <Input style={{ width: '300px' }} placeholder={formatMessage({ id: 'bp.inputHere' })} />
          </FormItem>
          <div style={{ textAlign: 'right', padding: '10px 20px', borderTop: '1px solid #E8E8E8' }}>
            <FormItem>
              <Button type="primary" htmlType="submit">
                {formatMessage({ id: 'bp.maintain_details.phone.next' })}
              </Button>
            </FormItem>
          </div>
        </Form>
      );
    }
    if (status === 6) {
      return (
        <div style={{ height: '261px', textAlign: 'center', paddingTop: '60px' }}>
          <Icon type="check-circle" style={{ fontSize: '40px', color: '#54C31F' }} />
          <h2 style={{ fontWeight: '600', margin: '30px 0 20px' }}>
            {formatMessage({ id: 'bp.maintain_details.email.emailChangeFinish' })}
          </h2>
        </div>
      );
    }
    if (status === 5 || proceed) {
      return (
        <div style={{ textAlign: 'center', paddingTop: '20px' }}>
          <Icon type="check-circle" style={{ fontSize: '20px', color: '#54C31F' }} />
          <span style={{ fontSize: '20px', fontWeight: '600' }}>
            &nbsp;&nbsp;&nbsp;
            {proceed
              ? formatMessage({ id: 'bp.maintain_details.email.continue' })
              : formatMessage({ id: 'bp.maintain_details.email.finishQuestion' })}
          </span>
          <Form layout="inline" onSubmit={this.handleCode} style={{ marginTop: '45px' }}>
            <div>{this.pageRetrun()}</div>
            <div
              style={{
                textAlign: 'right',
                padding: '10px 20px',
                borderTop: '1px solid #E8E8E8',
              }}
            >
              <FormItem>
                <Button type="primary" htmlType="submit">
                  {formatMessage({ id: 'bp.maintain_details.phone.finish' })}
                </Button>
              </FormItem>
            </div>
          </Form>
        </div>
      );
    }
    return (
      <Form layout="inline" onSubmit={this.handleNext} initialValues={{ type: '1' }}>
        <div style={{ height: '200px', textAlign: 'center', paddingTop: '68px' }}>
          <FormItem label={formatMessage({ id: 'bp.maintain_details.phone.identity' })} name="type">
            <Select style={{ width: '300px' }}>
              <Option value="1">
                {formatMessage({ id: 'bp.maintain_details.phone.questions' })}
              </Option>
            </Select>
          </FormItem>
        </div>
        <div style={{ textAlign: 'right', padding: '10px 20px', borderTop: '1px solid #E8E8E8' }}>
          <FormItem>
            <Button type="primary" htmlType="submit">
              {formatMessage({ id: 'bp.maintain_details.phone.next' })}
            </Button>
          </FormItem>
        </div>
      </Form>
    );
  };

  // 继续验证和问题验证后的页面
  pageRetrun = () => {
    const { emailAccount, proceed } = this.props;
    const { btnText, time } = this.state;
    if (proceed) {
      return (
        <Fragment>
          <div className="divStyle">
            <span>{formatMessage({ id: 'bp.maintain_details.email.email' })}</span>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span>{emailAccount}</span>
          </div>

          <FormItem
            label={formatMessage({ id: 'bp.maintain_details.phone.verificationCode' })}
            style={{ margin: '20px 16px 60px 0' }}
            name="code"
          >
            <Input
              style={{ width: '180px' }}
              placeholder={formatMessage({ id: 'bp.maintain_details.phone.pleaseEnterCode' })}
            />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Button
              type="primary"
              disabled={btnText === 3}
              ghost
              onClick={() => {
                this.getCode();
              }}
              style={{ width: '100px' }}
            >
              {btnText === 1
                ? formatMessage({ id: 'bp.maintain_details.phone.obtainNewCode' })
                : btnText === 2
                ? formatMessage({ id: 'bp.maintain_details.phone.resend' })
                : `${time}${formatMessage({ id: 'bp.maintain_details.phone.seconds' })}`}
            </Button>
          </FormItem>
        </Fragment>
      );
    }
    return (
      <Fragment>
        <FormItem label={formatMessage({ id: 'bp.maintain_details.email.email' })} name="userEmail">
          <Input style={{ width: '297px' }} placeholder={formatMessage({ id: 'bp.inputHere' })} />
        </FormItem>
        <FormItem
          label={formatMessage({ id: 'bp.maintain_details.phone.verificationCode' })}
          style={{ margin: '20px 16px 60px 0' }}
          name="code"
        >
          <Input
            style={{ width: '180px' }}
            placeholder={formatMessage({ id: 'bp.maintain_details.phone.pleaseEnterCode' })}
          />
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Button
            type="primary"
            disabled={btnText === 3}
            ghost
            onClick={() => {
              this.getCode();
            }}
            style={{ width: '100px' }}
          >
            {btnText === 1
              ? formatMessage({ id: 'bp.maintain_details.phone.obtainNewCode' })
              : btnText === 2
              ? formatMessage({ id: 'bp.maintain_details.phone.resend' })
              : `${time}${formatMessage({ id: 'bp.maintain_details.phone.seconds' })}`}
          </Button>
        </FormItem>
      </Fragment>
    );
  };

  // tab切换
  tabsChange = key => {
    const { proceed } = this.state;
    if (!proceed) {
      this.setState({
        status: parseInt(key, 10) === 2 ? 3 : 1,
      });
    }
  };

  render() {
    const { emailShow, proceed } = this.props;
    return (
      <div>
        <Modal
          visible={emailShow}
          destroyOnClose
          maskClosable={false}
          onOk={() => this.setModalVisible(false)}
          onCancel={() => this.setModalVisible(false)}
          className="check-tabs"
          footer={null}
        >
          <Tabs
            defaultActiveKey={proceed ? '2' : '1'}
            onChange={key => {
              this.tabsChange(key);
            }}
          >
            <TabPane
              tab={formatMessage({ id: 'bp.maintain_details.phone.customerSelfChange' })}
              key="1"
            >
              {this.userChange()}
            </TabPane>
            <TabPane
              tab={formatMessage({ id: 'bp.maintain_details.phone.systemAssistantChange' })}
              key="2"
            >
              {this.manChange()}
            </TabPane>
          </Tabs>
        </Modal>
      </div>
    );
  }
}

export default connect(({ basicCache }) => ({
  countryDiallingCodes: basicCache.countryDiallingCodes,
}))(CheckEmail);

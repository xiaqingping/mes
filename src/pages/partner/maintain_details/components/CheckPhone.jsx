// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-nested-ternary */
import {
  Button,
  Modal,
  Tabs,
  Form,
  Input,
  Icon,
  Select,
  Badge,
} from 'antd';
import React, { Component } from 'react';
import './style.less'

const { Option } = Select;
const FormItem = Form.Item;
const { TabPane } = Tabs;

class CheckPhone extends Component {
  state = {
    phoneVisible: false,
    status: 1,
    oneQuestion: null,
    twoQuestion: null,
    threeQuestion: null,
    time: 60,
    btnText: 1,
  };

  componentWillReceiveProps (nextProps) {
    const { phoneShow } = nextProps;
    this.setState({
      phoneVisible: phoneShow,
    })
  }


  setModalVisible(phoneVisible) {
    this.setState({
      phoneVisible,
      status: 1,
      oneQuestion: null,
      twoQuestion: null,
      threeQuestion: null,
    });
    this.props.checkPhone(phoneVisible)
  }

  // 用户自行变更验证input的数据
  handleSend = e => {
    e.preventDefault();
    if (this.props.form.getFieldValue('phone')) {
      this.setState({
        status: 2,
      })
    }
  };

  // 人工辅助变更验证input的数据
  handleNext = e => {
    e.preventDefault();
    if (this.props.form.getFieldValue('type')) {
      this.setState({
        status: 4,
      })
    }
  };

  // 人工提交问题
  handleQuestion = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (values.qone && parseInt(values.qone, 10) === 2) {
        this.setState({
          oneQuestion: 'success',
        })
      } else {
        this.setState({
          oneQuestion: 'error',
        })
      }
      if (values.qtwo && parseInt(values.qtwo, 10) === 4) {
        this.setState({
          twoQuestion: 'success',
        })
      } else {
        this.setState({
          twoQuestion: 'error',
        })
      }
      if (values.qthree && parseInt(values.qthree, 10) === 9) {
        this.setState({
          threeQuestion: 'success',
        })
      } else {
        this.setState({
          threeQuestion: 'error',
        })
      }
      if (!err) {
        this.setState({
          status: 5,
        })
      }
    });
  };

  handleCode = e => {
    e.preventDefault();
    if (this.props.form.getFieldValue('code')) {
      clearInterval(this.timer)
      this.setState({
        time: 60,
        btnText: 1,
        status: 6,
      })
    }
  }

  // 获取验证码功能
  getCode = () => {
    if (this.props.form.getFieldValue('userPhone')) {
      // 发送验证码接口
      this.time();
      this.setState({
        btnText: 3,
        time: 60,
      })
    }
  }

  // 倒计时
  time = () => {
    // 清除可能存在的定时器
    clearInterval(this.timer)
    const { time } = this.state
    // 创建（重新赋值）定时器
    this.timer = setInterval(() => {
        // 当前时间回显-1
        this.setState({
            time: time - 1,
            btnText: 3,
        }, () => {
            // 判断修改后时间是否小于1达到最小时间
            if (this.state.time <= 0) {
                // 清除定时器
                clearInterval(this.timer)
                this.setState({
                  btnText: 2,
                  time: 60,
                })
                // 结束定时器循环
                return
            }
            // 循环自调用
            this.time()
        })
    }, 1000)
  }

  // 用户自行变更
  userChange = () => {
      const {
        form: { getFieldDecorator },
      } = this.props;
      const { status } = this.state;
      if (status === 2) {
        return (
            <div style={{ height: '261px', textAlign: 'center', paddingTop: '28px' }}>
              <Icon type="check-circle" style={{ fontSize: '40px', color: '#54C31F' }}/>
              <h2 style={{ fontWeight: '600', margin: '30px 0 20px' }}>发送成功</h2>
              <h3 style={{ color: '#999999' }}>联系方式已输入成功，请用户进行自行变更。</h3>
            </div>
        )
      }
      return (
          <Form layout="inline" onSubmit={this.handleSend}>
            <div style={{ height: '200px', textAlign: 'center', paddingTop: '68px' }}>
              <FormItem label="联系方式">
                {getFieldDecorator('phone')(<Input style={{ width: '300px' }} placeholder="输入移动电话或邮箱"/>)}
              </FormItem>
            </div>
            <div style={{ textAlign: 'right', padding: '10px 20px', borderTop: '1px solid #E8E8E8' }}>
              <FormItem>
                <Button type="primary" htmlType="submit">
                  发送
                </Button>
              </FormItem>
            </div>
          </Form>
        )
      }

  // 人工辅助变更
  manChange = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { status, oneQuestion, twoQuestion, threeQuestion, btnText, time } = this.state;
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '86',
    })(
      <Select style={{ width: 100 }}>
        <Option value="86"><Badge status="error" /> +886</Option>
        <Option value="87"><Badge status="error" /> +887</Option>
      </Select>,
    );

    if (status === 4) {
      return (
        <Form layout="inline" style={{ textAlign: 'center', paddingTop: '20px' }} onSubmit={this.handleQuestion}>
          <FormItem label="问题一" className="tools" hasFeedback validateStatus={oneQuestion}>
            <div style={{ width: '300px', border: '1px solid #D6D6D6', textAlign: 'left', paddingLeft: '10px', height: '30px', lineHeight: '30px', marginTop: '5px', borderRadius: '3px' }}>
              <span>1+1=？</span>
            </div>
            {getFieldDecorator('qone', {
              rules: [
                { required: true, message: '请输入内容' },
                { validator: (rule, value, callback) => {
                    if (parseInt(value, 10) !== 2 && value) {
                      this.setState({
                        oneQuestion: 'error',
                      })
                      callback('您输入的答案有误！');
                    } else {
                      this.setState({
                        oneQuestion: 'success',
                      })
                    }
                    callback();
                  },
                },
              ],
            })(
              <Input style={{ width: '300px' }} placeholder="请输入"/>,
            )}
          </FormItem>
          <FormItem label="问题二" className="tools" hasFeedback validateStatus={twoQuestion}>
          <div style={{ width: '300px', border: '1px solid #D6D6D6', textAlign: 'left', paddingLeft: '10px', height: '30px', lineHeight: '30px', marginTop: '5px', borderRadius: '3px' }}>
              <span>2*2=？</span>
            </div>
            {getFieldDecorator('qtwo', {
              rules: [
                { required: true, message: '请输入内容' },
                { validator: (rule, value, callback) => {
                    if (parseInt(value, 10) !== 4 && value) {
                      this.setState({
                        twoQuestion: 'error',
                      })
                      callback('您输入的答案有误！');
                    } else {
                      this.setState({
                        twoQuestion: 'success',
                      })
                    }
                    callback();
                  },
                },
              ],
            })(
              <Input style={{ width: '300px' }} placeholder="请输入"/>,
            )}
          </FormItem>
          <FormItem label="问题三" style={{ paddingBottom: '30px' }} hasFeedback validateStatus={threeQuestion} className="tools">
          <div style={{ width: '300px', border: '1px solid #D6D6D6', textAlign: 'left', paddingLeft: '10px', height: '30px', lineHeight: '30px', marginTop: '5px', borderRadius: '3px' }}>
              <span>10-1=？</span>
            </div>
            {getFieldDecorator('qthree', {
              rules: [
                { required: true, message: '请输入内容' },
                { validator: (rule, value, callback) => {
                    if (parseInt(value, 10) !== 9 && value) {
                      this.setState({
                        threeQuestion: 'error',
                      })
                      callback('您输入的答案有误！');
                    } else {
                      this.setState({
                        threeQuestion: 'success',
                      })
                    }
                    callback();
                  },
                },
              ],
            })(
              <Input style={{ width: '300px' }} placeholder="请输入"/>,
            )}
          </FormItem>
          <div style={{ textAlign: 'right', padding: '10px 20px', borderTop: '1px solid #E8E8E8' }}>
            <FormItem>
              <Button type="primary" htmlType="submit">
                下一步
              </Button>
            </FormItem>
          </div>
        </Form>
      )
    }
    if (status === 6) {
      return (
        <div style={{ height: '261px', textAlign: 'center', paddingTop: '60px' }}>
          <Icon type="check-circle" style={{ fontSize: '40px', color: '#54C31F' }}/>
          <h2 style={{ fontWeight: '600', margin: '30px 0 20px' }}>手机变更已完成</h2>
        </div>
      )
    }
    if (status === 5) {
      return (
        <div style={{ textAlign: 'center', paddingTop: '20px' }}>
          <Icon type="check-circle" style={{ fontSize: '20px', color: '#54C31F' }}/>
          <span style={{ fontSize: '20px', fontWeight: '600' }}>&nbsp;&nbsp;&nbsp;问题验证成功，请输入新的手机号</span>
          <Form layout="inline" onSubmit={this.handleCode} style={{ marginTop: '45px' }}>
            <div>
              <FormItem label="手机号">
                {getFieldDecorator('userPhone')(<Input addonBefore={prefixSelector} style={{ width: '300px' }} placeholder="请输入"/>)}
              </FormItem>
              <FormItem label="验证码" style={{ margin: '20px 16px 60px 0' }}>
                {getFieldDecorator('code')(<Input style={{ width: '180px' }} placeholder="请输入短信验证码"/>)}
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Button type="primary" disabled={btnText === 3} ghost onClick={() => { this.getCode() }} style={{ width: '100px' }}>
                  {(btnText === 1 ? '获取验证码' : (btnText === 2 ? '重新发送' : `${time}秒`))}
                </Button>
              </FormItem>
            </div>
            <div style={{ textAlign: 'right', padding: '10px 20px', borderTop: '1px solid #E8E8E8' }}>
              <FormItem>
                <Button type="primary" htmlType="submit">
                  完成
                </Button>
              </FormItem>
            </div>

          </Form>
        </div>

        )
    }
    return (
      <Form layout="inline" onSubmit={this.handleNext}>
          <div style={{ height: '200px', textAlign: 'center', paddingTop: '68px' }}>
            <FormItem label="验证方式">
            {getFieldDecorator('type', { initialValue: '1' })(
            <Select style={{ width: '300px' }} placeholder="选择验证方式（问题）">
              <Option value="1">问题方式</Option>
            </Select>)}
            </FormItem>
          </div>
          <div style={{ textAlign: 'right', padding: '10px 20px', borderTop: '1px solid #E8E8E8' }}>
            <FormItem>
              <Button type="primary" htmlType="submit">
                下一步
              </Button>
            </FormItem>
          </div>

        </Form>
      )
  }

  // tab切换
  tabsChange = key => {
      this.setState({
        // eslint-disable-next-line radix
        status: parseInt(key) === 2 ? 3 : 1,
      })
  }

  render() {
    return (
      <div>
        <Modal
          destroyOnClose
          maskClosable={false}
          visible={this.state.phoneVisible}
          onOk={() => this.setModalVisible(false)}
          onCancel={() => this.setModalVisible(false)}
          className="check-tabs"
          footer={ null}
        >
            <Tabs defaultActiveKey="1" onChange={key => { this.tabsChange(key) }} tabBarStyle={{ height: '50px', fontSize: '30px' }}>
              <TabPane tab="用户自行变更" key="1">
              {this.userChange()}
              </TabPane>
              <TabPane tab="人工辅助变更" key="2">
              {this.manChange()}
              </TabPane>
            </Tabs>
        </Modal>
      </div>
     );
  }
}

export default Form.create()(CheckPhone);

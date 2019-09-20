import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Dropdown,
  Form,
  Icon,
  Input,
  InputNumber,
  Menu,
  Row,
  Select,
  Switch,
  message,
  Cascader,
} from 'antd';
import React, { Component } from 'react';

const FormItem = Form.Item;
const InputGroup = Input.Group;
const { Option } = Select;
const { RangePicker } = DatePicker;

const tabListNoTitle = [
  {
    key: 'kaipiao',
    tab: '开票银行',
  },
  {
    key: 'fukuan',
    tab: '付款银行',
  },
];

// eslint-disable-next-line react/prefer-stateless-function
class Bank extends Component {
  state = {
    tabKey: 'kaipiao',
  }

  onTabChange = key => {
    this.setState({
      tabKey: key,
    });
  }

  renderChildrenByTabKey = tabKey => {
    if (tabKey === 'kaipiao') {
      return this.renderKaipiao();
    }
    if (tabKey === 'fukuan') {
      return this.renderFukuan();
    }
    return null;
  }

  // 开票银行
  renderKaipiao = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form layout="vertical">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={4}>
            <FormItem label="国家">
              {getFieldDecorator('email', {
                initValue: '1',
              })(
                <Select>
                  <Option value="1">中国</Option>
                  <Option value="2">美国</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={4}>
            <FormItem label="开户行">
              {getFieldDecorator('kaihubank', {
                initValue: '1',
              })(
                <Select>
                  <Option value="1">工商银行</Option>
                  <Option value="2">中国银行</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={4}>
            <FormItem label="银行账户">
              {getFieldDecorator('zhanghu')(<Input />)}
            </FormItem>
          </Col>
          <Col md={4}>
            <FormItem label="户名">
              {getFieldDecorator('huming')(<Input />)}
            </FormItem>
          </Col>
          <Col md={8}>
            <FormItem label="有效期">
              {getFieldDecorator('time')(<RangePicker />)}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  // 付款银行
  renderFukuan = () => (
    <div>付款</div>
  )

  render() {
    const { tabKey } = this.state;
    return (
      <Card
        bordered={false}
        tabList={tabListNoTitle}
        activeTabKey={this.state.tabKey}
        onTabChange={key => {
          this.onTabChange(key);
        }}
      >
        {this.renderChildrenByTabKey(tabKey)}
      </Card>
    );
  }
}

export default Form.create()(Bank);

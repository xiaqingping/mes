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
const { Option } = Select;

// eslint-disable-next-line react/prefer-stateless-function
class Bank extends Component {
  state = {}

  renderFukuan = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form layout="vertical">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6}>
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
          <Col md={6}>
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
          <Col md={6}>
            <FormItem label="银行账户">
              {getFieldDecorator('zhanghu')(<Input />)}
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem label="户名">
              {getFieldDecorator('huming')(<Input />)}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    return (
      <Card title="付款银行" bordered={false} style={{ marginBottom: '24px' }}>
        {this.renderFukuan()}
      </Card>
    );
  }
}

export default Form.create()(Bank);

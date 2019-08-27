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
const options = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];

// eslint-disable-next-line react/prefer-stateless-function
class BasicInfo extends Component {
  renderForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form layout="vertical">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={12}>
            <FormItem label="名称">
              <InputGroup compact>
                <Select defaultValue="1" style={{ width: '40%' }}>
                  <Option value="1">先生</Option>
                  <Option value="2">女士</Option>
                  <Option value="3">学校</Option>
                  <Option value="4">医院</Option>
                </Select>
                {getFieldDecorator('name')(<Input style={{ width: '60%' }} />)}
              </InputGroup>
            </FormItem>
          </Col>
          <Col md={6} sm={12}>
            <FormItem label="移动电话">
              <InputGroup compact>
                <Select defaultValue="+86" style={{ width: '40%' }}>
                  <Option value="+86">+86</Option>
                  <Option value="+00">+00</Option>
                </Select>
                {getFieldDecorator('mobile')(<Input style={{ width: '60%' }} />)}
              </InputGroup>
            </FormItem>
          </Col>
          <Col md={6} sm={12}>
            <FormItem label="邮箱">
              {getFieldDecorator('email')(<Input />)}
            </FormItem>
          </Col>
          <Col md={6} sm={12}>
            <FormItem label="电话">
              <InputGroup compact>
                <Select defaultValue="+86" style={{ width: '30%' }}>
                  <Option value="+86">+86</Option>
                  <Option value="+00">+00</Option>
                </Select>
                <Input style={{ width: '20%' }} />
                {getFieldDecorator('phone')(<Input style={{ width: '30%' }} />)}
                {getFieldDecorator('fenjihao')(<Input style={{ width: '20%' }} />)}
              </InputGroup>
            </FormItem>
          </Col>
          <Col md={6} sm={12}>
            <FormItem label="传真">
              {getFieldDecorator('chuanzhen')(<Input />)}
            </FormItem>
          </Col>
          <Col md={3} sm={6}>
            <FormItem label="邮政编码">
              {getFieldDecorator('youbian')(<Input />)}
            </FormItem>
          </Col>
          <Col md={3} sm={6}>
            <FormItem label="时区">
              {getFieldDecorator('shiqu')(<Input />)}
            </FormItem>
          </Col>
          <Col md={6} sm={12}>
            <FormItem label="语言">
              {getFieldDecorator('yuyan', {
                initValue: 1,
              })(
                <Select>
                  <Option value="1">中文</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={12}>
            <FormItem label="特殊行业类别">
              {getFieldDecorator('hangye')(<Input />)}
            </FormItem>
          </Col>
          <Col md={15} sm={24}>
            <FormItem label="通讯地址">
              <InputGroup compact>
                {getFieldDecorator('address1')(<Cascader options={options} style={{ width: '40%' }} />)}
                {getFieldDecorator('address')(<Input style={{ width: '60%' }} />)}
              </InputGroup>
            </FormItem>
          </Col>
          <Col md={3} sm={6}>
            <FormItem label="销售冻结">
              {getFieldDecorator('dongjie')(<Switch />)}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  };

  render() {
    return (
      <Card title="基础信息" bordered={false} style={{ marginBottom: '24px' }}>
        <div>{this.renderForm()}</div>
      </Card>
    );
  }
}

export default Form.create()(BasicInfo);

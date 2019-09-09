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
  Descriptions,
} from 'antd';
import React, { Component } from 'react';
import { NameInput, MobileTelephoneInput, TelphoneInput, FoxInput, AddressInput } from '@/components/CustomizedFormControls';

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
              {getFieldDecorator('name')(<NameInput />)}
            </FormItem>
          </Col>
          <Col md={6} sm={12}>
            <FormItem label="移动电话">
              {getFieldDecorator('mobile')(<MobileTelephoneInput />)}
            </FormItem>
          </Col>
          <Col md={6} sm={12}>
            <FormItem label="邮箱">
              {getFieldDecorator('email')(<Input />)}
            </FormItem>
          </Col>
          <Col md={6} sm={12}>
            <FormItem label="电话">
              {getFieldDecorator('email')(<TelphoneInput />)}
            </FormItem>
          </Col>
          <Col md={6} sm={12}>
            <FormItem label="传真">
              {getFieldDecorator('chuanzhen')(<FoxInput />)}
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
              {getFieldDecorator('yuyan')(
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
              {getFieldDecorator('address1')(<AddressInput />)}
            </FormItem>
          </Col>
          <Col md={3} sm={6}>
            <FormItem label="销售冻结">
              {getFieldDecorator('dongjie', { valuePropName: 'checked' })(<Switch />)}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  };

  render() {
    return (
      <Card title="基础信息" bordered={false} style={{ marginBottom: '24px' }}>
        {this.renderForm()}
      </Card>
    );
  }
}

export default Form.create()(BasicInfo);

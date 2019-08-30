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
  render() {
    return (
      <Card title="基础信息" bordered={false} style={{ marginBottom: '24px' }}>
        <Descriptions
          layout="vertical"
          column={8}
        >
          <Descriptions.Item span={2} label="名称">张三</Descriptions.Item>
          <Descriptions.Item span={2} label="移动电话">18735818888</Descriptions.Item>
          <Descriptions.Item span={2} label="邮箱">123@qq.com</Descriptions.Item>
          <Descriptions.Item span={2} label="电话">电话123</Descriptions.Item>
          <Descriptions.Item span={2} label="传真">传真123</Descriptions.Item>
          <Descriptions.Item span={1} label="邮政编码">000000</Descriptions.Item>
          <Descriptions.Item span={1} label="时区">UTC+1</Descriptions.Item>
          <Descriptions.Item span={2} label="语言">中文</Descriptions.Item>
          <Descriptions.Item span={2} label="特性行业类别">行业类别123</Descriptions.Item>
          <Descriptions.Item span={6} label="通讯地址">上海市松江区上海市松江区上海市松江区</Descriptions.Item>
          <Descriptions.Item span={2} label="销售冻结">否</Descriptions.Item>
        </Descriptions>
      </Card>
    );
  }
}

export default Form.create()(BasicInfo);

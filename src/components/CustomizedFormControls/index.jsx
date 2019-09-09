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
import React from 'react';

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

// 名称
export function NameInput() {
  return (
    <InputGroup compact>
      <Select defaultValue="1" style={{ width: '40%' }}>
        <Option value="1"><Icon type="user" /> 个人</Option>
        <Option value="2"><Icon type="home" /> 组织</Option>
      </Select>
      <Input style={{ width: '60%' }} />
    </InputGroup>
  );
}

// 移动电话
export function MobileTelephoneInput() {
  return (
    <InputGroup compact>
      <Select defaultValue="+86" style={{ width: '40%' }}>
        <Option value="+86">+86</Option>
        <Option value="+01">+01</Option>
      </Select>
      <Input style={{ width: '60%' }} />
    </InputGroup>
  );
}

// 电话
export function TelphoneInput() {
  return (
    <InputGroup compact>
      <Select defaultValue="+86" style={{ width: '30%' }}>
        <Option value="+86">+86</Option>
        <Option value="+01">+01</Option>
      </Select>
      <Input style={{ width: '20%' }} />
      <Input style={{ width: '30%' }} />
      <Input style={{ width: '20%' }} />
    </InputGroup>
  );
}

// 传真
export function FoxInput() {
  return (
    <InputGroup compact>
      <Select defaultValue="+86" style={{ width: '30%' }}>
        <Option value="+86">+86</Option>
        <Option value="+01">+01</Option>
      </Select>
      <Input style={{ width: '20%' }} />
      <Input style={{ width: '30%' }} />
      <Input style={{ width: '20%' }} />
    </InputGroup>
  );
}

// 地址
export function AddressInput() {
  return (
    <InputGroup compact>
      <Cascader options={options} style={{ width: '40%' }} />
      <Input style={{ width: '60%' }} />
    </InputGroup>
  );
}

import {
  Icon,
  Input,
  Select,
  Cascader,
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
export class NameInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
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
}

// 移动电话
export class MobileTelephoneInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
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
}

// 电话
export class TelphoneInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
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
}

// 传真
export class FoxInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
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
}

// 地址
export class AddressInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <InputGroup compact>
        <Cascader options={options} style={{ width: '40%' }} />
        <Input style={{ width: '60%' }} />
      </InputGroup>
    );
  }
}

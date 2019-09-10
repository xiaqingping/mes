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
  static getDerivedStateFromProps(nextProps) {
    if ('value' in nextProps) {
      return {
        ...(nextProps.value || {}),
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    const value = props.value || {};
    this.state = {
      select: value.select || 1,
      name: value.name || '',
    };
  }

  selectChange = select => {
    if (!('value' in this.props)) {
      this.setState({ select });
    }
    this.triggerChange({ select });
  }

  nameChange = e => {
    const name = e.target.value;
    if (!('value' in this.props)) {
      this.setState({ name });
    }
    this.triggerChange({ name });
  }

  triggerChange = changedValue => {
    const { onChange } = this.props;
    if (onChange) {
      onChange({
        ...this.state,
        ...changedValue,
      });
    }
  };

  render() {
    const { select, name } = this.state;
    return (
      <InputGroup compact>
        <Select value={select} style={{ width: '40%' }} onChange={this.selectChange}>
          <Option value={1}><Icon type="user" /> 个人</Option>
          <Option value={2}><Icon type="home" /> 组织</Option>
        </Select>
        <Input value={name} style={{ width: '60%' }} onChange={this.nameChange} />
      </InputGroup>
    );
  }
}

// 移动电话
export class MobileTelephoneInput extends React.Component {
  static getDerivedStateFromProps(nextProps) {
    if ('value' in nextProps) {
      return {
        ...(nextProps.value || {}),
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    const value = props.value || {};
    this.state = {
      area: value.area || '+86',
      code: value.code || '',
    };
  }

  areaChange = area => {
    if (!('value' in this.props)) {
      this.setState({ area });
    }
    this.triggerChange({ area });
  }

  codeChange = e => {
    const code = e.target.value;
    if (!('value' in this.props)) {
      this.setState({ code });
    }
    this.triggerChange({ code });
  }

  triggerChange = changedValue => {
    const { onChange } = this.props;
    if (onChange) {
      onChange({
        ...this.state,
        ...changedValue,
      });
    }
  };

  render() {
    const { area, code } = this.state;
    return (
      <InputGroup compact>
        <Select value={area} style={{ width: '40%' }} onChange={this.areaChange}>
          <Option value="+86">+86</Option>
          <Option value="+01">+01</Option>
        </Select>
        <Input value={code} style={{ width: '60%' }} onChange={this.codeChange} />
      </InputGroup>
    );
  }
}

// 电话
export class TelphoneInput extends React.Component {
  static getDerivedStateFromProps(nextProps) {
    if ('value' in nextProps) {
      return {
        ...(nextProps.value || {}),
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    const value = props.value || {};
    this.state = {
      area: value.area || '+86',
      provincial: value.provincial || '',
      code: value.code || '',
      extension: value.extension || '',
    };
  }

  valueChange = (key, value) => {
    if (!('value' in this.props)) {
      this.setState({ [key]: value });
    }
    this.triggerChange({ [key]: value });
  }

  triggerChange = changedValue => {
    const { onChange } = this.props;
    if (onChange) {
      onChange({
        ...this.state,
        ...changedValue,
      });
    }
  };

  render() {
    const { area, provincial, code, extension } = this.state;
    return (
      <InputGroup compact>
        <Select value={area} style={{ width: '30%' }} onChange={val => this.valueChange('area', val)}>
          <Option value="+86">+86</Option>
          <Option value="+01">+01</Option>
        </Select>
        <Input value={provincial} style={{ width: '20%' }} onChange={e => this.valueChange('provincial', e.target.value)}/>
        <Input value={code} style={{ width: '30%' }} onChange={e => this.valueChange('code', e.target.value)}/>
        <Input value={extension} style={{ width: '20%' }} onChange={e => this.valueChange('extension', e.target.value)}/>
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

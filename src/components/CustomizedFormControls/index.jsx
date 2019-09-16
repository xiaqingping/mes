import {
  Icon,
  Input,
  Select,
  Cascader,
  AutoComplete,
} from 'antd';
import React from 'react';

const InputGroup = Input.Group;
const { Option } = Select;
const options = [
  {
    value: '浙江',
    label: '浙江',
    children: [
      {
        value: '杭州',
        label: '杭州',
        children: [
          {
            value: '西湖',
            label: '西湖',
          },
        ],
      },
    ],
  },
  {
    value: '江苏',
    label: '江苏',
    children: [
      {
        value: '南京',
        label: '南京',
        children: [
          {
            value: '中华门',
            label: '中华门',
          },
        ],
      },
    ],
  },
];

// TODO: 是否可以用高阶组件组件包裹
function formControl (WrappedComponent) {
  return class extends React.Component {
    static getDerivedStateFromProps(nextProps) {
      if ('value' in nextProps) {
        return {
          ...nextProps.value,
        };
      }
      return null;
    }

    constructor(props) {
      super(props);
      this.state = {
        ...props.value,
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
      return <WrappedComponent data={this.state.data} {...this.props} />;
    }
  }
}

// Email
export class EmailInput extends React.Component {
  static getDerivedStateFromProps(nextProps) {
    if ('value' in nextProps) {
      return {
        email: nextProps.value.email || '',
        dataSource: nextProps.value.dataSource || [],
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      email: props.value,
      dataSource: [],
    };
  }

  valueChange = (key, value) => {
    let dataSource = [];
    const suffix = [
      'qq.com',
      'gmail.com',
      '163.com',
    ];
    if (!value || value.indexOf('@') >= 0) {
      dataSource = [];
    } else {
      dataSource = suffix.map(domain => `${value}@${domain}`);
    }

    if (!('value' in this.props)) {
      this.setState({
        [key]: value,
        dataSource,
      });
    }
    this.triggerChange({
      [key]: value,
      dataSource,
    });
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
    const { email, dataSource = [] } = this.state;

    return (
      <AutoComplete
        value={email}
        dataSource={dataSource}
        onChange={val => this.valueChange('email', val)}
      />
    );
  }
}

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
    const { select, name } = this.state;
    return (
      <InputGroup compact>
        <Select value={select} style={{ width: '40%' }} onChange={val => this.valueChange('select', val)}>
          <Option value={1}><Icon type="user" /> 个人</Option>
          <Option value={2}><Icon type="home" /> 组织</Option>
        </Select>
        <Input value={name} style={{ width: '60%' }} onChange={e => this.valueChange('name', e.target.value)} />
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
      disabled: value.disabled,
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
    const { area, code, disabled } = this.state;
    return (
      <InputGroup compact>
        <Select disabled={disabled} value={area} style={{ width: '40%' }} onChange={val => this.valueChange('area', val)}>
          <Option value="+86">+86</Option>
          <Option value="+01">+01</Option>
        </Select>
        <Input disabled={disabled} value={code} style={{ width: '60%' }} onChange={e => this.valueChange('code', e.target.value)} />
      </InputGroup>
    );
  }
}

// 电话 & 传真
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

// 地址
export class AddressInput extends React.Component {
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
      cascader: value.cascader || ['浙江', '杭州', '西湖'],
      address: value.address || '',
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
    const { address, cascader } = this.state;
    return (
      <InputGroup compact>
        <Cascader value={cascader} options={options} style={{ width: '40%' }} onChange={value => this.valueChange('cascader', value)} />
        <Input value={address} style={{ width: '60%' }} onChange={e => this.valueChange('address', e.target.value)} />
      </InputGroup>
    );
  }
}

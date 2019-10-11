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

  valueChange = changedValue => {
    const { onChange } = this.props;
    let dataSource = [];
    const suffix = [
      'qq.com',
      'gmail.com',
      '163.com',
    ];

    if (!changedValue.email || changedValue.email.indexOf('@') >= 0) {
      dataSource = [];
    } else {
      dataSource = suffix.map(domain => `${changedValue.email}@${domain}`);
    }

    if (onChange) {
      onChange({
        ...this.state,
        dataSource,
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
        onChange={val => this.valueChange({ email: val })}
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
      type: value.type || 1,
      name: value.name || '',
    };
  }

  valueChange = changedValue => {
    const { onChange } = this.props;
    if (onChange) {
      onChange({
        ...this.state,
        ...changedValue,
      });
    }
  };

  render() {
    const { type, name } = this.state;
    return (
      <InputGroup compact>
        <Select value={type} style={{ width: '40%' }} onChange={val => this.valueChange({ type: val })}>
          <Option value={1}><Icon type="user" /> 个人</Option>
          <Option value={2}><Icon type="home" /> 组织</Option>
        </Select>
        <Input value={name} style={{ width: '60%' }} onChange={e => this.valueChange({ name: e.target.value })} />
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
      mobilePhoneCountryCode: value.mobilePhoneCountryCode || '+86',
      mobilePhone: value.mobilePhone || '',
      disabled: value.disabled,
    };
  }

  valueChange = changedValue => {
    const { onChange } = this.props;
    if (onChange) {
      onChange({
        ...this.state,
        ...changedValue,
      });
    }
  };

  render() {
    const { mobilePhoneCountryCode, mobilePhone, disabled } = this.state;
    return (
      <InputGroup compact>
        <Select disabled={disabled} value={mobilePhoneCountryCode} style={{ width: '40%' }} onChange={val => this.valueChange({ mobilePhoneCountryCode: val })}>
          <Option value="+86">+86</Option>
          <Option value="+01">+01</Option>
        </Select>
        <Input disabled={disabled} value={mobilePhone} style={{ width: '60%' }} onChange={e => this.valueChange({ mobilePhone: e.target.value })} />
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
      telephoneCountryCode: value.telephoneCountryCode || '+86',
      provincial: value.provincial || '',
      telephone: value.telephone || '',
      telephoneExtension: value.telephoneExtension || '',
    };
  }

  valueChange = changedValue => {
    const { onChange } = this.props;
    if (onChange) {
      onChange({
        ...this.state,
        ...changedValue,
      });
    }
  };

  render() {
    const { telephoneCountryCode, provincial, telephone, telephoneExtension } = this.state;
    return (
      <InputGroup compact>
        <Select value={telephoneCountryCode} style={{ width: '30%' }} onChange={val => this.valueChange({ telephoneCountryCode: val })}>
          <Option value="+86">+86</Option>
          <Option value="+01">+01</Option>
        </Select>
        <Input value={provincial} style={{ width: '20%' }} onChange={e => this.valueChange({ provincial: e.target.value })}/>
        <Input value={telephone} style={{ width: '30%' }} onChange={e => this.valueChange({ telephone: e.target.value })}/>
        <Input value={telephoneExtension} style={{ width: '20%' }} onChange={e => this.valueChange({ telephoneExtension: e.target.value })}/>
      </InputGroup>
    );
  }
}

// 传真
export class FaxInput extends React.Component {
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
      faxCountryCode: value.faxCountryCode || '+86',
      provincial: value.provincial || '',
      fax: value.fax || '',
      faxExtension: value.faxExtension || '',
    };
  }

  valueChange = changedValue => {
    const { onChange } = this.props;
    if (onChange) {
      onChange({
        ...this.state,
        ...changedValue,
      });
    }
  };

  render() {
    const { faxCountryCode, provincial, fax, faxExtension } = this.state;
    return (
      <InputGroup compact>
        <Select value={faxCountryCode} style={{ width: '30%' }} onChange={val => this.valueChange({ faxCountryCode: val })}>
          <Option value="+86">+86</Option>
          <Option value="+01">+01</Option>
        </Select>
        <Input value={provincial} style={{ width: '20%' }} onChange={e => this.valueChange({ provincial: e.target.value })}/>
        <Input value={fax} style={{ width: '30%' }} onChange={e => this.valueChange({ fax: e.target.value })}/>
        <Input value={faxExtension} style={{ width: '20%' }} onChange={e => this.valueChange({ faxExtension: e.target.value })}/>
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

  valueChange = changedValue => {
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
        <Cascader value={cascader} options={options} style={{ width: '40%' }} onChange={value => this.valueChange({ cascader: value })} />
        <Input value={address} style={{ width: '60%' }} onChange={e => this.valueChange({ address: e.target.value })} />
      </InputGroup>
    );
  }
}

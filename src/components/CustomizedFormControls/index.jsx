import {
  Icon,
  Input,
  Select,
  Cascader,
  AutoComplete,
} from 'antd';
import React from 'react';
import { connect } from 'dva';

import area from '@/api/area';

const InputGroup = Input.Group;
const { Option } = Select;

// Email
export class EmailInput extends React.Component {
  static getDerivedStateFromProps(nextProps) {
    if ('value' in nextProps) {
      return {
        email: nextProps.value.email || '',
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

    this.setState({ dataSource });
    const { dataSource: dataList, ...newState } = this.state;

    if (onChange) {
      onChange({
        ...newState,
        ...changedValue,
      });
    }
  };

  render() {
    const { email, dataSource } = this.state;

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
      type: value.type || '',
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
@connect(({ basicCache }) => ({
  countryDiallingCodes: basicCache.countryDiallingCodes,
}))
export class MobilePhoneInput extends React.Component {
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
      mobilePhoneCountryCode: value.mobilePhoneCountryCode || '',
      mobilePhone: value.mobilePhone || '',
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
    const { mobilePhoneCountryCode, mobilePhone } = this.state;
    const { countryDiallingCodes } = this.props;

    return (
      <InputGroup compact>
        <Select
          style={{ width: '40%' }}
          value={mobilePhoneCountryCode}
          onChange={val => this.valueChange({ mobilePhoneCountryCode: val })}
          showSearch
          filterOption={(input, option) => option.props.children[1].indexOf(input) >= 0}
        >
          {
            countryDiallingCodes.map(e => (
              <Option
                key={e.countryCode}
                value={e.countryCode}
              >
                <div className="select-countryPic-box" style={{ backgroundImage: `url(/images/country/${e.countryCode}.png)` }}>&nbsp;</div>
                {`+${e.diallingCode}`}
              </Option>
            ))
          }
        </Select>
        <Input value={mobilePhone} style={{ width: '60%' }} onChange={e => this.valueChange({ mobilePhone: e.target.value })} />
      </InputGroup>
    );
  }
}

// 电话
@connect(({ basicCache }) => ({
  countryDiallingCodes: basicCache.countryDiallingCodes,
}))
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
      telephoneCountryCode: value.telephoneCountryCode || '',
      telephoneAreaCode: value.telephoneAreaCode || '',
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
    const { telephoneCountryCode, telephoneAreaCode, telephone, telephoneExtension } = this.state;
    const { countryDiallingCodes } = this.props;
    return (
      <InputGroup compact>
        <Select
          value={telephoneCountryCode}
          style={{ width: '30%' }}
          onChange={val => this.valueChange({ telephoneCountryCode: val })}
          showSearch
          filterOption={(input, option) => option.props.children[1].indexOf(input) >= 0}
        >
          {
            countryDiallingCodes.map(e => (
              <Option
                key={e.countryCode}
                value={e.countryCode}
              >
                <div className="select-countryPic-box" style={{ backgroundImage: `url(/images/country/${e.countryCode}.png)` }}>&nbsp;</div>
                {`+${e.diallingCode}`}
              </Option>
            ))
          }
        </Select>
        <Input value={telephoneAreaCode} style={{ width: '20%' }} onChange={e => this.valueChange({ telephoneAreaCode: e.target.value })}/>
        <Input value={telephone} style={{ width: '30%' }} onChange={e => this.valueChange({ telephone: e.target.value })}/>
        <Input value={telephoneExtension} style={{ width: '20%' }} onChange={e => this.valueChange({ telephoneExtension: e.target.value })}/>
      </InputGroup>
    );
  }
}

// 传真
@connect(({ basicCache }) => ({
  countryDiallingCodes: basicCache.countryDiallingCodes,
}))
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
      faxAreaCode: value.faxAreaCode || '',
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
    const { faxCountryCode, faxAreaCode, fax, faxExtension } = this.state;
    const { countryDiallingCodes } = this.props;
    return (
      <InputGroup compact>
        <Select
          value={faxCountryCode}
          style={{ width: '30%' }}
          onChange={val => this.valueChange({ faxCountryCode: val })}
          showSearch
          filterOption={(input, option) => option.props.children[1].indexOf(input) >= 0}
        >
          {
            countryDiallingCodes.map(e => (
              <Option
                key={e.countryCode}
                value={e.countryCode}
              >
                <div className="select-countryPic-box" style={{ backgroundImage: `url(/images/country/${e.countryCode}.png)` }}>&nbsp;</div>
                {`+${e.diallingCode}`}
              </Option>
            ))
          }
        </Select>
        <Input value={faxAreaCode} style={{ width: '20%' }} onChange={e => this.valueChange({ faxAreaCode: e.target.value })}/>
        <Input value={fax} style={{ width: '30%' }} onChange={e => this.valueChange({ fax: e.target.value })}/>
        <Input value={faxExtension} style={{ width: '20%' }} onChange={e => this.valueChange({ faxExtension: e.target.value })}/>
      </InputGroup>
    );
  }
}

// 地址
@connect(({ areaCache }) => {
  const { countrys } = areaCache;
  return { countrys };
})
export class AddressInput extends React.Component {
  static getDerivedStateFromProps(nextProps, preState) {
    const countrys = (
      (preState.countrys && preState.countrys.length > 0 && preState.countrys)
      || nextProps.countrys);
    const { changedValue } = preState;

    if ('value' in nextProps) {
      return {
        ...(nextProps.value || {}),
        countrys,
        changedValue,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    const value = props.value || {};
    this.state = {
      ...value,
      countrys: [],
      changedValue: {},
    };
  }

  valueChange = changedValue => {
    let obj = changedValue;

    if (Object.keys(changedValue).indexOf('cascader') > -1) {
      const { option } = changedValue;
      obj = {
        countryCode: (option[0] && option[0].code) || '',
        countryName: (option[0] && option[0].name) || '',
        provinceCode: (option[1] && option[1].code) || '',
        provinceName: (option[1] && option[1].name) || '',
        cityCode: (option[2] && option[2].code) || '',
        cityName: (option[2] && option[2].name) || '',
        countyCode: (option[3] && option[3].code) || '',
        countyName: (option[3] && option[3].name) || '',
        streetCode: (option[4] && option[4].code) || '',
        streetName: (option[4] && option[4].name) || '',
      };
    }

    const { onChange } = this.props;
    const { countrys, ...otherState } = this.state;

    if (onChange) {
      onChange({
        ...otherState,
        changedValue,
        ...obj,
      });
    }
  };

  loadData = selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    if (targetOption.children) return;
    targetOption.loading = true;

    area.byParentIdGetArea(targetOption.id).then(res => {
      targetOption.loading = false;
      targetOption.children = res;
      this.setState({
        // eslint-disable-next-line react/no-access-state-in-setstate
        countrys: [...this.state.countrys],
      });
    });
  }

  render() {
    const {
      address,
      countryCode,
      provinceCode,
      cityCode,
      countyCode,
      streetCode,
    } = this.state;
    const cascader = [countryCode, provinceCode, cityCode, countyCode, streetCode];
    return (
      <InputGroup compact>
        <Cascader
          value={cascader}
          fieldNames={{ label: 'name', value: 'code', children: 'children' }}
          options={this.state.countrys}
          loadData={this.loadData}
          style={{ width: '40%' }}
          onChange={(value, option) => this.valueChange({ cascader: value, option })}
          changeOnSelect
        />
        <Input value={address} style={{ width: '60%' }} onChange={e => this.valueChange({ address: e.target.value })} />
      </InputGroup>
    );
  }
}

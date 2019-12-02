/**
 * 基础信息
 */
import { Icon, Col, Form, Input, Row, Select, Switch, Card } from 'antd';
import React from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import {
  EmailInput,
  NameInput,
  MobilePhoneInput,
  TelphoneInput,
  FaxInput,
  AddressInput,
} from '@/components/CustomizedFormControls';
import debounce from 'lodash/debounce';
import bp from '@/api/bp';
import styles from '../style.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(
  ({ partnerMaintainEdit, basicCache, bpEdit }) => {
    // 1. 业务伙伴数据
    const { editType } = bpEdit;
    const oldDetails = bpEdit.oldDetails || {};
    const details = bpEdit.details || {};
    const basicInfo = details.basic || {};
    const customer = details.customer || {};
    const salesOrderBlock = customer.salesOrderBlock || 2;
    const vendor = details.vendor || {};
    const invoicePostBlock = vendor.invoicePostBlock || 2;
    const { organizationCertification } = details;

    // 2. 基础数据
    // 行业类别
    // const industryCategories = basicCache.industryCategories.filter(
    //   e => e.languageCode === global.languageCode,
    // );
    const industryCategories = partnerMaintainEdit.Industry;

    return {
      oldDetails,
      editType,
      details,
      basic: basicInfo,
      customer,
      salesOrderBlock,
      vendor,
      invoicePostBlock,
      organizationCertification,
      industryCategories,
      countryTimeZone: basicCache.countryTimeZone,
      countryProvinceTimeZone: basicCache.countryProvinceTimeZone,
    };
  },
  null,
  null,
  { withRef: true },
)
class Basic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      industrySelectOpen: true,
    };
    // 异步验证做节流处理
    this.checkNameInput = debounce(this.checkNameInput, 500);
    this.checkEmail = debounce(this.checkEmail, 500);
    this.checkMobilePhone = debounce(this.checkMobilePhone, 500);
    this.checkAddress = debounce(this.checkAddress, 500);
    this.checkTelePhone = debounce(this.checkTelePhone, 500);
  }

  checkNameInput = (rule, value, callback) => {
    if (!value.name) {
      callback('名称必须');
      return;
    }

    bp.checkBPFields({ name: value.name }).then(res => {
      if (!res) {
        callback();
      } else {
        callback('名称重复');
      }
    });
  };

  checkEmail = (rule, value, callback) => {
    const { basic } = this.props;
    // 没有邮箱
    // 1）个人 必须
    // 2）组织 无所谓
    if (!value.email) {
      if (basic.type === 1) {
        callback('邮箱必填');
        return;
      }
      callback();
      return;
    }

    if (this.props.editType === 'update') {
      const oldEmail = this.props.oldDetails.basic.email;
      if (value.email === oldEmail) {
        callback();
        return;
      }
    }

    bp.checkBPFields({ email: value.email })
      .then(res => {
        if (!res) {
          callback();
        } else {
          callback('邮箱重复');
        }
      })
      .catch(() => callback('接口验证失败'));
  };

  checkMobilePhone = (rule, value, callback) => {
    const { basic } = this.props;
    // 没有移动电话
    // 1）个人 必须
    // 2）组织 无所谓
    if (!value.mobilePhone) {
      if (basic.type === 1) {
        callback('移动电话必填');
        return;
      }
      callback();
      return;
    }

    // 修改时业务伙伴时，并且电话号码===旧电话号码（没有修改），则不进行后台验证
    if (this.props.editType === 'update') {
      const oldMobilePhone = this.props.oldDetails.basic.mobilePhone;
      if (value.mobilePhone === oldMobilePhone) {
        callback();
        return;
      }
    }

    bp.checkBPFields({ mobilePhone: value.mobilePhone })
      .then(res => {
        if (!res) {
          callback();
        } else {
          callback('移动电话重复');
        }
      })
      .catch(() => callback('验证失败'));
  };

  checkTelePhone = (rule, value, callback) => {
    const { basic } = this.props;
    // 没有电话
    // 1）组织 必须
    // 2）个人 无所谓
    if (!value.telephone) {
      if (basic.type === 2) {
        callback('电话必填');
        return;
      }
      callback();
    }
  };

  checkAddress = (rule, value, callback) => {
    const { address, changedValue = {} } = value;
    const { option = [] } = changedValue;
    if (option.length > 0) {
      const last = option[option.length - 1];
      if (last.isMustLow === 1 && last.level !== 5) {
        callback('必须选择下一级');
        return;
      }
    }
    if (!address) {
      callback('详细地址必填');
      return;
    }
    callback();
  };

  valueChange = (key, value) => {
    const { details, basic, customer, vendor, organizationCertification } = this.props;
    let obj = {
      [key]: value,
    };

    // 名字-类型为个人时，行业类别为个人，且不可更改
    if (key === 'name') {
      if (value.type === 1) {
        obj.name.industryCode = '06';
        this.setState({ industrySelectOpen: true });
      } else {
        if (basic.industryCode === '06') obj.name.industryCode = '';
        this.setState({ industrySelectOpen: true });
      }
    }

    // 地址 决定了语言和时区
    if (key === 'address') {
      obj.timeZoneCode = '';
      // 根据国家编号确定时区
      if (value.countryCode) {
        this.props.countryTimeZone.forEach(e => {
          if (e.countryCode === value.countryCode) {
            obj.timeZoneCode = e.timeZone;
          }
        });
      }
      // 根据省编号确定时区
      if (value.provinceCode) {
        this.props.countryProvinceTimeZone.forEach(e => {
          if (e.countryCode === value.countryCode && e.provinceCode === value.provinceCode) {
            obj.timeZoneCode = e.timeZone;
          }
        });
      }

      // 确定语言
      if (value.countryName === '中国') {
        obj.languageCode = 'ZH';
      } else if (value.countryName && value.countryName !== '中国') {
        obj.languageCode = 'EN';
      } else {
        obj.languageCode = '';
      }
    }

    // 销售冻结
    if (key === 'salesOrderBlock') {
      // eslint-disable-next-line no-unused-expressions
      value ? (obj[key] = 1) : (obj[key] = 2);
      const newCustomer = { ...customer, ...obj };

      this.props.dispatch({
        type: 'bpEdit/setState',
        payload: {
          type: 'details',
          data: { ...details, ...{ customer: newCustomer } },
        },
      });
      return;
    }

    // 采购冻结
    if (key === 'invoicePostBlock') {
      // eslint-disable-next-line no-unused-expressions
      value ? (obj[key] = 1) : (obj[key] = 2);
      const newVendor = { ...vendor, ...obj };

      this.props.dispatch({
        type: 'bpEdit/setState',
        payload: {
          type: 'details',
          data: { ...details, ...{ vendor: newVendor } },
        },
      });
      return;
    }

    const keyList = ['name', 'mobilePhone', 'telephone', 'fax', 'email', 'address'];
    if (keyList.indexOf(key) > -1) {
      if (key === 'address') {
        obj = { ...value, languageCode: obj.languageCode, timeZoneCode: obj.timeZoneCode };
      } else {
        obj = value;
      }
    }

    const newBasic = { ...basic, ...obj };
    let newDetails = { ...details, ...{ basic: newBasic } };

    // 电话 类型为组织时，认证资料的电话与基础信息的电话保持一致
    if (key === 'telephone') {
      newDetails = {
        ...newDetails,
        ...{ organizationCertification: { ...organizationCertification, ...value } },
      };
    }

    this.props.dispatch({
      type: 'bpEdit/setState',
      payload: {
        type: 'details',
        data: newDetails,
      },
    });
  };

  renderTelephone = () => {
    const { form, editType, basic } = this.props;
    const { getFieldDecorator } = form;

    const edit = getFieldDecorator('telephone', {
      initialValue: {
        telephoneCountryCode: basic.telephoneCountryCode,
        telephoneAreaCode: basic.telephoneAreaCode,
        telephone: basic.telephone,
        telephoneExtension: basic.telephoneExtension,
      },
      rules: [{ validator: this.checkTelePhone }],
    })(<TelphoneInput onChange={value => this.valueChange('telephone', value)} />);

    const show = (
      <p style={{ lineHeight: '32px' }}>
        <span>{basic.telephoneCountryCode} </span>
        {`${basic.telephoneAreaCode}-${basic.telephone}-${basic.telephoneExtension}`}
        <a href="#">
          {' '}
          <FormattedMessage id="bp.maintain_details.change" />
        </a>
      </p>
    );

    // 编辑状态
    // 1）页面状态为：新增
    // 2）页面状态为：修改 并且 BP类型为人员
    if (editType === 'add' || (editType === 'update' && basic.type === 1)) {
      return edit;
    }
    // 非编辑状态
    if (editType === 'update') {
      return show;
    }
    return null;
  };

  render() {
    const {
      form: { getFieldDecorator },
      editType,
      basic,
      tabActiveKey,
      salesOrderBlock,
      invoicePostBlock,
      industryCategories,
    } = this.props;
    const { industrySelectOpen } = this.state;
    const industryOption = {};
    if (!industrySelectOpen) industryOption.open = industrySelectOpen;

    return (
      <Card
        title={formatMessage({ id: 'bp.maintain_details.basic' })}
        bordered={false}
        style={{ marginBottom: '24px' }}
      >
        <Form layout="vertical" className={styles.sangonForm}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={6} sm={12}>
              <FormItem label={formatMessage({ id: 'bp.maintain_details.name' })}>
                {editType === 'add'
                  ? getFieldDecorator('name', {
                      initialValue: {
                        type: basic.type,
                        name: basic.name,
                      },
                      rules: [{ validator: this.checkNameInput }],
                    })(<NameInput onChange={value => this.valueChange('name', value)} />)
                  : null}
                {editType === 'update' ? (
                  <p style={{ lineHeight: '32px' }}>
                    {basic.type === 1 ? (
                      <span>
                        <Icon type="user" />
                        &nbsp;个人
                      </span>
                    ) : null}
                    {basic.type === 2 ? (
                      <span>
                        <Icon type="home" />
                        组织
                      </span>
                    ) : null}
                    <span> {basic.name} </span>
                    <a href="#">
                      <FormattedMessage id="bp.maintain_details.change" />
                    </a>
                  </p>
                ) : null}
              </FormItem>
            </Col>
            <Col md={6} sm={12}>
              <FormItem label={formatMessage({ id: 'bp.maintain_details.mobile_phone' })}>
                {getFieldDecorator('mobilePhone', {
                  initialValue: {
                    mobilePhoneCountryCode: basic.mobilePhoneCountryCode,
                    mobilePhone: basic.mobilePhone,
                  },
                  rules: [{ validator: this.checkMobilePhone }],
                })(<MobilePhoneInput onChange={value => this.valueChange('mobilePhone', value)} />)}
              </FormItem>
            </Col>
            <Col md={6} sm={12}>
              <FormItem label={formatMessage({ id: 'bp.maintain_details.basic.email' })}>
                {getFieldDecorator('email', {
                  initialValue: { email: basic.email },
                  rules: [{ validator: this.checkEmail }],
                })(<EmailInput onChange={value => this.valueChange('email', value)} />)}
              </FormItem>
            </Col>
            <Col md={6} sm={12}>
              <FormItem label={formatMessage({ id: 'bp.maintain_details.phone' })}>
                {this.renderTelephone(basic)}
              </FormItem>
            </Col>
            <Col md={6} sm={12}>
              <FormItem label={formatMessage({ id: 'bp.maintain_details.basic.fax' })}>
                {getFieldDecorator('fax', {
                  initialValue: {
                    faxCountryCode: basic.faxCountryCode,
                    faxAreaCode: basic.faxAreaCode,
                    fax: basic.fax,
                    faxExtension: basic.faxExtension,
                  },
                })(<FaxInput onChange={value => this.valueChange('fax', value)} />)}
              </FormItem>
            </Col>
            <Col md={3} sm={6}>
              <FormItem label={formatMessage({ id: 'bp.maintain_details.postal_code' })}>
                {getFieldDecorator('postCode', {
                  initialValue: basic.postCode,
                  rules: [{ pattern: /^\d+$/, message: '必须数字' }],
                })(<Input onChange={e => this.valueChange('postCode', e.target.value)} />)}
              </FormItem>
            </Col>
            <Col md={3} sm={6}>
              <FormItem label={formatMessage({ id: 'bp.maintain_details.basic.time_zone' })}>
                {getFieldDecorator('timeZoneCode', {
                  initialValue: basic.timeZoneCode,
                })(
                  <Input
                    readOnly
                    onChange={e => this.valueChange('timeZoneCode', e.target.value)}
                  />,
                )}
              </FormItem>
            </Col>
            <Col md={6} sm={12}>
              <FormItem label={formatMessage({ id: 'bp.maintain_details.basic.language' })}>
                {getFieldDecorator('languageCode', {
                  initialValue: basic.languageCode,
                })(
                  <Select open={false} onChange={value => this.valueChange('languageCode', value)}>
                    <Option value="ZH">中文</Option>
                    <Option value="EN">英文</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col md={6} sm={12}>
              <FormItem label={formatMessage({ id: 'bp.maintain_details.basic.business_type' })}>
                {getFieldDecorator('industryCode', {
                  initialValue: basic.industryCode,
                })(
                  <Select
                    {...industryOption}
                    onChange={value => this.valueChange('industryCode', value)}
                  >
                    {industryCategories.map(e => {
                      if (basic.type === 1) {
                        if (e.id !== '06') {
                          return (
                            <Option disabled key={e.id} value={e.id}>
                              {e.name}
                            </Option>
                          );
                        }
                        return (
                          <Option key={e.id} value={e.id}>
                            {e.name}
                          </Option>
                        );
                      }
                      if (basic.type === 2) {
                        if (e.id === '06') {
                          return (
                            <Option disabled key={e.id} value={e.id}>
                              {e.name}
                            </Option>
                          );
                        }
                        return (
                          <Option key={e.id} value={e.id}>
                            {e.name}
                          </Option>
                        );
                      }
                      return (
                        <Option key={e.id} value={e.id}>
                          {e.name}
                        </Option>
                      );
                    })}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col md={18} sm={24}>
              <FormItem label={formatMessage({ id: 'bp.maintain_details.basic.address' })}>
                {getFieldDecorator('address', {
                  rules: [{ validator: this.checkAddress }],
                  initialValue: {
                    countryCode: basic.countryCode,
                    provinceCode: basic.provinceCode,
                    cityCode: basic.cityCode,
                    countyCode: basic.countyCode,
                    streetCode: basic.streetCode,
                    address: basic.address,
                  },
                })(<AddressInput onChange={value => this.valueChange('address', value)} />)}
              </FormItem>
            </Col>
            {tabActiveKey === 'customer' ? (
              <Col md={6} sm={6}>
                <FormItem
                  label={formatMessage({
                    id: 'bp.maintain_details.sales_distribution.sales_block',
                  })}
                >
                  {getFieldDecorator('salesOrderBlock', {
                    initialValue: salesOrderBlock === 1,
                    valuePropName: 'checked',
                  })(<Switch onChange={value => this.valueChange('salesOrderBlock', value)} />)}
                </FormItem>
              </Col>
            ) : null}
            {tabActiveKey === 'vendor' ? (
              <Col md={6} sm={6}>
                <FormItem
                  label={formatMessage({
                    id: 'bp.maintain_details.purchase_org.procurement_block',
                  })}
                >
                  {getFieldDecorator('invoicePostBlock', {
                    initialValue: invoicePostBlock === 1,
                    valuePropName: 'checked',
                  })(<Switch onChange={value => this.valueChange('invoicePostBlock', value)} />)}
                </FormItem>
              </Col>
            ) : null}
          </Row>
        </Form>
      </Card>
    );
  }
}

export default Form.create()(Basic);

import {
  Col,
  Form,
  Input,
  Row,
  Select,
  Switch,
  Card,
} from 'antd';
import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import {
  EmailInput,
  NameInput,
  MobilePhoneInput,
  TelphoneInput,
  FaxInput,
  AddressInput,
} from '@/components/CustomizedFormControls';
import _ from 'lodash';
import bp from '@/api/bp';
import styles from '../style.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ partnerMaintainEdit, basicCache, bpEdit }) => {
  // 1. 业务伙伴数据
  const { editType } = bpEdit;
  const details = bpEdit.details || {};
  const basicInfo = details.basic || {};
  const customer = details.customer || {};
  const salesOrderBlock = customer.salesOrderBlock || 2;
  const vendor = details.vendor || {};
  const invoicePostBlock = vendor.invoicePostBlock || 2;

  // 2. 基础数据
  // 行业类别
  // const industryCategories = basicCache.industryCategories.filter(
  //   e => e.languageCode === global.languageCode,
  // );
  const industryCategories = partnerMaintainEdit.Industry;

  return {
    editType,
    details,
    basic: basicInfo,
    customer,
    salesOrderBlock,
    vendor,
    invoicePostBlock,
    industryCategories,
    countryTimeZone: basicCache.countryTimeZone,
    countryProvinceTimeZone: basicCache.countryProvinceTimeZone,
  };
}, null, null, { withRef: true })
class Basic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      industrySelectOpen: true,
    };
    // 异步验证做节流处理
    this.checkNameInput = _.debounce(this.checkNameInput, 500);
    this.checkEmail = _.debounce(this.checkEmail, 500);
    this.checkMobilePhone = _.debounce(this.checkMobilePhone, 500);
  }

  // validate = () => {
  //   const { form } = this.props;
  //   form.validateFieldsAndScroll((error, values) => {
  //     console.log(values);
  //     if (!error) {
  //       //
  //     }
  //   });
  // }

  checkNameInput = (rule, value, callback) => {
    if (!value.name) {
      callback(formatMessage({ id: 'partner.maintain.requireName' }));
      return;
    }

    bp.checkBPFields({ name: value.name }).then(res => {
      if (!res) {
        callback();
      } else {
        callback('名称重复');
      }
    });
  }

  checkEmail = (rule, value, callback) => {
    if (!value.email) {
      callback('邮箱必填');
      return;
    }

    bp.checkBPFields({ email: value.email }).then(res => {
      if (!res) {
        callback();
      } else {
        callback('邮箱重复');
      }
    });
  }

  checkMobilePhone = (rule, value, callback) => {
    if (!value.mobilePhone) {
      callback('移动电话必填');
      return;
    }

    bp.checkBPFields({ mobilePhone: value.mobilePhone }).then(res => {
      if (!res) {
        callback();
      } else {
        callback('移动电话重复');
      }
    });
  }

  valueChange = (key, value) => {
    const { details, basic, customer, vendor } = this.props;
    let obj = {
      [key]: value,
    }

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

    const keyList = [
      'name',
      'mobilePhone',
      'telephone',
      'fax',
      'email',
      'address',
    ]
    if (keyList.indexOf(key) > -1) {
      if (key === 'address') {
        obj = { ...value, languageCode: obj.languageCode, timeZoneCode: obj.timeZoneCode };
      } else {
        obj = value;
      }
    }

    const newBasic = { ...basic, ...obj };

    this.props.dispatch({
      type: 'bpEdit/setState',
      payload: {
        type: 'details',
        data: { ...details, ...{ basic: newBasic } },
      },
    });
  }

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
      <Card title="基础信息" bordered={false} style={{ marginBottom: '24px' }}>
        <Form layout="vertical" className={styles.sangonForm}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={6} sm={12}>
              <FormItem label="名称">
                {
                  editType === 'add' ? (
                    getFieldDecorator('name', {
                      initialValue: {
                        type: basic.type,
                        name: basic.name,
                      },
                      rules: [{ asyncValidator: this.checkNameInput }],
                    })(<NameInput onChange={value => this.valueChange('name', value)} />)
                  ) : null
                }
                {
                  editType === 'update' ? (
                    <p style={{ lineHeight: '32px' }}>
                      <span>组织 </span>
                      <span>MaxMeng </span>
                      <span>审核中</span>
                    </p>
                  ) : null
                }
              </FormItem>
            </Col>
            <Col md={6} sm={12}>
              <FormItem label="移动电话">
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
              <FormItem label="邮箱">
                {getFieldDecorator('email', {
                  initialValue: { email: basic.email },
                  rules: [{ validator: this.checkEmail }],
                })(<EmailInput onChange={value => this.valueChange('email', value)} />)}
              </FormItem>
            </Col>
            <Col md={6} sm={12}>
              <FormItem label="电话">
                {
                  editType === 'add' ? (
                    getFieldDecorator('telephone', {
                      initialValue: {
                        telephoneCountryCode: basic.telephoneCountryCode,
                        telephoneAreaCode: basic.telephoneAreaCode,
                        telephone: basic.telephone,
                        telephoneExtension: basic.telephoneExtension,
                      },
                    })(<TelphoneInput onChange={value => this.valueChange('telephone', value)} />)
                  ) : null
                }
                {
                  editType === 'update' ? (
                    <p style={{ lineHeight: '32px' }}>
                      <span>+86 </span>
                      <span>0565-57776954-6598 </span>
                      <a href="#">变更</a>
                    </p>
                  ) : null
                }
              </FormItem>
            </Col>
            <Col md={6} sm={12}>
              <FormItem label="传真">
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
              <FormItem label="邮政编码">
                {getFieldDecorator('postCode', {
                  initialValue: basic.postCode,
                })(<Input onChange={e => this.valueChange('postCode', e.target.value)} />)}
              </FormItem>
            </Col>
            <Col md={3} sm={6}>
              <FormItem label="时区">
                {getFieldDecorator('timeZoneCode', {
                  initialValue: basic.timeZoneCode,
                })(<Input readOnly onChange={e => this.valueChange('timeZoneCode', e.target.value)} />)}
              </FormItem>
            </Col>
            <Col md={6} sm={12}>
              <FormItem label="语言">
                {getFieldDecorator('languageCode', {
                  initialValue: basic.languageCode,
                })(
                  <Select open={false} onChange={value => this.valueChange('languageCode', value)} >
                    <Option value="ZH">中文</Option>
                    <Option value="EN">英文</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col md={6} sm={12}>
              <FormItem label="特殊行业类别">
                {getFieldDecorator('industryCode', {
                  initialValue: basic.industryCode,
                })(
                  <Select
                    { ...industryOption }
                    onChange={value => this.valueChange('industryCode', value)}
                  >
                    {
                      industryCategories.map(e => {
                        if (basic.type === 1) {
                          if (e.id !== '06') {
                            return <Option disabled key={e.id} value={e.id}>{e.name}</Option>
                          }
                          return <Option key={e.id} value={e.id}>{e.name}</Option>
                        }
                        if (basic.type === 2) {
                          if (e.id === '06') {
                            return <Option disabled key={e.id} value={e.id}>{e.name}</Option>
                          }
                          return <Option key={e.id} value={e.id}>{e.name}</Option>
                        }
                        return <Option key={e.id} value={e.id}>{e.name}</Option>
                      })
                    }
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col md={18} sm={24}>
              <FormItem label="通讯地址">
                {getFieldDecorator('address', {
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
            {
              tabActiveKey === 'customer' ? (
                <Col md={6} sm={6}>
                  <FormItem label="销售冻结">
                    {getFieldDecorator('salesOrderBlock', {
                      initialValue: salesOrderBlock === 1,
                      valuePropName: 'checked',
                    })(
                      <Switch onChange={value => this.valueChange('salesOrderBlock', value)} />,
                    )}
                  </FormItem>
                </Col>
              ) : null
            }
            {
              tabActiveKey === 'vendor' ? (
                <Col md={6} sm={6}>
                  <FormItem label="采购冻结">
                    {getFieldDecorator('invoicePostBlock', {
                      initialValue: invoicePostBlock === 1,
                      valuePropName: 'checked',
                    })(
                      <Switch onChange={value => this.valueChange('invoicePostBlock', value)} />,
                    )}
                  </FormItem>
                </Col>
              ) : null
            }
          </Row>
        </Form>
      </Card>
    );
  }
}

export default Form.create()(Basic);

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
import { EmailInput, NameInput, MobilePhoneInput, TelphoneInput, FaxInput, AddressInput } from '@/components/CustomizedFormControls';

import styles from '../style.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ partnerMaintainEdit }) => {
  const details = partnerMaintainEdit.details || {};
  const basic = details.basic || {};
  const customer = details.customer || {};
  const salesOrderBlock = customer.salesOrderBlock || false;
  const vendor = details.vendor || {};
  const invoicePostBlock = vendor.invoicePostBlock || false;
  return { details, basic, customer, salesOrderBlock, vendor, invoicePostBlock };
}, undefined, undefined, { withRef: true })
class Basic extends React.Component {
  validate = () => {
    const { form } = this.props;
    form.validateFieldsAndScroll((error, values) => {
      if (!error) {
        //
      }
    });
  }

  checkNameInput = (rule, value, callback) => {
    if (value.name) {
      callback();
      return;
    }
    callback(formatMessage({ id: 'partner.maintain.requireName' }));
  };

  valueChange = (key, value) => {
    const { details, basic, customer, vendor } = this.props;
    let obj = {
      [key]: value,
    }

    // 销售冻结
    if (key === 'salesOrderBlock') {
      const newCustomer = { ...customer, ...obj };
      this.props.dispatch({
        type: 'partnerMaintainEdit/setDetails',
        payload: { ...details, ...{ customer: newCustomer } },
      });
      return;
    }

    // 采购冻结
    if (key === 'invoicePostBlock') {
      const newVendor = { ...vendor, ...obj };
      this.props.dispatch({
        type: 'partnerMaintainEdit/setDetails',
        payload: { ...details, ...{ vendor: newVendor } },
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
    if (keyList.indexOf(key) > -1) obj = value;

    const newBasic = { ...basic, ...obj };

    this.props.dispatch({
      type: 'partnerMaintainEdit/setDetails',
      payload: { ...details, ...{ basic: newBasic } },
    });
  }

  render() {
    const {
      form: { getFieldDecorator },
      basic,
      tabActiveKey,
      salesOrderBlock,
      invoicePostBlock,
    } = this.props;

    return (
      <Card title="基础信息" bordered={false} style={{ marginBottom: '24px' }}>
        <Form layout="vertical" className={styles.sangonForm}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={6} sm={12}>
              <FormItem label="名称">
                {/* {getFieldDecorator('name', {
                  initialValue: {
                    type: basic.type,
                    name: basic.name,
                  },
                  rules: [{ validator: this.checkNameInput }],
                })(<NameInput onChange={value => this.valueChange('name', value)} />)} */}
                <p style={{ lineHeight: '32px' }}>
                  <span>组织</span>
                  <span>MaxMeng</span>
                  <span>审核中</span>
                </p>
              </FormItem>
            </Col>
            <Col md={6} sm={12}>
              <FormItem label="移动电话">
                {getFieldDecorator('mobilePhone', {
                  initialValue: {
                    mobilePhoneCountryCode: basic.mobilePhoneCountryCode,
                    mobilePhone: basic.mobilePhone,
                  },
                })(<MobilePhoneInput onChange={value => this.valueChange('mobilePhone', value)} />)}
              </FormItem>
            </Col>
            <Col md={6} sm={12}>
              <FormItem label="邮箱">
                {getFieldDecorator('email', {
                  initialValue: { email: basic.email },
                })(<EmailInput onChange={value => this.valueChange('email', value)} />)}
              </FormItem>
            </Col>
            <Col md={6} sm={12}>
              <FormItem label="电话">
                {getFieldDecorator('telephone', {
                  initialValue: {
                    telephoneCountryCode: basic.telephoneCountryCode,
                    telephoneAreaCode: basic.telephoneAreaCode,
                    telephone: basic.telephone,
                    telephoneExtension: basic.telephoneExtension,
                  },
                })(<TelphoneInput onChange={value => this.valueChange('telephone', value)} />)}
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
                })(<Input onChange={e => this.valueChange('timeZoneCode', e.target.value)} />)}
              </FormItem>
            </Col>
            <Col md={6} sm={12}>
              <FormItem label="语言">
                {getFieldDecorator('languageCode', {
                  initialValue: basic.languageCode,
                })(
                  <Select open={false} onChange={value => this.valueChange('languageCode', value)} >
                    <Option value="1">中文</Option>
                    <Option value="2">英文</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col md={6} sm={12}>
              <FormItem label="特殊行业类别">
                {getFieldDecorator('industryCode', {
                  initialValue: basic.industryCode,
                })(
                  <Select onChange={value => this.valueChange('industryCode', value)} >
                    <Option value="1">军队</Option>
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
                      initialValue: salesOrderBlock,
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
                      initialValue: invoicePostBlock,
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

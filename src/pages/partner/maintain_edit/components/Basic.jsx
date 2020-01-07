/**
 * 基础信息
 */
import { Icon, Col, Form, Input, Row, Select, Switch, Card, Badge } from 'antd';
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
import api from '@/api';
import ContactInformation from './ContactInformation';
import CheckPhone from '@/pages/partner/maintain_details/components/CheckPhone';
import CheckEmail from '@/pages/partner/maintain_details/components/CheckEmail';
import ChangeModal from '@/pages/partner/maintain/components/ChangeModal';
import { formatter } from '@/utils/utils';
import styles from '../style.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(
  ({ global, basicCache, bpCache, bpEdit }) => {
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
    const industryCategories = basicCache.industryCategories.filter(
      e => e.languageCode === global.languageCode,
    );
    // 行业类别和默认税号
    const { industryCategoryAll } = bpCache;

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
      industryCategoryAll,
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
      // 变更移动电话模态框显示状态
      changeMobileModalVisible: false,
      // 变更邮箱模态框显示状态
      changeEmaileModalVisible: false,
    };
    // 异步验证做节流处理
    this.checkNameInput = debounce(this.checkNameInput, 800);
    this.checkEmail = debounce(this.checkEmail, 800);
    this.checkMobilePhone = debounce(this.checkMobilePhone, 800);
    this.checkAddress = debounce(this.checkAddress, 800);
    this.checkTelePhone = debounce(this.checkTelePhone, 800);
  }

  checkNameInput = (rule, value, callback) => {
    if (!value.name) {
      callback('名称必须');
      return;
    }

    // 修改时业务伙伴时，并且电话号码===旧电话号码（没有修改），则不进行后台验证
    if (this.props.editType === 'update') {
      const oldName = this.props.oldDetails.basic.name;
      if (value.name === oldName) {
        callback();
        return;
      }
    }

    api.bp.checkBPFields({ name: value.name }).then(res => {
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

    api.bp
      .checkBPFields({ email: value.email })
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

    api.bp
      .checkBPFields({ mobilePhone: value.mobilePhone })
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
      return;
    }
    callback();
  };

  checkAddress = (rule, value, callback) => {
    const { address, countryCode, changedValue = {} } = value;
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
    if (!countryCode) {
      callback('国家不能为空');
      return;
    }
    callback();
  };

  valueChange = (key, value) => {
    const {
      industryCategoryAll,
      editType,
      details,
      basic,
      customer,
      vendor,
      organizationCertification,
    } = this.props;
    let newBasic = JSON.parse(JSON.stringify(basic));
    const newCustomer = JSON.parse(JSON.stringify(customer));
    const newVendor = JSON.parse(JSON.stringify(vendor));
    let newOrganizationCertification = JSON.parse(JSON.stringify(organizationCertification));

    const keyList = ['name', 'mobilePhone', 'telephone', 'fax', 'email', 'address'];
    if (keyList.indexOf(key) > -1) {
      if (key === 'address') {
        const { changedValue, ...excludeChangeValue } = value;
        newBasic = { ...newBasic, ...excludeChangeValue };
      } else {
        newBasic = { ...newBasic, ...value };
      }
    } else {
      newBasic[key] = value;
    }

    // 名字-类型为个人时，行业类别为个人，且不可更改
    if (key === 'name') {
      if (value.type === 1) {
        newBasic.industryCode = '07';
        this.setState({ industrySelectOpen: true });
      } else {
        if (basic.industryCode === '07') {
          newBasic.industryCode = '';
        }
        this.setState({ industrySelectOpen: true });
      }
    }

    // 地址 决定了语言和时区
    if (key === 'address') {
      let sapCountryCode = value.sapCountryCode || basic.sapCountryCode;
      let sapProvinceCode = value.sapProvinceCode || basic.sapProvinceCode;

      // 新增时，如果由中国修改为其他国家，并且组织认证税号使用的是默认税号，则清空
      if (editType === 'add' && value.sapCountryCode !== 'CN' && basic.sapCountryCode === 'CN') {
        const { taxNo } = newOrganizationCertification;
        const clear = industryCategoryAll.some(e => e.taxNo === taxNo);
        newOrganizationCertification.taxNo = clear ? '' : taxNo;
      }
      // 新增时，如果由其他国家修改为中国，则根据行业类别设置税号
      if (
        editType === 'add' &&
        value.sapCountryCode === 'CN' &&
        basic.sapCountryCode !== 'CN' &&
        basic.industryCode
      ) {
        const select = industryCategoryAll.filter(e => e.industryCode === basic.industryCode);
        if (select[0]) {
          newOrganizationCertification.taxNo = select[0].taxNo;
        }
      }

      // 修改BP时，组织的通讯地址国家不能直接改，需走变更认证
      if (editType === 'update' && value.countryCode !== basic.countryCode) {
        const obj = {};
        Object.keys(value).forEach(k => {
          if (k === 'changedValue') return;
          obj[k] = basic[k];
        });

        // eslint-disable-next-line prefer-destructuring
        sapCountryCode = obj.sapCountryCode;
        // eslint-disable-next-line prefer-destructuring
        sapProvinceCode = obj.sapProvinceCode;

        this.showChange.visibleShow(true, basic);
        setTimeout(() => {
          this.props.form.setFieldsValue({ address: obj });
        });
        newBasic = { ...newBasic, ...obj };
      }

      // 确定语言
      if (sapCountryCode === 'CN') {
        newBasic.languageCode = 'ZH';
      } else if (sapCountryCode && sapCountryCode !== 'CN') {
        newBasic.languageCode = 'EN';
      } else {
        newBasic.languageCode = '';
      }

      // 根据国家编号确定时区
      if (sapCountryCode) {
        this.props.countryTimeZone.forEach(e => {
          if (e.countryCode === sapCountryCode) {
            newBasic.timeZoneCode = e.timeZone;
          }
        });
      }
      // 根据省编号确定时区
      if (sapProvinceCode) {
        this.props.countryProvinceTimeZone.forEach(e => {
          if (e.countryCode === sapCountryCode && e.provinceCode === sapProvinceCode) {
            newBasic.timeZoneCode = e.timeZone;
          }
        });
      }
    }

    // 销售冻结
    if (key === 'salesOrderBlock') {
      newCustomer.salesOrderBlock = value ? 1 : 2;
    }

    // 采购冻结
    if (key === 'invoicePostBlock') {
      newVendor.invoicePostBlock = value ? 1 : 2;
    }

    // 电话 类型为组织时，认证资料的电话与基础信息的电话保持一致
    if (key === 'telephone') {
      newOrganizationCertification = { ...newOrganizationCertification, ...value };
    }

    // 行业类别 与 默认税号
    if (key === 'industryCode' && basic.sapCountryCode === 'CN') {
      const select = industryCategoryAll.filter(e => e.industryCode === value);
      if (select[0]) {
        newOrganizationCertification.taxNo = select[0].taxNo;
      }
    }

    this.props.dispatch({
      type: 'bpEdit/setState',
      payload: {
        type: 'details',
        data: {
          ...details,
          basic: newBasic,
          customer: newCustomer,
          vendor: newVendor,
          organizationCertification: newOrganizationCertification,
        },
      },
    });
  };

  // 名称
  renderName = () => {
    const { form, editType, basic } = this.props;
    const { getFieldDecorator } = form;

    const type1 = (
      <span>
        <Icon type="user" />
        &nbsp;
        <FormattedMessage id="bp.maintain_details.person" />
      </span>
    );
    const type2 = (
      <span>
        <Icon type="home" />
        &nbsp;
        <FormattedMessage id="bp.maintain_details.organization" />
      </span>
    );

    const show = (
      <p style={{ lineHeight: '32px' }}>
        {basic.type === 1 ? type1 : null}
        {basic.type === 2 ? type2 : null}
        <span>&nbsp;{basic.name}&nbsp;</span>
        {basic.certificationStatus === 2 ? (
          <Badge status="warning" text="审核中" />
        ) : (
          <a
            className={styles.changeButton}
            onClick={() => {
              this.showChange.visibleShow(true, this.props.details.basic);
            }}
          >
            <FormattedMessage id="bp.maintain_details.change" />
          </a>
        )}
      </p>
    );

    // 编辑状态
    // 页面状态为：新增
    if (editType === 'add') {
      const edit = getFieldDecorator('name', {
        initialValue: {
          type: basic.type,
          name: basic.name,
        },
        rules: [{ validator: this.checkNameInput }],
      })(<NameInput onChange={value => this.valueChange('name', value)} />);

      return edit;
    }
    // 非编辑状态
    if (editType === 'update') {
      return show;
    }
    return null;
  };

  // 移动电话
  renderMobilePhone = () => {
    const { form, editType, basic } = this.props;
    const { getFieldDecorator } = form;

    // 编辑状态
    // 1）页面状态为：新增
    // 2）页面状态为：修改 并且 移动电话验证状态为：1(未验证)
    if (editType === 'add' || (editType === 'update' && basic.mobilePhoneVerifyStatus === 1)) {
      const edit = getFieldDecorator('mobilePhone', {
        initialValue: {
          mobilePhoneCountryCode: basic.mobilePhoneCountryCode,
          mobilePhone: basic.mobilePhone,
        },
        rules: [{ validator: this.checkMobilePhone }],
      })(<MobilePhoneInput onChange={value => this.valueChange('mobilePhone', value)} />);

      return edit;
    }

    // 显示状态
    // 页面状态为：修改 并且 移动电话验证状态为：2(验证中)/3(变更中)/4(已验证)
    // 组织类BP还要有解绑按钮
    if (
      editType === 'update' &&
      (basic.mobilePhoneVerifyStatus === 2 ||
        basic.mobilePhoneVerifyStatus === 3 ||
        basic.mobilePhoneVerifyStatus === 4)
    ) {
      const show = (
        <>
          {basic.mobilePhoneCountryCode}
          {basic.mobilePhone}
          {basic.mobilePhoneVerifyStatus === 2 ? <>验证中</> : null}
          {basic.mobilePhoneVerifyStatus === 3 ? <>变更中</> : null}
          <a
            className={styles.changeButton}
            onClick={() => {
              this.changePhoneCallback(true);
            }}
          >
            <FormattedMessage id="bp.maintain_details.change" />
          </a>
          <CheckPhone
            details={this.props.details}
            phoneShow={this.state.changeMobileModalVisible}
            checkPhone={v => {
              this.changePhoneCallback(v);
            }}
          />
        </>
      );

      return show;
    }

    return null;
  };

  // 邮箱
  renderEmail = () => {
    const { form, editType, basic } = this.props;
    const { getFieldDecorator } = form;

    // 编辑状态
    // 1）页面状态为：新增
    // 2）页面状态为：修改 并且 BP类型为人员
    if (editType === 'add' || (editType === 'update' && basic.mobilePhoneVerifyStatus === 1)) {
      const edit = getFieldDecorator('email', {
        initialValue: { email: basic.email },
        rules: [{ validator: this.checkEmail }],
      })(<EmailInput onChange={value => this.valueChange('email', value)} />);

      return edit;
    }

    // 显示状态
    // 页面状态为：修改 并且 移动电话验证状态为：Y
    if (editType === 'update' && basic.emailVerifyStatus === 4) {
      const show = (
        <>
          {basic.email}
          <a
            className={styles.changeButton}
            onClick={() => {
              this.changeEmailCallback(true);
            }}
          >
            <FormattedMessage id="bp.maintain_details.change" />
          </a>
          <CheckEmail
            emailShow={this.state.changeEmaileModalVisible}
            details={this.props.details}
            checkEmail={v => {
              this.changeEmailCallback(v);
            }}
          />
        </>
      );

      return show;
    }

    return null;
  };

  // 电话
  renderTelephone = () => {
    const { form, editType, basic } = this.props;
    const { getFieldDecorator } = form;

    const data = {
      countryCode: basic.telephoneCountryCode,
      areaCode: basic.telephoneAreaCode,
      code: basic.telephone,
      extension: basic.telephoneExtension,
    };
    const show = (
      <>
        <ContactInformation data={data} />
        {basic.certificationStatus !== 2 ? (
          <a
            className={styles.changeButton}
            onClick={() => {
              this.showChange.visibleShow(true, this.props.details.basic);
            }}
          >
            <FormattedMessage id="bp.maintain_details.change" />
          </a>
        ) : null}
      </>
    );

    // 编辑状态
    // 1）页面状态为：新增
    // 2）页面状态为：修改 并且 BP类型为人员
    if (
      editType === 'add' ||
      (editType === 'update' && basic.type === 1) ||
      (editType === 'update' && basic.sapCountryCode !== 'CN')
    ) {
      const edit = getFieldDecorator('telephone', {
        initialValue: {
          telephoneCountryCode: basic.telephoneCountryCode,
          telephoneAreaCode: basic.telephoneAreaCode,
          telephone: basic.telephone,
          telephoneExtension: basic.telephoneExtension,
        },
        rules: [{ validator: this.checkTelePhone }],
      })(<TelphoneInput onChange={value => this.valueChange('telephone', value)} />);

      return edit;
    }
    // 非编辑状态
    if (editType === 'update') {
      return show;
    }
    return null;
  };

  // 行业类别
  renderIndustry = () => {
    const { form, editType, basic, industryCategories } = this.props;
    const { getFieldDecorator } = form;
    const { industrySelectOpen } = this.state;
    const industryOption = {};
    if (!industrySelectOpen) industryOption.open = industrySelectOpen;

    // 编辑状态
    // 页面状态为：新增
    if (editType === 'add' || (editType === 'update' && basic.sapCountryCode !== 'CN')) {
      const edit = getFieldDecorator('industryCode', {
        initialValue: basic.industryCode,
        rules: [{ required: true }],
      })(
        <Select {...industryOption} onChange={value => this.valueChange('industryCode', value)}>
          {industryCategories.map(e => {
            if (basic.type === 1) {
              if (e.code !== '07') {
                return (
                  <Option disabled key={e.code} value={e.code}>
                    {e.name}
                  </Option>
                );
              }
              return (
                <Option key={e.code} value={e.code}>
                  {e.name}
                </Option>
              );
            }
            if (basic.type === 2) {
              if (e.code === '07') {
                return (
                  <Option disabled key={e.code} value={e.code}>
                    {e.name}
                  </Option>
                );
              }
              return (
                <Option key={e.code} value={e.code}>
                  {e.name}
                </Option>
              );
            }
            return (
              <Option key={e.code} value={e.code}>
                {e.name}
              </Option>
            );
          })}
        </Select>,
      );

      return edit;
    }
    // 非编辑状态
    if (editType === 'update') {
      const show = (
        <>
          {formatter(industryCategories, basic.industryCode, 'code')}
          {basic.type === 2 && basic.certificationStatus !== 2 ? (
            <a
              className={styles.changeButton}
              onClick={() => {
                this.showChange.visibleShow(true, this.props.details.basic);
              }}
            >
              <FormattedMessage id="bp.maintain_details.change" />
            </a>
          ) : null}
        </>
      );

      return show;
    }
    return null;
  };

  changePhoneCallback = v => {
    this.setState({
      changeMobileModalVisible: v,
    });
  };

  changeEmailCallback = v => {
    this.setState({
      changeEmaileModalVisible: v,
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      basic,
      editType,
      tabActiveKey,
      salesOrderBlock,
      invoicePostBlock,
    } = this.props;

    return (
      <Card
        title={formatMessage({ id: 'bp.maintain_details.basic' })}
        bordered={false}
        style={{ marginBottom: '24px' }}
      >
        {editType === 'update' ? (
          <ChangeModal
            onRef={ref => {
              this.showChange = ref;
            }}
            getData={() => {}}
          />
        ) : null}
        <Form layout="vertical" className={styles.sangonForm} hideRequiredMark>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={6} sm={12}>
              <FormItem label={formatMessage({ id: 'bp.maintain_details.name' })}>
                {this.renderName()}
              </FormItem>
            </Col>
            <Col md={6} sm={12}>
              <FormItem label={formatMessage({ id: 'bp.mobilePhone' })}>
                {this.renderMobilePhone()}
              </FormItem>
            </Col>
            <Col md={6} sm={12}>
              <FormItem label={formatMessage({ id: 'bp.maintain_details.basic.email' })}>
                {this.renderEmail()}
              </FormItem>
            </Col>
            <Col md={6} sm={12}>
              <FormItem label={formatMessage({ id: 'bp.maintain_details.phone' })}>
                {this.renderTelephone(basic)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
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
                {this.renderIndustry()}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={18} sm={24}>
              <FormItem label={formatMessage({ id: 'bp.maintain_details.basic.address' })}>
                {getFieldDecorator('address', {
                  rules: [{ validator: this.checkAddress }],
                  initialValue: {
                    countryCode: basic.countryCode,
                    countryName: basic.countryName,
                    provinceCode: basic.provinceCode,
                    provinceName: basic.provinceName,
                    cityCode: basic.cityCode,
                    cityName: basic.cityName,
                    countyCode: basic.countyCode,
                    countyName: basic.countyName,
                    streetCode: basic.streetCode,
                    streetName: basic.streetName,
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

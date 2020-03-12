/* eslint-disable no-nested-ternary */
import { Card, Descriptions, Icon, Badge, Popconfirm } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { formatter } from '@/utils/utils';
import CheckPhone from './CheckPhone';
import CheckEmail from './CheckEmail';
import ChangeModal from '@/pages/partner/maintain/components/ChangeModal';
import ContactInformation from '@/pages/partner/maintain_edit/components/ContactInformation';
import './style.less';
import api from '@/api';

const DescriptionsItem = Descriptions.Item;

@connect(({ partnerMaintainEdit, basicCache, bp }) => ({
  details:
    partnerMaintainEdit.type === 'supplier'
      ? partnerMaintainEdit.supplier
      : partnerMaintainEdit.details,
  type: partnerMaintainEdit.type,
  // countryDiallingCodes: basicCache.countryDiallingCodes,
  salesPaymentMethods: basicCache.salesPaymentMethods,
  industry: basicCache.industryCategories,
  salesOrderBlock: bp.SalesOrderBlock,
  emailVerifyStatus: bp.EmailVerifyStatus,
  mobilePhoneVerifyStatus: bp.MobilePhoneVerifyStatus,
  customer: partnerMaintainEdit.details,
  supplier: partnerMaintainEdit.supplier,
}))
class BasicInfo extends Component {
  state = {
    phoneShow: false,
    emailShow: false,
    details: this.props.details,
  };

  componentDidMount() {
    // this.props.dispatch({
    //   type: 'basicCache/getCache',
    //   payload: { type: 'countryDiallingCodes' },
    // });
    // this.props.dispatch({
    //   type: 'basicCache/getCache',
    //   payload: { type: 'salesPaymentMethods' },
    // });
    // this.props.dispatch({
    //   type: 'basicCache/getCache',
    //   payload: { type: 'industryCategories' },
    // });
  }

  checkPhone = v => {
    this.setState({
      phoneShow: v,
    });
  };

  checkEmail = v => {
    this.setState({
      emailShow: v,
    });
  };

  // 解绑
  unbundling = (id, type) => {
    const { customer, supplier } = this.props;
    const { details } = this.state;
    const customerData = customer;
    const supplierData = supplier;
    const detailsData = details;
    if (type === 1) {
      api.bp.mobilePhoneUnbind(id).then(() => {
        customerData.basic.mobilePhoneVerifyStatus = 1;
        supplierData.basic.mobilePhoneVerifyStatus = 1;
        detailsData.basic.mobilePhoneVerifyStatus = 1;
        this.props.dispatch({
          type: 'partnerMaintainEdit/setSupplier',
          payload: supplierData,
        });
        this.props.dispatch({
          type: 'partnerMaintainEdit/setDetails',
          payload: customerData,
        });
        this.setState({
          details: detailsData,
        });
      });
    }
    if (type === 2) {
      api.bp.emailUnbind(id).then(() => {
        customerData.basic.emailVerifyStatus = 1;
        supplierData.basic.emailVerifyStatus = 1;
        detailsData.basic.emailVerifyStatus = 1;
        this.props.dispatch({
          type: 'partnerMaintainEdit/setSupplier',
          payload: supplierData,
        });
        this.props.dispatch({
          type: 'partnerMaintainEdit/setDetails',
          payload: customerData,
        });
        this.setState({
          details: detailsData,
        });
      });
    }
  };

  // 电话和邮箱的状态设置，变更中或者是验证中显示状态和文本，完成验证显示变更按钮，如果是组织另外显示解绑按钮
  // type 1是电话 2是邮箱
  statusSetting = (basic, type) => {
    const { mobilePhoneVerifyStatus, emailVerifyStatus } = this.props;
    if (type === 1) {
      if (basic.mobilePhoneVerifyStatus === 2 || basic.mobilePhoneVerifyStatus === 3) {
        return (
          <Badge
            status={formatter(
              mobilePhoneVerifyStatus,
              basic.mobilePhoneVerifyStatus,
              'id',
              'badge',
            )}
            text={formatMessage({
              id: formatter(mobilePhoneVerifyStatus, basic.mobilePhoneVerifyStatus, 'id', 'i18n'),
            })}
          />
        );
      }
      if (basic.mobilePhoneVerifyStatus === 4 && basic.type === 2) {
        return (
          <>
            <a
              onClick={() => {
                this.checkPhone(true);
              }}
            >
              {formatMessage({ id: 'bp.maintain_details.change' })}
            </a>
            &nbsp;&nbsp;
            <Popconfirm
              title="确认解绑移动电话？"
              onConfirm={() => {
                this.unbundling(basic.id, 1);
              }}
            >
              <a>{formatMessage({ id: 'bp.maintain_details.unbundling' })}</a>
            </Popconfirm>
          </>
        );
      }
      if (basic.mobilePhoneVerifyStatus === 4 && basic.type === 1) {
        return (
          <>
            <a
              onClick={() => {
                this.checkPhone(true);
              }}
            >
              {formatMessage({ id: 'bp.maintain_details.change' })}
            </a>
          </>
        );
      }
    }
    if (type === 2) {
      if (basic.emailVerifyStatus === 2 || basic.emailVerifyStatus === 3) {
        return (
          <Badge
            status={formatter(emailVerifyStatus, basic.emailVerifyStatus, 'id', 'badge')}
            text={formatMessage({
              id: formatter(emailVerifyStatus, basic.emailVerifyStatus, 'id', 'i18n'),
            })}
          />
        );
      }
      if (basic.emailVerifyStatus === 4 && basic.type === 2) {
        return (
          <>
            <a
              onClick={() => {
                this.checkPhone(true);
              }}
            >
              {formatMessage({ id: 'bp.maintain_details.change' })}
            </a>
            &nbsp;&nbsp;
            <Popconfirm
              title="确认解绑邮箱？"
              onConfirm={() => {
                this.unbundling(basic.id, 2);
              }}
            >
              <a>{formatMessage({ id: 'bp.maintain_details.unbundling' })}</a>
            </Popconfirm>
          </>
        );
      }
      if (basic.emailVerifyStatus === 4 && basic.type === 1) {
        return (
          <>
            <a
              onClick={() => {
                this.checkEmail(true);
              }}
            >
              {formatMessage({ id: 'bp.maintain_details.change' })}
            </a>
          </>
        );
      }
    }
    return null;
  };

  render() {
    const {
      details: { basic },
      phoneShow,
      emailShow,
    } = this.state;
    if (!basic) return false;
    const { details, type, industry, salesOrderBlock } = this.props;
    return (
      <Card
        title={formatMessage({ id: 'bp.maintain_details.basic' })}
        className="check-tabs"
        bordered={false}
        style={{ marginBottom: '24px' }}
      >
        <Descriptions className="s-descriptions" layout="vertical" column={8}>
          <DescriptionsItem span={2} label={formatMessage({ id: 'bp.maintain_details.basic' })}>
            <Icon type={basic.type === 1 ? 'user' : 'home'} />
            &nbsp;&nbsp;
            {basic.type === 1
              ? formatMessage({ id: 'bp.maintain_details.person' })
              : formatMessage({ id: 'bp.maintain_details.organization' })}
            &nbsp;&nbsp;
            {basic.name}&nbsp;&nbsp;&nbsp;
            {basic.certificationStatus === 2 ? (
              <Badge status="warning" text={formatMessage({ id: 'bp.processing' })} />
            ) : (
              <a
                onClick={() => {
                  this.showChange.visibleShow(true, this.props.details.basic);
                }}
              >
                {formatMessage({ id: 'bp.maintain_details.change' })}
              </a>
            )}
          </DescriptionsItem>
          <DescriptionsItem span={2} label={formatMessage({ id: 'bp.mobilePhone' })}>
            <ContactInformation
              data={{
                countryCode: basic.mobilePhoneCountryCode,
                code: basic.mobilePhone,
              }}
            />
            &nbsp;&nbsp;&nbsp;
            {this.statusSetting(basic, 1)}
          </DescriptionsItem>
          <DescriptionsItem
            span={2}
            label={formatMessage({ id: 'bp.maintain_details.basic.email' })}
          >
            {basic.email}&nbsp;&nbsp;&nbsp;
            {this.statusSetting(basic, 2)}
          </DescriptionsItem>
          <DescriptionsItem span={2} label={formatMessage({ id: 'bp.maintain_details.phone' })}>
            <ContactInformation
              data={{
                countryCode: basic.telephoneCountryCode,
                areaCode: basic.telephoneAreaCode,
                code: basic.telephone,
                extension: basic.telephoneExtension,
              }}
            />
            {details.basic.sapCountryCode === 'CN' &&
            details.basic.type === 2 &&
            basic.certificationStatus !== 2 ? (
              <a
                onClick={() => {
                  this.showChange.visibleShow(true, this.props.details.basic);
                }}
              >
                &nbsp;{formatMessage({ id: 'bp.maintain_details.change' })}
              </a>
            ) : (
              ''
            )}
          </DescriptionsItem>
          <DescriptionsItem span={2} label={formatMessage({ id: 'bp.maintain_details.basic.fax' })}>
            <ContactInformation
              data={{
                countryCode: basic.faxCountryCode,
                areaCode: basic.faxAreaCode,
                code: basic.fax,
                extension: basic.faxExtension,
              }}
            />
          </DescriptionsItem>
          <DescriptionsItem
            span={1}
            label={formatMessage({ id: 'bp.maintain_details.postal_code' })}
          >
            {basic.postCode}
          </DescriptionsItem>
          <DescriptionsItem
            span={1}
            label={formatMessage({ id: 'bp.maintain_details.basic.time_zone' })}
          >
            {basic.timeZoneCode}
          </DescriptionsItem>
          <DescriptionsItem
            span={2}
            label={formatMessage({ id: 'bp.maintain_details.basic.language' })}
          >
            {basic.languageCode === 'ZH'
              ? formatMessage({ id: 'bp.chinese' })
              : formatMessage({ id: 'bp.english' })}
          </DescriptionsItem>
          <DescriptionsItem
            span={2}
            label={formatMessage({ id: 'bp.maintain_details.basic.business_type' })}
          >
            {basic.industryCode &&
            industry.filter(item => item.code === basic.industryCode).length !== 0
              ? industry.filter(item => item.code === basic.industryCode)[0].name
              : basic.industryCode}
            &nbsp;&nbsp;
            {details.basic.sapCountryCode === 'CN' &&
            details.basic.type === 2 &&
            basic.certificationStatus !== 2 ? (
              <a
                onClick={() => {
                  this.showChange.visibleShow(true, this.props.details.basic);
                }}
              >
                {formatMessage({ id: 'bp.maintain_details.change' })}
              </a>
            ) : (
              ''
            )}
          </DescriptionsItem>
          <DescriptionsItem
            span={6}
            label={formatMessage({ id: 'bp.maintain_details.basic.address' })}
          >
            {basic.countryName}&nbsp;
            {basic.provinceName}&nbsp;
            {basic.cityName}&nbsp;
            {basic.countyName}&nbsp;
            {basic.streetName}&nbsp;
            {basic.address}
          </DescriptionsItem>
          <DescriptionsItem
            span={2}
            label={
              type === 'supplier'
                ? formatMessage({ id: 'bp.maintain_details.purchase_org.procurement_block' })
                : formatMessage({ id: 'bp.maintain_details.sales_distribution.sales_block' })
            }
          >
            {type === 'supplier' ? (
              details.vendor ? (
                <Badge
                  status={formatter(
                    salesOrderBlock,
                    details.vendor.invoicePostBlock,
                    'id',
                    'badge',
                  )}
                  text={formatMessage({
                    id: formatter(salesOrderBlock, details.vendor.invoicePostBlock, 'id', 'i18n'),
                  })}
                />
              ) : (
                ''
              )
            ) : details.customer ? (
              <Badge
                status={formatter(salesOrderBlock, details.customer.salesOrderBlock, 'id', 'badge')}
                text={formatMessage({
                  id: formatter(salesOrderBlock, details.customer.salesOrderBlock, 'id', 'i18n'),
                })}
              />
            ) : (
              ''
            )}
          </DescriptionsItem>
        </Descriptions>
        <CheckPhone
          phoneShow={phoneShow}
          details={details}
          checkPhone={v => {
            this.checkPhone(v);
          }}
        />
        <CheckEmail
          emailShow={emailShow}
          details={details}
          checkEmail={v => {
            this.checkEmail(v);
          }}
        />
        <ChangeModal
          onRef={ref => {
            this.showChange = ref;
          }}
          getData={() => {}}
        />
      </Card>
    );
  }
}

export default BasicInfo;

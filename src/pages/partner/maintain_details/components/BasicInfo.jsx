/* eslint-disable no-nested-ternary */
import { Card, Descriptions, Icon, Badge } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { formatter } from '@/utils/utils';
import CheckPhone from './CheckPhone';
import CheckEmail from './CheckEmail';
import ChangeModal from '@/pages/partner/maintain/components/ChangeModal';
import ContactInformation from '@/pages/partner/maintain_edit/components/ContactInformation';
import './style.less';

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
}))
class BasicInfo extends Component {
  state = {
    phoneShow: false,
    emailShow: false,
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'basicCache/getCache',
      payload: { type: 'countryDiallingCodes' },
    });
    this.props.dispatch({
      type: 'basicCache/getCache',
      payload: { type: 'salesPaymentMethods' },
    });
    this.props.dispatch({
      type: 'basicCache/getCache',
      payload: { type: 'industryCategories' },
    });
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

  render() {
    const { phoneShow, emailShow } = this.state;
    const {
      details: { basic },
      details,
      type,
      industry,
      salesOrderBlock,
    } = this.props;
    if (!basic) return null;

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
            {basic.mobilePhoneVerifyStatus === 'Y' ? (
              <a
                onClick={() => {
                  this.checkPhone(true);
                }}
              >
                {formatMessage({ id: 'bp.maintain_details.change' })}
              </a>
            ) : (
              ''
            )}
          </DescriptionsItem>
          <DescriptionsItem
            span={2}
            label={formatMessage({ id: 'bp.maintain_details.basic.email' })}
          >
            {basic.email}&nbsp;&nbsp;&nbsp;
            {basic.emailVerifyStatus === 'Y' ? (
              <a
                onClick={() => {
                  this.checkEmail(true);
                }}
              >
                {formatMessage({ id: 'bp.maintain_details.change' })}
              </a>
            ) : (
              ''
            )}
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
              : ''}
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
                  text={formatter(salesOrderBlock, details.vendor.invoicePostBlock)}
                />
              ) : (
                ''
              )
            ) : details.custom ? (
              <Badge
                status={formatter(salesOrderBlock, details.custom.invoicePostBlock, 'id', 'badge')}
                text={formatter(salesOrderBlock, details.custom.invoicePostBlock)}
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

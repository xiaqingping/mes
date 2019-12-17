import { Card, Descriptions, Icon, Badge } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import CheckPhone from './CheckPhone';
import CheckEmail from './CheckEmail';
import ChangeModal from '@/pages/partner/maintain/components/ChangeModal';
import ContactInformation from '@/pages/partner/maintain_edit/components/ContactInformation';
import './style.less';

const DescriptionsItem = Descriptions.Item;

@connect(({ partnerMaintainEdit, basicCache }) => ({
  details:
    partnerMaintainEdit.type === 'supplier'
      ? partnerMaintainEdit.supplier
      : partnerMaintainEdit.details,
  type: partnerMaintainEdit.type,
  // countryDiallingCodes: basicCache.countryDiallingCodes,
  salesPaymentMethods: basicCache.salesPaymentMethods,
  industry: basicCache.industryCategories,
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
      countryDiallingCodes,
      salesPaymentMethods,
      industry,
    } = this.props;
    if (!countryDiallingCodes && !salesPaymentMethods) return null;
    if (industry.length === 0) return null;
    // let newData = []
    // countryDiallingCodes.forEach(item => {
    //   if (item.countryCode === basic.telephoneCountryCode) {
    //     newData = item;
    //   }
    // })

    return (
      <Card
        title="基础信息"
        className="check-tabs"
        bordered={false}
        style={{ marginBottom: '24px' }}
      >
        <Descriptions className="s-descriptions" layout="vertical" column={8}>
          <DescriptionsItem span={2} label="名称">
            <Icon type={basic.type === 1 ? 'user' : 'home'} />
            &nbsp;&nbsp;
            {basic.name}&nbsp;&nbsp;&nbsp;
            {basic.certificationStatus === 2 ? (
              <Badge status="warning" text="审核中" />
            ) : (
              <a
                onClick={() => {
                  this.showChange.visibleShow(true, this.props.details.basic);
                }}
              >
                变更
              </a>
            )}
          </DescriptionsItem>
          <DescriptionsItem span={2} label="移动电话">
            <ContactInformation
              data={{
                countryCode: basic.mobilePhoneCountryCode,
                code: basic.mobilePhone,
              }}
            />
            {basic.emailVerifyStatus === 'Y' ? (
              <a
                onClick={() => {
                  this.checkPhone(true);
                }}
              >
                变更
              </a>
            ) : (
              ''
            )}
          </DescriptionsItem>
          <DescriptionsItem span={2} label="邮箱">
            {basic.email}&nbsp;&nbsp;&nbsp;
            {basic.mobilePhoneVerifyStatus === 'Y' ? (
              <a
                onClick={() => {
                  this.checkEmail(true);
                }}
              >
                变更
              </a>
            ) : (
              ''
            )}
          </DescriptionsItem>
          <DescriptionsItem span={2} label="电话">
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
                变更
              </a>
            ) : (
              ''
            )}
          </DescriptionsItem>
          <DescriptionsItem span={2} label="传真">
            <ContactInformation
              data={{
                countryCode: basic.faxCountryCode,
                areaCode: basic.faxAreaCode,
                code: basic.fax,
                extension: basic.faxExtension,
              }}
            />
          </DescriptionsItem>
          <DescriptionsItem span={1} label="邮政编码">
            {basic.postCode}
          </DescriptionsItem>
          <DescriptionsItem span={1} label="时区">
            {basic.timeZoneCode}
          </DescriptionsItem>
          <DescriptionsItem span={2} label="语言">
            {basic.languageCode === 'ZH' ? '中文' : '英文'}
          </DescriptionsItem>
          <DescriptionsItem span={2} label="特性行业类别">
            {/* {basic.industryCode}&nbsp;&nbsp;&nbsp; */}
            {/* {console.log(industry)} */}
            {basic.industryCode
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
                变更
              </a>
            ) : (
              ''
            )}
          </DescriptionsItem>
          <DescriptionsItem span={6} label="通讯地址">
            {basic.countryName}&nbsp;
            {basic.provinceName}&nbsp;
            {basic.cityName}&nbsp;
            {basic.countyName}&nbsp;
            {basic.streetName}&nbsp;
            {basic.address}
          </DescriptionsItem>
          <DescriptionsItem span={2} label={type === 'supplier' ? '采购冻结' : '销售冻结'}>
            <Badge status="error" />
            &nbsp;冻结
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
        {/* <CheckEmail emailShow={emailShow} proceed="true" emailAccount="123456@qq.com" />
            checkEmail={v => { this.checkEmail(v) }} */}
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

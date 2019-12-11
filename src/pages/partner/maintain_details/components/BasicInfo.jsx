import {
  Card,
  Descriptions,
  Icon,
  Badge,
} from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import CheckPhone from './CheckPhone';
import CheckEmail from './CheckEmail';
import ChangeModal from '@/pages/partner/maintain/components/ChangeModal';
import './style.less'

const DescriptionsItem = Descriptions.Item;

@connect(({ partnerMaintainEdit, basicCache }) => ({
  details: partnerMaintainEdit.type === 'supplier' ?
  partnerMaintainEdit.supplier : partnerMaintainEdit.details,
  type: partnerMaintainEdit.type,
  countryDiallingCodes: basicCache.countryDiallingCodes,
  salesPaymentMethods: basicCache.salesPaymentMethods,
  industry: basicCache.industryCategories,
}))
class BasicInfo extends Component {
  state = {
    phoneShow: false,
    emailShow: false,
  }

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
    })
  }

  checkEmail = v => {
    this.setState({
      emailShow: v,
    })
  }

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
    let newData = []
    countryDiallingCodes.forEach(item => {
      if (item.countryCode === basic.telephoneCountryCode) {
        newData = item;
      }
    })

    return (
      <Card
        title="基础信息"
        className="check-tabs"
        bordered={false}
        style={{ marginBottom: '24px' }}>
        <Descriptions
          className="s-descriptions"
          layout="vertical"
          column={8}
        >
          <DescriptionsItem span={2} label="名称">
            <Icon type={basic.type === 1 ? 'user' : 'home'} />&nbsp;&nbsp;
            {basic.name}&nbsp;&nbsp;&nbsp;
            <a
              onClick={
                () => { this.showChange.visibleShow(true, this.props.details.basic) }
              }
            >
              变更
            </a>
          </DescriptionsItem>
          <DescriptionsItem span={2} label="移动电话">
            <img
              src={`/images/country/${newData.countryCode}.png`}
              width="10"
              height="10"
              style={{ borderRadius: '50%', marginBottom: '3px' }}
              alt=""
            />&nbsp;&nbsp;
            {newData.length !== 0 ? `+${newData.diallingCode}` : ''}&nbsp;&nbsp;
            {basic.mobilePhone}&nbsp;&nbsp;&nbsp;
            {basic.emailVerifyStatus === 'Y' ?
            <a onClick={() => { this.checkPhone(true) }}>变更</a> : ''}
          </DescriptionsItem>
          <DescriptionsItem span={2} label="邮箱">
            {basic.email}&nbsp;&nbsp;&nbsp;
            {basic.mobilePhoneVerifyStatus === 'Y' ?
            <a onClick={() => { this.checkEmail(true) }}>变更</a> : ''}
          </DescriptionsItem>
          <DescriptionsItem span={2} label="电话">
            <img
              src={`/images/country/${newData.countryCode}.png`}
              width="10"
              height="10"
              style={{ borderRadius: '50%', marginBottom: '3px' }}
              alt=""
            />&nbsp;&nbsp;
            {newData.length !== 0 ? `+${newData.diallingCode}` : ''}&nbsp;&nbsp;
            {basic.telephoneAreaCode}
            {basic.telephone ? `-${basic.telephone}` : ''}
            {basic.telephoneExtension ? `-${basic.telephoneExtension}` : ''}&nbsp;&nbsp;&nbsp;
            <a onClick={
                () => { this.showChange.visibleShow(true, this.props.details.basic) }
              }
            >
              变更
            </a>
          </DescriptionsItem>
          <DescriptionsItem span={2} label="传真">
            {basic.fax ? <img
              src={`/images/country/${newData.countryCode}.png`}
              width="10"
              height="10"
              style={{ borderRadius: '50%', marginBottom: '3px' }}
              alt=""
              /> : ''}&nbsp;&nbsp;
            {/* {basic.faxCountryCode}&nbsp;&nbsp; */}
            {
              newData.length !== 0 && basic.faxCountryCode ? `+${newData.diallingCode}` : ''
            }&nbsp;&nbsp;
            {basic.faxAreaCode ? `${basic.faxAreaCode}-` : ''}
            {basic.fax ? `${basic.fax}-` : ''}
            {basic.faxExtension ? `${basic.faxExtension}` : ''}
          </DescriptionsItem>
          <DescriptionsItem span={1} label="邮政编码">{basic.postCode}</DescriptionsItem>
          <DescriptionsItem span={1} label="时区">{basic.timeZoneCode}</DescriptionsItem>
          <DescriptionsItem span={2} label="语言">
            {basic.languageCode === 'ZH' ? '中文' : '英文'}
          </DescriptionsItem>
          <DescriptionsItem span={2} label="特性行业类别">
            {/* {basic.industryCode}&nbsp;&nbsp;&nbsp; */}
            {/* {console.log(industry)} */}
            {
              basic.industryCode ?
              industry.filter(item => item.code === basic.industryCode)[0].name : ''
            }&nbsp;&nbsp;
            <a onClick={
                () => { this.showChange.visibleShow(true, this.props.details.basic) }
              }
            >
              变更
            </a>
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
            <Badge status="error"/>&nbsp;冻结</DescriptionsItem>
        </Descriptions>
        <CheckPhone
          phoneShow={phoneShow}
          details={details}
          checkPhone={v => { this.checkPhone(v) }}
        />
        <CheckEmail
          emailShow={emailShow}
          details={details}
          checkEmail={v => { this.checkEmail(v) }}
        />
        {/* <CheckEmail emailShow={emailShow} proceed="true" emailAccount="123456@qq.com" />
            checkEmail={v => { this.checkEmail(v) }} */}
        <ChangeModal
          onRef={ ref => { this.showChange = ref }}
          getData={() => {}}
        />
      </Card>
    );
  }
}

export default BasicInfo;

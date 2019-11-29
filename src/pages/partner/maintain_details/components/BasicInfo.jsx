// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable jsx-a11y/alt-text */
import {
  Card,
  Descriptions,
  Icon,
  Badge,
} from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import CheckPhone from './CheckPhone'
import CheckEmail from './CheckEmail'
import Flag from '@/assets/imgs/flag.jpg'
import './style.less'

const DescriptionsItem = Descriptions.Item;

// eslint-disable-next-line react/prefer-stateless-function
@connect(({ partnerMaintainEdit }) => ({
  details: partnerMaintainEdit.type === 'supplier' ?
  partnerMaintainEdit.supplier : partnerMaintainEdit.details,
  type: partnerMaintainEdit.type,
}))
class BasicInfo extends Component {
  state = {
    phoneShow: false,
    emailShow: false,
  }

  checkPhone = v => {
    this.setState({
      phoneShow: v,
      emailShow: false,
    })
  }

  checkEmail = v => {
    this.setState({
      emailShow: v,
      phoneShow: false,
    })
  }

  render() {
    const { phoneShow, emailShow } = this.state;
    const { details: { basic }, type } = this.props;
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
            <a>变更</a>
          </DescriptionsItem>
          <DescriptionsItem span={2} label="移动电话">
            <img
              src={Flag}
              width="10"
              height="10"
              style={{ borderRadius: '50%', marginBottom: '3px' }}
            />&nbsp;&nbsp;
            {basic.mobilePhoneCountryCode}&nbsp;&nbsp;
            {basic.mobilePhone}&nbsp;&nbsp;&nbsp;
            <a onClick={() => { this.checkPhone(true) }}>变更</a>
          </DescriptionsItem>
          <DescriptionsItem span={2} label="邮箱">
            {basic.email}&nbsp;&nbsp;&nbsp;
            <a onClick={() => { this.checkEmail(true) }}>变更</a>
          </DescriptionsItem>
          <DescriptionsItem span={2} label="电话">
            <img
              src={Flag}
              width="10"
              height="10"
              style={{ borderRadius: '50%', marginBottom: '3px' }}
            />&nbsp;&nbsp;
            {basic.telephoneCountryCode}&nbsp;&nbsp;
            {basic.telephoneAreaCode}
            {basic.telephone ? `-${basic.telephone}` : ''}
            {basic.telephoneExtension ? `-${basic.telephoneExtension}--` : ''}&nbsp;&nbsp;&nbsp;
            <a>变更</a>
          </DescriptionsItem>
          <DescriptionsItem span={2} label="传真">
            {basic.fax ? <img
              src={Flag}
              width="10"
              height="10"
              style={{ borderRadius: '50%', marginBottom: '3px' }}
              /> : ''}&nbsp;&nbsp;
            {basic.faxCountryCode}&nbsp;&nbsp;
            {basic.faxAreaCode}
            {basic.fax ? `${basic.fax}-` : ''}
            {basic.faxExtension ? `${basic.faxExtension}-` : ''}
          </DescriptionsItem>
          <DescriptionsItem span={1} label="邮政编码">{basic.postCode}</DescriptionsItem>
          <DescriptionsItem span={1} label="时区">{basic.timeZoneCode}</DescriptionsItem>
          <DescriptionsItem span={2} label="语言">{basic.languageCode}</DescriptionsItem>
          <DescriptionsItem span={2} label="特性行业类别">
            {basic.industryCode}&nbsp;&nbsp;&nbsp;
            <a>变更</a>
          </DescriptionsItem>
          <DescriptionsItem span={6} label="通讯地址">
            {basic.address}
          </DescriptionsItem>
          <DescriptionsItem span={2} label={type === 'supplier' ? '采购冻结' : '销售冻结'}>
            <Badge status="error"/>&nbsp;冻结</DescriptionsItem>
        </Descriptions>
        <CheckPhone phoneShow={phoneShow} checkPhone={v => { this.checkPhone(v) }}/>
        <CheckEmail emailShow={emailShow} checkEmail={v => { this.checkEmail(v) }}/>
        {/* <CheckEmail emailShow={emailShow} proceed="true" emailAccount="123456@qq.com" />
            checkEmail={v => { this.checkEmail(v) }} */}
      </Card>
    );
  }
}

export default BasicInfo;

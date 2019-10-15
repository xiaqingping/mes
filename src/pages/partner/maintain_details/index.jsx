import { Icon } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import PersonCertification from '@/pages/partner/maintain_edit/components/PersonCertification';
import PersonCredit from '@/pages/partner/maintain_edit/components/PersonCredit';
import BasicInfo from './components/BasicInfo';
import Type from './components/Type';
import Credit from './components/Credit';
import HomeAuthentication from './components/HomeAuthentication';
import AbroadAuthentication from './components/AbroadAuthentication';
import Address from './components/Address';
import Bank from './components/Bank';
import PurchasingOrg from './components/PurchasingOrg'


@connect(({ partnerMaintainEdit }) => ({
  details: partnerMaintainEdit.details,
}))
class CustomerDetails extends Component {
  state = {
    width: '100%',
    tabActiveKey: 'customer',
  };

  componentDidMount() {
    const details = {
      // 基础信息
      basic: {
        type: 1,
        name: '张三',
        telephoneCountryCode: 3,
        mobilePhone: {
          mobilePhoneCountryCode: '+86',
          mobilePhone: '18735812924',
        },
        email: '123@qq.com',
        telephone: {
          telephoneCountryCode: '+86',
          telephoneAreaCode: '1234',
          telephone: '57072136',
          telephoneExtension: '2136',
        },
        fax: {
          faxCountryCode: '+86',
          faxAreaCode: '1234',
          fax: '54072136',
          faxExtension: '2136',
        },
        postCode: '200000',
        timeZoneCode: '8',
        languageCode: '1',
        industryCode: '1',
        address: {
          countryCode: '',
          countryName: '',
          provinceCode: '',
          provinceName: '',
          cityCode: '',
          cityName: '',
          countyCode: '',
          countyName: '',
          streetCode: '',
          streetName: '',
          address: '',
        },
      },
      // 销售范围
      salesRangeList: [],
      // 信贷数据
      creditList: [
        {
          invoicePartyId: 123,
          invoicePartyCode: 12345,
          invoicePartyName: '上海交通大学',
          currencyCode: 'CNY',
          credit: '40000',
          creditPeriod: '30',
          tempCreditLimit: '60000',
          tempCreditLimitExpirationDate: '2019-10-30',
          billingCycle: '50',
          billingDay: '25',
          lastEvaluationDate: '2019-10-01',
        },
      ],
      // 组织认证
      organizationCertification: {
        specialInvoice: true,
        taxNo: 123,
        bankCode: 12345,
        bankAccount: '60045612378',
        address: '注册地址',
        notes: '这是一段认证说明',
        telephone: {
          telephoneCountryCode: '+86',
          telephoneAreaCode: '1234',
          telephone: '57072136',
          telephoneExtension: '2136',
        },
        attachmentList: [
          { code: 'https://blog.maxmeng.top/images/avatar.jpg', name: '照片', type: 'image' },
        ],
      },
      // 负责人认证
      piCertification: [
        {
          id: 1,
          invoicePartyId: 123,
          invoicePartyCode: 12345,
          invoicePartyName: '上海交通大学11',
          status: 1,
          notes: '这是一段认证说明',
          attachmentList: [
            { code: 'https://blog.maxmeng.top/images/avatar.jpg', name: '照片', type: 'image' },
          ],
        },
      ],
      // 收货地址
      addressList: [
        {
          id: 1,
          name: 'name',
          phone: {
            mobilePhoneCountryCode: '+86',
            mobilePhone: '18735812924',
          },
          postCode: '123456',
          address: '上海市松江区香闵路698号',
        },
      ],
      // 采购组织
      purchaseOrganizationList: [
        {
          purchaseOrganizationCode: 'BBI',
          salerName: '张三',
          salerTelephoneCountryCode: '+86',
          salerTelephone: '18735818888',
          payTermsCode: '1',
          currencyCode: '1',
          levelCode: '1',
          invoicePostInReceive: true,
          purchaseGroupCode: '1',
          deliveryPlanDays: '1',
        },
      ],
      // 付款银行
      paymentBank: {
        countryCode: '1',
        bankCode: '1',
        bankAccount: '6666666666',
        bankAccountName: 'Max',
      },
    };
    this.props.dispatch({
      type: 'partnerMaintainEdit/setDetails',
      payload: details,
    });
    window.addEventListener('resize', this.resizeFooterToolbar, { passive: true });
    this.resizeFooterToolbar();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  resizeFooterToolbar = () => {
    requestAnimationFrame(() => {
      const sider = document.querySelectorAll('.ant-layout-sider')[0];
      if (sider) {
        const width = `calc(100% - ${sider.style.width})`;
        const { width: stateWidth } = this.state;
        if (stateWidth !== width) {
          this.setState({ width });
        }
      }
    });
  };

  onTabChange = tabActiveKey => {
    this.setState({
      tabActiveKey,
    });
  };

  title = () => (
      <div>
        <span>查看 123</span>&nbsp;&nbsp;&nbsp;&nbsp;
        <a title="编辑"><Icon type="edit" style={{ color: 'black' }} /></a>
      </div>
    )

  render() {
    const { tabActiveKey } = this.state;
    const { details } = this.props;
    if (!details) {
      return null;
    }

    const contentList = {
      customer: (
        <>
        <BasicInfo/>
        <Type/>
        {
          details.basic.type === 1 ?
          (
            <>
              <Credit/>
              {details.basic.telephoneCountryCode === 1 ?
              <HomeAuthentication/> : <AbroadAuthentication
              abroadType={details.basic.telephoneCountryCode}/>}
            </>
          ) : (
            <>
              <PersonCredit/>
              <PersonCertification/>
            </>
          )
        }
        <Address/>
      </>
      ),
      supplier: (
        <>
        <BasicInfo/>
        <PurchasingOrg/>
        <Bank/>
        {
          details.basic.type === 1 ?
          (
            <>
              {details.basic.telephoneCountryCode === 1 ?
              <HomeAuthentication/> : <AbroadAuthentication
              abroadType={details.basic.telephoneCountryCode}/>}
            </>
          ) : ''
        }
      </>
      ),
    };
    return (
      <PageHeaderWrapper
        tabActiveKey={tabActiveKey}
        onTabChange={this.onTabChange}
        title={this.title()}
        style={{ paddingBottom: 0 }}
        tabList={[
          {
            key: 'customer',
            tab: '客户',
          },
          {
            key: 'supplier',
            tab: '供应商',
          },
        ]}
      >
        {contentList[tabActiveKey]}
      </PageHeaderWrapper>
    );
  }
}

export default CustomerDetails;

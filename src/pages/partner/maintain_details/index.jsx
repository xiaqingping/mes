import { Icon } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import PersonCertification from './components/PersonCertification';
import PersonCredit from './components/PersonCredit';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Link } from 'react-router-dom';
import BasicInfo from './components/BasicInfo';
import Type from './components/Type';
import Credit from './components/Credit';
import HomeAuthentication from './components/HomeAuthentication';
import AbroadAuthentication from './components/AbroadAuthentication';
import Address from './components/Address';
import Bank from './components/Bank';
import PurchasingOrg from './components/PurchasingOrg';
import api from '@/api';


@connect(({ partnerMaintainEdit }) => ({
  customer: partnerMaintainEdit.details,
  type: partnerMaintainEdit.type,
  supplier: partnerMaintainEdit.supplier,
}))
class CustomerDetails extends Component {
  state = {
    width: '100%',
    tabActiveKey: 'customer',
  };

  componentDidMount() {
    // const details = {
    //   // 基础信息
    //   basic: {
    //     id: 1,
    //     type: 2,
    //     code: 110,
    //     name: '张三',
    //     certificationStatus: 4,
    //     mobilePhoneCountryCode: '+86',
    //     mobilePhone: 13212345678,
    //     mobilePhoneVerifyStatus: 1,
    //     email: '12345678@qq.com',
    //     emailVerifyStatus: 1,
    //     telephoneCountryCode: 2,
    //     telephoneAreaCode: '021',
    //     telephone: '57771234',
    //     telephoneExtension: '6354',
    //     faxCountryCode: '+86',
    //     faxAreaCode: '1234',
    //     fax: '54072136',
    //     faxExtension: '2136',
    //     postCode: '200000',
    //     timeZoneCode: 'UTC',
    //     languageCode: '中文',
    //     industryCode: '生物类',
    //     countryCode: '1001',
    //     countryName: '中国',
    //     cityCode: '021',
    //     cityName: '上海市',
    //     countyCode: '011',
    //     countyName: '松江区',
    //     streetCode: '43223',
    //     streetName: '香闵路',
    //     address: '上海市松江区香闵路******号',
    //   },
    //   customer: {
    //     taxesCityCode: '',
    //     taxesCountyCOde: '',
    //     salesOrderBlock: 1,
    //     salesAreaList: [
    //       { salesOrganizationCode: 1,
    //       distributionChannelCode: '生工国内电商',
    //       regionCode: '华东大区1',
    //       officeCode: '山东网点',
    //       defaultPaymentMethodCode: '银行付款',
    //       currencyCode: '人民币',
    //       salesOrderBlock: 1,
    //       defaultnvoiceTypeCode: '增值税专用发票',
    //       taxClassificCode: '免税',
    //       invoicePartyList: this.getInvoice(),
    //       soldToPartyList: this.getSold(),
    //       shipToPartyList: this.getShip(),
    //       salerList: this.getSaler(),
    //     },
    //       {
    //         salesOrganizationCode: 2,
    //         distributionChannelCode: '生工国外电商',
    //         regionCode: '华东大区2',
    //         officeCode: '山东网点',
    //         defaultPaymentMethodCode: '银行付款',
    //         currencyCode: '美元',
    //         defaultnvoiceTypeCode: '增值税专用发票',
    //         taxClassificCode: '免税',
    //         invoicePartyList: this.getInvoice(),
    //         soldToPartyList: this.getSold(),
    //         shipToPartyList: this.getShip(),
    //         salerList: this.getSaler(),
    //       },
    //       {
    //         salesOrganizationCode: 3,
    //         distributionChannelCode: '生工国内直销',
    //         regionCode: '华东大区3',
    //         officeCode: '山东网点',
    //         defaultPaymentMethodCode: '银行付款',
    //         currencyCode: '人民币',
    //         defaultnvoiceTypeCode: '增值税专用发票',
    //         taxClassificCode: '免税',
    //         invoicePartyList: this.getInvoice(),
    //         soldToPartyList: this.getSold(),
    //         shipToPartyList: this.getShip(),
    //         salerList: this.getSaler(),
    //       },
    //       {
    //         salesOrganizationCode: 4,
    //         distributionChannelCode: '生工国外直销',
    //         regionCode: '华东大区4',
    //         officeCode: '山东网点',
    //         defaultPaymentMethodCode: '银行付款',
    //         currencyCode: '英镑',
    //         defaultnvoiceTypeCode: '增值税专用发票',
    //         taxClassificCode: '免税',
    //         invoicePartyList: this.getInvoice(),
    //         soldToPartyList: this.getSold(),
    //         shipToPartyList: this.getShip(),
    //         salerList: this.getSaler(),
    //       },
    //     ],
    //     // 收货地址
    //     addressList: [
    //       {
    //         id: 1,
    //         countryCode: 'name',
    //         countryName: '',
    //         provinceCode: '',
    //         provinceName: '',
    //         cityCode: '',
    //         cityName: '',
    //         countyCode: '',
    //         countyName: '',
    //         streetCode: '',
    //         streetName: '',
    //         address: '上海市松江区香闵路698号上海市松江区香闵路698号上海市松江区香闵路698号上海市松江区香闵路698号',
    //         name: '大王',
    //         mobilePhoneCountryCode: '',
    //         mobilePhone: '15012345678',
    //         postCode: '201200',
    //         source: '',
    //       },
    //       {
    //         id: 2,
    //         countryCode: 'name',
    //         countryName: '',
    //         provinceCode: '',
    //         provinceName: '',
    //         cityCode: '',
    //         cityName: '',
    //         countyCode: '',
    //         countyName: '',
    //         streetCode: '',
    //         streetName: '',
    //         address: '上海市松江区香闵路***号',
    //         name: '小王',
    //         mobilePhoneCountryCode: '',
    //         mobilePhone: '15112345678',
    //         postCode: '201600',
    //         source: '',
    //       },
    //     ],
    //   },
    //   // 信贷数据
    //   creditList: [
    //     {
    //       invoicePartyId: 123,
    //       invoicePartyCode: 12345,
    //       invoicePartyName: '上海交通大学',
    //       currencyCode: 'CNY',
    //       credit: '40000',
    //       creditPeriod: '30',
    //       tempCreditLimit: '60000',
    //       tempCreditLimitExpirationDate: '2019-10-30',
    //       billingCycle: '50',
    //       billingDay: '25',
    //       lastEvaluationDate: '2019-10-01',
    //     },
    //     {
    //       invoicePartyId: 123,
    //       invoicePartyCode: 12345,
    //       invoicePartyName: '上海交通大学',
    //       currencyCode: 'CNY',
    //       credit: '40000',
    //       creditPeriod: '30',
    //       tempCreditLimit: '60000',
    //       tempCreditLimitExpirationDate: '2019-10-30',
    //       billingCycle: '50',
    //       billingDay: '25',
    //       lastEvaluationDate: '2019-10-01',
    //     },
    //   ],
    //   // 组织认证
    //   organizationCertification: {
    //     specialInvoice: true,
    //     taxNo: 123,
    //     bankCode: 12345,
    //     bankAccount: '60045612378',
    //     address: '上海市松江区*****注册',
    //     notes: '这是一段认证说明',
    //     telephone: {
    //       telephoneCountryCode: '+86',
    //       telephoneAreaCode: '1234',
    //       telephone: '57072136',
    //       telephoneExtension: '2136',
    //     },
    //     attachmentList: [
    //       { code: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&
    // sec=1571310110031&di=c5c3557d5172db919d831cca34586e4c&imgtype=0
    // &src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20170718
    // %2Fdc7a88ed8b5146368b068fc71c8c8533.jpeg', name: '照片',
    // type: 'image' },
    //     ],
    //   },
    //   // 负责人认证
    //   piCertification: [
    //     {
    //       id: 1,
    //       invoicePartyId: 123,
    //       invoicePartyCode: 1,
    //       invoicePartyName: '上海交通大学11',
    //       status: 1,
    //       notes: '这是一段认证说明',
    //       attachmentList: [
    //         { code: 'https://timgsa.baidu.com/timg?image&quality=80&
    // size=b9999_10000&sec=1571310110031&di=c5c3557d5172db919d831cca34586e4c&
    // imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20170718
    // %2Fdc7a88ed8b5146368b068fc71c8c8533.jpeg', name: '照片', type: 'image' },
    //       ],
    //     },
    //   ],
    //   // 采购组织
    //   purchaseOrganizationList: [
    //     {
    //       purchaseOrganizationCode: 'BBI',
    //       salerName: '张三',
    //       salerTelephoneCountryCode: '+86',
    //       salerTelephone: '18735818888',
    //       payTermsCode: '1',
    //       currencyCode: '1',
    //       levelCode: '1',
    //       invoicePostInReceive: true,
    //       purchaseGroupCode: '1',
    //       deliveryPlanDays: '1',
    //     },
    //   ],
    //   // 付款银行
    //   paymentBank: {
    //     countryCode: '1',
    //     bankCode: '1',
    //     bankAccount: '6666666666',
    //     bankAccountName: 'Max',
    //   },
    // };
    // const supplier = {
    //   // 基础信息
    //   basic: {
    //     id: 1,
    //     type: 1,
    //     code: 110,
    //     name: '李四',
    //     certificationStatus: 4,
    //     mobilePhoneCountryCode: '+86',
    //     mobilePhone: 13212345678,
    //     mobilePhoneVerifyStatus: 1,
    //     email: 'abdc@qq.com',
    //     emailVerifyStatus: 1,
    //     telephoneCountryCode: 3,
    //     telephoneAreaCode: '021',
    //     telephone: '57771234',
    //     telephoneExtension: '6354',
    //     faxCountryCode: '+86',
    //     faxAreaCode: '1234',
    //     fax: '54072136',
    //     faxExtension: '2136',
    //     postCode: '200000',
    //     timeZoneCode: 'UTC',
    //     languageCode: '中文',
    //     industryCode: '生物类',
    //     countryCode: '1001',
    //     countryName: '中国',
    //     provinceCOde: '021',
    //     provinceName: '上海',
    //     cityCode: '021',
    //     cityName: '上海市',
    //     countyCode: '011',
    //     countyName: '松江区',
    //     streetCode: '43223',
    //     streetName: '香闵路',
    //     address: '上海市松江区香闵路******号',
    //   },
    //   vendor: {
    //     invoicePostBlock: '',
    //     purchasingOrganizationList: [
    //       {
    //         purchasingOrganizationCode: 'BBI',
    //         salerName: '销售员',
    //         salerTelephoneCountryCode: '销售员电话国家',
    //         salerTelephone: '销售员电话',
    //         paymentTermsCode: '付款条件',
    //         currencyCode: '币种',
    //         levelCode: '供应商等级',
    //         invoicePostInReceive: '收货时发票过账',
    //         purchasingGroupCode: '采购组',
    //         deliveryPlanDays: '计划交货时间',
    //       },
    //       {
    //         purchasingOrganizationCode: 'NBS',
    //         salerName: '王五',
    //         salerTelephoneCountryCode: '销售员电话国家',
    //         salerTelephone: '15555555555',
    //         paymentTermsCode: '看着办',
    //         currencyCode: '美元',
    //         levelCode: '5',
    //         invoicePostInReceive: '是',
    //         purchasingGroupCode: '王族',
    //         deliveryPlanDays: '5天',
    //       },
    //     ],
    //     // 付款银行
    //     paymentBank: {
    //       countryCode: '中国',
    //       bankCode: '1',
    //       bankName: '生工发展银行',
    //       bankAccount: '888888',
    //       bankAccountName: 'niko',
    //     },
    //   },
    //   // 信贷数据
    //   creditList: {
    //       invoicePartyId: 123,
    //       invoicePartyCode: 12345,
    //       invoicePartyName: '上海交通大学',
    //       currencyCode: 'CNY',
    //       credit: '40000',
    //       creditPeriod: '30',
    //       tempCreditLimit: '60000',
    //       tempCreditLimitExpirationDate: '2019-10-30',
    //       billingCycle: '50',
    //       billingDay: '25',
    //       lastEvaluationDate: '2019-10-01',
    //     },
    //   // 组织认证
    //   organizationCertification: {
    //     effectiveDate: '生效时间',
    //     specialInvoice: true,
    //     taxNo: 123,
    //     bankCode: 12345,
    //     bankAccount: '60045612378',
    //     address: '上海市松江区*****注册',
    //     notes: '这是一段认证说明123',
    //     attachmentList: [
    //       { code: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&
    // sec=1571461183194&di=988ae3492cd61dcd8acd8381a14996ed&imgtype=0&
    // src=http%3A%2F%2Fimg.51ztzj.com%2Fupload%2Fimage%2F20150213%2
    // Fdn201502034005_670x419.jpg', name: '照片', type: 'image' },
    //     ],
    //   },
    // };
    api.bp.getBPCustomer(this.props.match.params.id).then(res => {
      this.props.dispatch({
        type: 'partnerMaintainEdit/setDetails',
        payload: res,
      });
    })
    api.bp.getBPVendor(this.props.match.params.id).then(res => {
      this.props.dispatch({
        type: 'partnerMaintainEdit/setSupplier',
        payload: res,
      });
    })
    // this.props.dispatch({
    //   type: 'partnerMaintainEdit/setDetails',
    //   payload: details,
    // });
    // this.props.dispatch({
    //   type: 'partnerMaintainEdit/setSupplier',
    //   payload: supplier,
    // });
    window.addEventListener('resize', this.resizeFooterToolbar, { passive: true });
    this.resizeFooterToolbar();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  // 收票方数据
  getInvoice = () => {
    const data = [];
    for (let i = 0; i < 5; i++) {
      data.push({
        id: i,
        name: `${Math.ceil((Math.random() + 0.0001) * 100000000)} 上海复旦大学`,
        code: Math.ceil((Math.random() + 0.0001) * 100000000),
        type: Math.ceil((Math.random() + 0.0001) * 2),
        soldToPartyId: i,
        soldTopartyCode: Math.ceil((Math.random() + 0.0001) * 100000000),
        soldToPartyName: `${Math.ceil((Math.random() + 0.0001) * 100000000)} 上海同济大学`,
        verifyStatus: Math.ceil((Math.random() + 0.0001) * 2),
      });
    }
    return data
  };

  // 售达方数据
  getSold = () => {
    const data = [];
    for (let i = 0; i < 5; i++) {
      data.push({
        id: i,
        name: `${Math.ceil((Math.random() + 0.0001) * 100000000)} 上海复旦大学`,
        code: Math.ceil((Math.random() + 0.0001) * 100000000),
        type: Math.ceil((Math.random() + 0.0001) * 2),
        linkVerifyStatus: Math.ceil((Math.random() + 0.0001) * 2),
      });
    }
    return data
  }

  // 送达方数据
  getShip = () => {
    const data = [];
    for (let i = 0; i < 5; i++) {
      data.push({
        id: i,
        name: `${Math.ceil((Math.random() + 0.0001) * 100000000)} 上海复旦大学`,
        code: Math.ceil((Math.random() + 0.0001) * 100000000),
        type: Math.ceil((Math.random() + 0.0001) * 2),
        verifyStatus: Math.ceil((Math.random() + 0.0001) * 2),
      });
    }
    return data
  }

    // 销售员数据
    getSaler = () => {
      const data = [];
      for (let i = 0; i < 5; i++) {
        data.push({
          name: `${Math.ceil((Math.random() + 0.0001) * 100000000)} 上海复旦大学`,
          code: Math.ceil((Math.random() + 0.0001) * 100000000),
        });
      }
      return data
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
    this.props.dispatch({
      type: 'partnerMaintainEdit/setType',
      payload: tabActiveKey,
    });
    this.setState({
      tabActiveKey,
    });
  };

  title = v => {
    const { match: { params: { id } } } = this.props;
    return (
      <div>
  <span>查看 {v}</span>&nbsp;&nbsp;&nbsp;&nbsp;
        <Link to={`/partner/maintain/edit/${id}`} onClick={() => {
          this.props.dispatch({
            type: 'partnerMaintainEdit/setDetails',
            payload: null,
          })
          this.props.dispatch({
            type: 'partnerMaintainEdit/setType',
            payload: null,
          })
          this.props.dispatch({
            type: 'partnerMaintainEdit/setSupplier',
            payload: null,
          })
        }}><Icon type="edit" style={{ color: 'black' }} /></Link>
      </div>
    )
}

  render() {
    const { tabActiveKey } = this.state;
    const { customer } = this.props;
    if (!customer) {
      return null;
    }

    const contentList = {
      customer: (
        <>
        <BasicInfo/>
        <Type/>
        {
          customer.basic.type === 1 ?
          (
            <>
              <PersonCredit/>
              <PersonCertification/>
            </>
          ) : (
            <>
              <Credit/>
              {customer.basic.countryCode === 'CN' ?
              <HomeAuthentication/> : <AbroadAuthentication/>}
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
          customer.basic.type === 2 ?
          (
            <>
              {customer.basic.countryCode === 'CN' ?
              <HomeAuthentication/> : <AbroadAuthentication
              abroadType={customer.basic.telephoneCountryCode}/>}
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
        title={this.title(customer.basic.code)}
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

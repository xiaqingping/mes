import {
  Form,
  Card,
  Button,
} from 'antd';
import React, { Component } from 'react';

import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import FooterToolbar from '@/components/FooterToolbar';

import Basic from './components/Basic';
import SalesScope from './components/SalesScope';
import OrgCredit from './components/OrgCredit';
import OrgCertification from './components/OrgCertification';
import PersonCredit from './components/PersonCredit';
import PersonCertification from './components/PersonCertification';
import Address from './components/Address';
import PurchasingOrg from './components/PurchasingOrg';
import Bank from './components/Bank';

@connect(({ partnerMaintainEdit }) => ({
  details: partnerMaintainEdit.details,
}))
class CustomerEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: '100%',
      tabActiveKey: 'customer',
    };
  }

  componentDidMount() {
    const details = {
      // 基础信息
      basic: {
        name: {
          type: 2,
          name: '',
        },
        email: '123@qq.com',
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
          invoicePartyName: '上海交通大学',
          status: 1,
          notes: '这是一段认证说明',
          attachmentList: [
            { code: 'https://blog.maxmeng.top/images/avatar.jpg', name: '照片', type: 'image' },
          ],
        },
      ],
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

  validate = () => {
    const {
      form: { validateFieldsAndScroll },
    } = this.props;
    // 验证表单
    // console.log(this.form.validate());

    validateFieldsAndScroll((error, values) => {
      console.log(values);
      if (!error) {
        //
      }
    });
  }

  onDetailsChange = (key, value) => {
    const details = {
      ...this.props.details,
      [key]: value,
    };
    this.props.dispatch({
      type: 'partnerMaintainEdit/setDetails',
      payload: details,
    });
  }

  // 客户
  renderCustomer = details => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { basic, addressList } = details;

    return (
      <>
        <Card title="基础信息" bordered={false} style={{ marginBottom: '24px' }}>
          {getFieldDecorator('basic', {
            initialValue: basic,
          })(<Basic
            // eslint-disable-next-line no-return-assign
            wrappedComponentRef={form => this.form = form}
            onChange={data => this.onDetailsChange('basic', data)}
          />)}
        </Card>
        <SalesScope></SalesScope>
        {
          basic.name.type === 2 ?
          (
            <>
              <OrgCredit></OrgCredit>
              <OrgCertification></OrgCertification>
            </>
          ) : (
            <>
              <PersonCredit></PersonCredit>
              <PersonCertification></PersonCertification>
            </>
          )
        }

        <Card title="收货地址" bordered={false}>
          {getFieldDecorator('addressList', {
            initialValue: { data: addressList },
          })(<Address onChange={data => this.onDetailsChange('addressList', data.data)} />)}
        </Card>
      </>
    );
  }

  // 供应商
  renderSupplier = details => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { basic } = details;
    return (
      <>
        <Card title="基础信息" bordered={false} style={{ marginBottom: '24px' }}>
          {getFieldDecorator('basic', {
            initialValue: basic,
          })(<Basic
            // eslint-disable-next-line no-return-assign
            wrappedComponentRef={form => this.form = form}
            onChange={data => this.onDetailsChange('basic', data)}
          />)}
        </Card>
        <PurchasingOrg></PurchasingOrg>
        <Bank></Bank>
      </>
    );
  }

  renderContent = () => {
    const { tabActiveKey } = this.state;
    const { details } = this.props;

    switch (tabActiveKey) {
      case 'customer':
         return this.renderCustomer(details);

      case 'supplier':
        return this.renderSupplier(details);

      default:
          break;
    }

    return null;
  }

  render() {
    const { width, tabActiveKey } = this.state;
    if (!this.props.details) {
      return null;
    }

    return (
      <PageHeaderWrapper
        title="修改 100001"
        tabActiveKey={tabActiveKey}
        onTabChange={this.onTabChange}
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
        <div style={{ paddingBottom: 50 }}>
          {this.renderContent()}
        </div>
        <FooterToolbar style={{ width }}>
          <Button>取消</Button>
          <Button type="primary" onClick={this.validate}>提交</Button>
        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(CustomerEdit);

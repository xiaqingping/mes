import {
  Form,
  Button,
} from 'antd';
import React, { Component } from 'react';

import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import FooterToolbar from '@/components/FooterToolbar';

import Basic from './components/Basic';
import SalesArea from './components/SalesArea';
import OrgCredit from './components/OrgCredit';
import OrgCertification from './components/OrgCertification';
import PersonCredit from './components/PersonCredit';
import PersonCertification from './components/PersonCertification';
import Address from './components/Address';
import PurchasingOrg from './components/PurchasingOrg';
import Bank from './components/Bank';

@connect(({ partnerMaintainEdit }) => ({
  details: partnerMaintainEdit.details || {},
}))
class CustomerEdit extends Component {
  constructor(props) {
    super(props);
    const editType = props.location.pathname.indexOf('/add') > -1 ? 'add' : 'update';
    this.state = {
      editType,
      width: '100%',
      tabActiveKey: 'customer',
      // tabActiveKey: 'vendor',
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar, { passive: true });
    this.resizeFooterToolbar();

    console.log(123);
    this.props.dispatch({
      type: 'basic/getCountrys',
    });
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

  // 提交
  validate = () => {
    // TODO: 子组件方法
    // this.basicView.wrappedInstance.validate();

    // 在这里做数据验证，验证通过后，根据情况做数据转换，然后再提交


    const { editType } = this.state;
    if (editType === 'add') {
      this.add();
    } else {
      this.update();
    }
  }

  // 新增
  add = () => {
    const data = JSON.parse(JSON.stringify(this.props.details)) || {};
    const customer = data.customer || {};
    const salesAreaList = customer.salesAreaList || [];

    salesAreaList.forEach(e => {
      const soldToPartyList = e.soldToPartyList || [];
      const shipToPartyList = e.shipToPartyList || [];
      const salerList = e.salerList || [];

      delete e.soldToPartyList;
      delete e.shipToPartyList;
      delete e.salerList;

      e.soldToPartyIdList = soldToPartyList.map(e1 => e1.id);
      e.shipToPartyIdList = shipToPartyList.map(e1 => e1.id);
      e.salerCodeList = salerList.map(e1 => e1.id);
    });

    console.log(data);
  }

  // 修改
  update = () => {

  }

  // 客户
  renderCustomer = details => {
    const { editType, tabActiveKey } = this.state;
    const { basic } = details;
    const type = (basic && basic.type) || 1;

    return (
      <>
        <Basic
          tabActiveKey={tabActiveKey}
          // eslint-disable-next-line no-return-assign
          wrappedComponentRef={ref => this.basicView = ref}
        />
        <SalesArea />
        {
          type === 2 ?
          (
            <>
              { editType === 'update' ? <OrgCredit /> : null }
              <OrgCertification />
            </>
          ) : (
            <>
              { editType === 'update' ? <PersonCredit /> : null }
              <PersonCertification />
            </>
          )
        }
        <Address />
      </>
    );
  }

  // 供应商
  renderVendor = details => {
    const { tabActiveKey } = this.state;
    const { basic } = details;
    const type = (basic && basic.type) || 1;
    return (
      <>
        <Basic
          tabActiveKey={tabActiveKey}
          // eslint-disable-next-line no-return-assign
          wrappedComponentRef={form => this.form = form}
        />
        <PurchasingOrg />
        <Bank />
        { type === 2 ? <OrgCertification /> : null }
      </>
    );
  }

  renderContent = () => {
    const { tabActiveKey } = this.state;
    const { details } = this.props;

    switch (tabActiveKey) {
      case 'customer':
         return this.renderCustomer(details);

      case 'vendor':
        return this.renderVendor(details);

      default:
          break;
    }

    return null;
  }

  render() {
    const { width, tabActiveKey } = this.state;

    return (
      <PageHeaderWrapper
        title="新增业务伙伴"
        tabActiveKey={tabActiveKey}
        onTabChange={this.onTabChange}
        style={{ paddingBottom: 0 }}
        tabList={[
          {
            key: 'customer',
            tab: '客户',
          },
          {
            key: 'vendor',
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

import {
  Form,
  Button,
  Spin,
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

import { bp } from '@/api';
import { validateForm, diff, guid } from '@/utils/utils';

@connect(({ bpEdit }) => ({
  details: bpEdit.details || {},
}))
class CustomerEdit extends Component {
  constructor(props) {
    super(props);
    const editType = props.location.pathname.indexOf('/add') > -1 ? 'add' : 'update';
    this.state = {
      oldDetails: {}, // 修改模式下，应保存一份原始数据，以便提交时，对比数据并调整数据结构
      pageLoading: false,
      editType,
      width: '100%',
      tabActiveKey: 'customer',
      // tabActiveKey: 'vendor',
    };
    this.props.dispatch({
      type: 'bpEdit/setState',
      payload: {
        type: 'editType',
        data: editType,
      },
    });
    this.props.dispatch({
      type: 'bpEdit/setState',
      payload: {
        type: 'uuid',
        data: guid(),
      },
    });
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'bpEdit/addInitDetails',
      payload: {},
    });

    window.addEventListener('resize', this.resizeFooterToolbar, { passive: true });
    this.resizeFooterToolbar();
    this.getCacheData();
    this.getBpDetails();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
    this.props.dispatch({
      type: 'bpEdit/setState',
      payload: {
        type: 'details',
        data: {},
      },
    });
  }

  // 编辑模式为修改时，获取BP数据
  getBpDetails = () => {
    const { editType } = this.state;
    if (editType !== 'update') return;

    this.setState({ pageLoading: true });

    const { location, match, dispatch } = this.props;
    const { params: { id } } = match;
    const { query: { type } } = location;
    dispatch({
      type: 'bpEdit/readBPDetails',
      payload: { id, type },
    });
  }

  // 获取此页面需要用到的基础数据
  getCacheData() {
    const basicCacheList = [
      { type: 'countrys' }, // 国家
      { type: 'countryDiallingCodes' }, // 国家拨号代码
      { type: 'industryCategories' }, // 行业类别
      { type: 'salesPaymentMethods' }, // 付款方式
      { type: 'regionOffice' }, // 大区+网点
      { type: 'currencies' }, // 货币
      { type: 'taxOutputClassifics' }, // 税分类
      { type: 'paymentTerms' }, // 付款条件
      { type: 'purchaseGroups' }, // 采购组
      { type: 'purchaseOrganizations' }, // 采购组织
      { type: 'salesArea' }, // 销售范围
      { type: 'salesOrganizations' }, // 销售组织
      { type: 'distributionChannels' }, // 分销渠道
      { type: 'countryTimeZone' }, // 国家+时区
      { type: 'countryProvinceTimeZone' }, // 国家+时区
    ];
    basicCacheList.forEach(item => {
      this.props.dispatch({
        type: 'basicCache/getCache',
        payload: item,
      });
    });

    const areaCacheList = [
      { type: 'countrys', options: 0 },
    ];
    areaCacheList.forEach(item => {
      this.props.dispatch({
        type: 'areaCache/getCache',
        payload: item,
      });
    });
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
  validate = async () => {
    // 验证basic
    const basicForm = this.basicView.wrappedInstance.props.form;
    const basicResult = await validateForm(basicForm)
    if (!basicResult[0]) return;

    console.log(this.state.details);

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

    const { tabActiveKey } = this.state;
    let newData = {};
    if (tabActiveKey === 'customer') {
      newData = {
        basic: data.basic,
        customer: data.customer,
      }
    } else {
      newData = {
        basic: data.basic,
        vendor: data.vendor,
      }
    }
    if (data.basic.type === 1) {
      newData.piCertificationList = data.piCertificationList;
    } else {
      newData.organizationCertification = data.organizationCertification;
    }

    console.log(newData);
    bp.addBP(newData).then(res => {
      console.log(res);
    });
  }

  // 修改
  update = () => {
    const { oldDetails } = this.state;
    const data = JSON.parse(JSON.stringify(this.props.details)) || {};
    const customer = data.customer || {};
    const salesAreaList = customer.salesAreaList || [];

    // TODO:
    // 新增收票方
    salesAreaList.newInvoicePartyList = [];
    salesAreaList.invoicePartyList.forEach(e => {
      if (e.id > 0) return;
      salesAreaList.newInvoicePartyList.push({ id: e.id, soldToPartyId: e.soldToPartyId });
    });
    // 删除收票方
    salesAreaList.deleteInvoicePartyList = [];

    // 新增售达方
    salesAreaList.newSoldToPartyIdList = [];
    // 删除售达方
    salesAreaList.deleteSoldToPartyIdList = [];

    // 新增送达方
    salesAreaList.newShipToPartyIdList = [];
    // 删除送达方
    salesAreaList.deleteShipToPartyIdList = [];

    // 新增销售员
    salesAreaList.newsalerCodeList = [];
    // 删除销售员
    salesAreaList.deletesalerCodeList = [];

    const preAddressList = oldDetails.customer.addressList;
    const nextAddressList = customer.addressList;
    const addressDiff = diff(preAddressList, nextAddressList);
    // 新增地址
    customer.newAddressList = addressDiff.add;
    // 修改地址
    customer.modifyAddressList = addressDiff.update;
    // 删除地址
    customer.deleteAddressIdList = addressDiff.del;

    bp.updateBP(data).then(res => {
      console.log(res);
    });
  }

  // 客户
  renderCustomer = details => {
    const { editType, tabActiveKey } = this.state;
    const { basic } = details;
    const type = basic && basic.type;

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
          ) : null
        }
        {
          type === 1 ?
          (
            <>
            { editType === 'update' ? <PersonCredit /> : null }
              <PersonCertification />
            </>
          ) : null
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
    const { width, tabActiveKey, pageLoading } = this.state;

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
        <Spin spinning={pageLoading}>
          <div style={{ paddingBottom: 50 }}>
            {this.renderContent()}
          </div>
          <FooterToolbar style={{ width }}>
            <Button>取消</Button>
            <Button type="primary" onClick={this.validate}>提交</Button>
          </FooterToolbar>
        </Spin>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(CustomerEdit);

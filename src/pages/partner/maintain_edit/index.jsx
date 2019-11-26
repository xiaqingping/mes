import { Form, Button, Spin, Badge, Modal, message } from 'antd';
import React, { Component } from 'react';

import router from 'umi/router';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import FooterToolbar from '@/components/FooterToolbar';

import Basic from './components/Basic';
import SalesArea from './components/SalesArea';
import OrgCredit from './components/OrgCredit';
import OrgCertification from './components/OrgCertification';
import PersonCredit from './components/PersonCredit';
import PICertification from './components/PICertification';
import Address from './components/Address';
import PurchasingOrg from './components/PurchasingOrg';
import Bank from './components/Bank';

import { bp } from '@/api';
import { validateForm, diff } from '@/utils/utils';

@connect(({ loading, bpEdit }) => ({
  oldDetails: bpEdit.oldDetails || {},
  details: bpEdit.details || {},
  pageLoading: loading.effects['bpEdit/readBPDetails'] || false,
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
      // 客户数据必须
      // [0：没有设置过是否需要，1：需要，2：不需要]
      customerRequired: 0,
      // 客户数据是否验证通过
      // [0：没有验证过，1：通过，2：没通过]
      customerValidate: 0,
      // 供应商数据必须
      // [0：没有设置过是否需要，1：需要，2：不需要]
      vendorRequired: 0,
      // 供应商数据是否验证通过
      // [0：没有验证过，1：通过，2：没通过]
      vendorValidate: 0,
    };
    this.props.dispatch({
      type: 'bpEdit/setState',
      payload: {
        type: 'editType',
        data: editType,
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

    const { location, match, dispatch } = this.props;
    const {
      params: { id },
    } = match;
    const {
      query: { type },
    } = location;
    dispatch({
      type: 'bpEdit/readBPDetails',
      payload: { id, type },
    });
  };

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

    const areaCacheList = [{ type: 'countrys', options: 0 }];
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

  // 客户 供应商 切换时验证数据
  onTabChange = async tabActiveKey => {
    const self = this;
    let result;

    if (tabActiveKey === 'customer') {
      result = await this.validateVendor();
      const { vendorRequired } = this.state;
      if (result === 2 && vendorRequired === 0) {
        Modal.confirm({
          width: 470,
          title: '供应商数据未通过验证',
          content: (
            <>
              此业务伙伴是否是供应商？
              <br />
              如果选择“是”，则保存此业务伙伴时必须有供应商数据。
              <br />
              如果选择“否”，则不验证且不提交供应商数据。
            </>
          ),
          okText: '是',
          cancelText: '否',
          onOk() {
            self.setState({
              vendorRequired: 1,
              tabActiveKey,
            });
          },
          onCancel() {
            self.setState({
              vendorRequired: 2,
              tabActiveKey,
            });
          },
        });
        return;
      }
    }

    if (tabActiveKey === 'vendor') {
      result = await this.validateCustomer();
      const { customerRequired } = this.state;
      if (result === 2 && customerRequired === 0) {
        Modal.confirm({
          width: 470,
          title: '客户数据未通过验证',
          content: (
            <>
              此业务伙伴是否是客户？
              <br />
              如果选择“是”，则保存此业务伙伴时必须有客户数据。
              <br />
              如果选择“否”，则不验证且不提交客户数据。
            </>
          ),
          okText: '是',
          cancelText: '否',
          onOk() {
            self.setState({
              customerRequired: 1,
              tabActiveKey,
            });
          },
          onCancel() {
            self.setState({
              customerRequired: 2,
              tabActiveKey,
            });
          },
        });
        return;
      }
    }

    this.setState({
      tabActiveKey,
    });
  };

  // 验证客户数据
  validateCustomer = async () => {
    // 默认验证结果为：通过
    let validateResult = 1;

    // 基础数据验证
    if (!(validateResult === 2) && this.basicView) {
      const viewform = this.basicView.wrappedInstance.props.form;
      const result = await validateForm(viewform);
      if (!result[0]) {
        message.error('基础数据不完整');
        validateResult = 2;
      }
    }

    // 组织验证
    if (!(validateResult === 2) && this.orgCertificationView) {
      const viewform = this.orgCertificationView.wrappedInstance.props.form;
      const result = await validateForm(viewform);
      if (!result[0]) {
        message.error('组织数据不完整');
        validateResult = 2;
      }
    }

    this.setState({
      customerValidate: validateResult,
    });

    return validateResult;
  };

  // 验证供应商数据
  validateVendor = async () => {
    // 默认验证结果为：通过
    let validateResult = 1;

    // 基础数据验证
    if (!(validateResult === 2) && this.basicView) {
      const viewform = this.basicView.wrappedInstance.props.form;
      const result = await validateForm(viewform);
      if (!result[0]) {
        message.error('基础数据不完整');
        validateResult = 2;
      }
    }

    // 付款银行
    if (!(validateResult === 2) && this.bankView) {
      const viewform = this.bankView.wrappedInstance.props.form;
      const result = await validateForm(viewform);
      if (!result[0]) {
        message.error('付款银行数据不完整');
        validateResult = 2;
      }
    }

    // 组织验证
    if (!(validateResult === 2) && this.orgCertificationView) {
      const viewform = this.orgCertificationView.wrappedInstance.props.form;
      const result = await validateForm(viewform);
      if (!result[0]) {
        message.error('组织数据不完整');
        validateResult = 2;
      }
    }

    this.setState({
      vendorValidate: validateResult,
    });

    return validateResult;
  };

  // 提交
  validate = async () => {
    const { customerRequired, customerValidate, vendorRequired, vendorValidate } = this.state;

    // 客户必须
    if (customerRequired === 0 || customerRequired === 1) {
      // 客户数据没有验证过
      if (customerValidate === 0) {
        const result = await this.validateCustomer();
        if (result === 2) {
          message.warning('客户数据未验证通过');
          return;
        }
      }
      // 客户数据没有验证通过
      if (customerValidate === 2) {
        message.warning('客户数据未验证通过');
        return;
      }
    }

    // 供应商必须
    if (vendorRequired === 0 || vendorRequired === 1) {
      // 客户数据没有验证过
      if (vendorValidate === 0) {
        const result = await this.validateVendor();
        if (result === 2) {
          message.warning('客户数据未验证通过');
          return;
        }
      }
      // 客户数据没有验证通过
      if (vendorValidate === 2) {
        message.warning('客户数据未验证通过');
        return;
      }
    }

    const { editType } = this.state;
    if (editType === 'add') {
      this.add();
    } else {
      this.update();
    }
  };

  // 新增
  add = () => {
    const { tabActiveKey, customerRequired, vendorRequired } = this.state;
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

    let newData = {};
    if (customerRequired === 1 || (customerRequired === 0 && tabActiveKey === 'customer')) {
      newData = {
        ...newData,
        ...{ basic: data.basic, customer: data.customer },
      };
    }
    if (vendorRequired || (vendorRequired === 0 && tabActiveKey === 'vendor')) {
      newData = {
        ...newData,
        ...{ basic: data.basic, vendor: data.vendor },
      };
    }

    // 个人 PI认证
    if (data.basic.type === 1) {
      const piCertificationList = data.piCertificationList.map(item => {
        const { uuid, ...other } = item;
        return { ...other, ...{ attachmentList: uuid } };
      });
      newData = {
        ...newData,
        ...{ piCertificationList },
      };
    }

    // 组织 组织认证
    if (data.basic.type === 2) {
      const { uuid, ...other } = data.organizationCertification;
      const organizationCertification = { ...other, ...{ attachmentList: uuid } };
      newData = {
        ...newData,
        ...{ organizationCertification },
      };
    }

    console.log(newData);
    // return;
    bp.addBP(newData).then(res => {
      console.log(res);
      message.success('新增业务伙伴成功');
      router.push('/partner/maintain');
    });
  };

  // 修改
  update = () => {
    const { oldDetails } = this.props;
    // const { tabActiveKey, customerRequired, vendorRequired } = this.state;
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

    // return;
    bp.updateBP(data).then(res => {
      console.log(res);
      message.success('修改业务伙伴成功');
      router.push('/partner/maintain');
    });
  };

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
          wrappedComponentRef={ref => (this.basicView = ref)}
        />
        <SalesArea />
        {type === 2 ? (
          <>
            {editType === 'update' ? <OrgCredit /> : null}
            <OrgCertification
              // eslint-disable-next-line no-return-assign
              wrappedComponentRef={ref => (this.orgCertificationView = ref)}
            />
          </>
        ) : null}
        {type === 1 ? (
          <>
            {editType === 'update' ? <PersonCredit /> : null}
            <PICertification />
          </>
        ) : null}
        <Address />
      </>
    );
  };

  // 供应商
  renderVendor = details => {
    const { editType, tabActiveKey } = this.state;
    const { basic } = details;
    const type = (basic && basic.type) || 1;
    return (
      <>
        <Basic
          tabActiveKey={tabActiveKey}
          // eslint-disable-next-line no-return-assign
          wrappedComponentRef={ref => (this.basicView = ref)}
        />
        <PurchasingOrg />
        <Bank
          // eslint-disable-next-line no-return-assign
          wrappedComponentRef={ref => (this.bankView = ref)}
        />
        {type === 2 ? (
          <>
            {editType === 'update' ? <OrgCredit /> : null}
            <OrgCertification
              // eslint-disable-next-line no-return-assign
              wrappedComponentRef={ref => (this.orgCertificationView = ref)}
            />
          </>
        ) : null}
      </>
    );
  };

  // 主体内容
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
  };

  getColor = type => {
    const colors = {
      default: '#d9d9d9',
      error: 'red',
    };
    return colors[type];
  };

  renderCustomerTab = () => {
    const { customerRequired } = this.state;
    let color = 'default';
    if (customerRequired === 1) color = 'error';

    return (
      <>
        <Badge color={this.getColor(color)} />
        客户
      </>
    );
  };

  renderVendorTab = () => {
    const { vendorRequired } = this.state;
    let color = 'default';
    if (vendorRequired === 1) color = 'error';

    return (
      <>
        <Badge color={this.getColor(color)} />
        供应商
      </>
    );
  };

  render() {
    console.log('state:');
    console.log(this.state);
    const { width, tabActiveKey } = this.state;
    const { pageLoading } = this.props;
    const customerTab = this.renderCustomerTab();
    const vendorTab = this.renderVendorTab();

    return (
      <PageHeaderWrapper
        title="新增业务伙伴"
        tabActiveKey={tabActiveKey}
        onTabChange={this.onTabChange}
        style={{ paddingBottom: 0 }}
        tabList={[
          {
            key: 'customer',
            tab: customerTab,
          },
          {
            key: 'vendor',
            tab: vendorTab,
          },
        ]}
      >
        <Spin spinning={pageLoading}>
          <div style={{ paddingBottom: 50 }}>{this.renderContent()}</div>
          <FooterToolbar style={{ width }}>
            <Button>取消</Button>
            <Button type="primary" onClick={this.validate}>
              提交
            </Button>
          </FooterToolbar>
        </Spin>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(CustomerEdit);

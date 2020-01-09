/**
 * 业务伙伴编辑
 */
import { Form, Button, Spin, Badge, message, Empty, Icon } from 'antd';
import React, { Component } from 'react';

import qs from 'querystring';
import router from 'umi/router';
import Link from 'umi/link';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import FooterToolbar from '@/components/FooterToolbar';

import Basic from './components/Basic';
import SalesArea from './components/SalesArea';
import OrgCredit from './components/OrgCredit';
import OrgCertification from './components/OrgCertification';
import OrgCertificationRead from './components/OrgCertificationRead';
import PICredit from './components/PICredit';
import PICertification from './components/PICertification';
import Address from './components/Address';
import PurchasingOrg from './components/PurchasingOrg';
import Bank from './components/Bank';

import api from '@/api';
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
      // 客户数据验证结果 { result: 'number', message: ['string'] }
      // result: [0：没有数据，1：通过，2：没通过]
      // message: 验证消息
      customerValidate: null,
      // 供应商数据验证结果 { result: 'number', message: ['string'] }
      // result: [0：没有数据，1：通过，2：没通过]
      // message: 验证消息
      vendorValidate: null,
      submitButtonLoading: false,
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
    const { query } = location;
    const { customerDataStatus, vendorDataStatus } = query;

    // 根据数据完整性，确定打开哪个Tab
    let tabActiveKey = 'customer';
    if (customerDataStatus === '2' && vendorDataStatus === '1') tabActiveKey = 'vendor';

    this.setState({
      tabActiveKey,
    });

    dispatch({
      type: 'bpEdit/readBPDetails',
      payload: { id, ...query },
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
      { type: 'salesAreaRegion' }, // 销售范围和大区关系
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

    const bpCacheList = [{ type: 'industryCategoryAll' }];
    bpCacheList.forEach(item => {
      this.props.dispatch({
        type: 'bpCache/getCache',
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
    const { pageLoading } = this.props;
    if (pageLoading) return;

    if (tabActiveKey === 'customer') {
      const result = await this.validateVendor();
      this.setState({
        vendorValidate: result,
      });
    }

    if (tabActiveKey === 'vendor') {
      const result = await this.validateCustomer();
      this.setState({
        customerValidate: result,
      });
    }

    this.setState({
      tabActiveKey,
    });
  };

  // 验证客户数据
  validateCustomer = async () => {
    const { details } = this.props;
    const { customer } = details;
    const { salesAreaList = [], addressList = [] } = customer;

    const resultList = [];
    const messageList = [];

    // 销售范围
    if (salesAreaList.length === 0) {
      resultList.push(0);
      messageList.push('缺少销售范围');
    } else if (this.salesAreaView) {
      const viewform = this.salesAreaView.wrappedInstance.childrenForm;
      if (viewform) {
        const result = await validateForm(viewform);
        if (!result[0]) {
          messageList.push('销售范围验证未通过');
          resultList.push(2);
        } else {
          resultList.push(1);
        }
      }
    }

    // 收货地址
    if (addressList.length === 0) {
      messageList.push('缺少收货地址');
      resultList.push(0);
    } else if (this.addressView) {
      const addressView = this.addressView.wrappedInstance;
      const { editIndex } = addressView.state;
      // 存在正在编辑的行
      if (editIndex !== -1) {
        const result = await validateForm(addressView.props.form);
        if (!result[0]) {
          messageList.push('正在编辑的收货地址验证不通过');
          resultList.push(2);
        } else {
          addressView.save(editIndex);
          resultList.push(1);
        }
      }
    }

    let result;
    // 存在一个未验证通过的，则未验证通过
    if (resultList.indexOf(2) > -1) {
      result = 2;
    }
    // 所有都验证通过，则验证通过
    if (resultList.every(e => e === 1)) {
      result = 1;
    }
    // 所有数据都没有填写，则客户不验证不提交
    if (resultList.every(e => e === 0)) {
      result = 0;
    }

    const data = {
      result,
      message: messageList,
    };

    this.setState({
      customerValidate: data,
    });

    return data;
  };

  // 验证供应商数据
  validateVendor = async () => {
    const { details } = this.props;
    const { vendor } = details;
    const { purchaseOrganizationList, paymentBank } = vendor;

    const resultList = [];
    const messageList = [];

    // 采购组织
    if (purchaseOrganizationList.length === 0) {
      messageList.push('缺少采购组织');
      resultList.push(0);
    } else if (this.purchasingOrgView) {
      const viewform = this.purchasingOrgView.wrappedInstance.childrenForm;
      if (viewform) {
        const result = await validateForm(viewform);
        if (!result[0]) {
          messageList.push('采购组织验证未通过');
          resultList.push(2);
        } else {
          resultList.push(1);
        }
      }
    }

    // 付款银行
    const keys = Object.keys(paymentBank);
    if (keys.length === 0) {
      messageList.push('缺少付款银行');
      resultList.push(0);
    } else if (this.bankView) {
      const hasValue = keys.some(e => paymentBank[e]);
      if (hasValue) {
        const viewform = this.bankView.wrappedInstance.props.form;
        const result = await validateForm(viewform);
        if (!result[0]) {
          messageList.push('付款银行验证未通过');
          resultList.push(2);
        } else {
          resultList.push(1);
        }
      }
    }

    let result;
    // 存在一个未验证通过的，则未验证通过
    if (resultList.indexOf(2) > -1) {
      result = 2;
    }
    // 所有都验证通过，则验证通过
    if (resultList.every(e => e === 1)) {
      result = 1;
    }
    // 所有数据都没有填写，则客户不验证不提交
    if (resultList.every(e => e === 0)) {
      result = 0;
    }

    const data = {
      result,
      message: messageList,
    };

    this.setState({
      vendorValidate: data,
    });

    return data;
  };

  // 提交
  validate = async () => {
    this.setState({
      submitButtonLoading: true,
    });

    try {
      const { tabActiveKey, customerValidate, vendorValidate, editType } = this.state;
      const { details } = this.props;
      // 基础数据验证
      if (this.basicView) {
        const viewform = this.basicView.wrappedInstance.props.form;
        const result = await validateForm(viewform);
        if (!result[0]) {
          message.error('基础数据验证不通过');
          throw new Error('基础数据验证不通过');
        }
      }

      // 新增组织BP时，必须验证组织认证
      if (editType === 'add' && details.basic.type === 2) {
        // 组织验证
        if (this.orgCertificationView) {
          const viewform = this.orgCertificationView.wrappedInstance.props.form;
          const result = await validateForm(viewform);
          if (!result[0]) {
            message.error('组织认证验证不通过');
            throw new Error('组织认证验证不通过');
          }
        }
      }

      // 验证逻辑
      // 1)先验证当前页数据（因为当前页可能修改过，因此不能使用历史验证结果）
      // 2)再检查另一页的历史验证结果

      // 当前处于客户Tab
      if (tabActiveKey === 'customer') {
        const result = await this.validateCustomer();
        if (result.result !== 1) {
          message.warning(result.message.join('，'));
          throw new Error(result.message.join('，'));
        }
        if (vendorValidate && vendorValidate.result === 2) {
          message.warning(vendorValidate.message.join('，'));
          throw new Error(vendorValidate.message.join('，'));
        }
      }

      // 当前处于供应商Tab
      if (tabActiveKey === 'vendor') {
        const result = await this.validateVendor();
        if (result.result !== 1) {
          message.warning(result.message.join('，'));
          throw new Error(result.message.join('，'));
        }
        if (customerValidate && customerValidate.result === 2) {
          message.warning(customerValidate.message.join('，'));
          throw new Error(customerValidate.message.join('，'));
        }
      }

      // 修改BP时，如果某个tab(客户、供应商)的数据没有修改并且没有验证过，并且有数据，则默认验证通过
      if (editType === 'update') {
        if (tabActiveKey === 'customer') {
          if (!vendorValidate) {
            const result = details.vendor.purchaseOrganizationList.length === 0 ? 0 : 1;
            this.setState({
              vendorValidate: {
                result,
                message: [],
              },
            });
          }
        }
        if (tabActiveKey === 'vendor') {
          if (!customerValidate) {
            const result = details.customer.salesAreaList.length === 0 ? 0 : 1;
            this.setState({
              customerValidate: {
                result,
                message: [],
              },
            });
          }
        }
      }

      if (editType === 'add') {
        this.add();
      } else {
        this.update();
      }
    } catch (error) {
      this.setState({
        submitButtonLoading: false,
      });
    }
  };

  // 新增
  add = () => {
    const { customerValidate, vendorValidate } = this.state;
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
      e.salerCodeList = salerList.map(e1 => e1.code);
    });

    let newData = {};
    // 客户数据验证通过
    if (customerValidate && customerValidate.result === 1) {
      newData = {
        ...newData,
        ...{ basic: data.basic, customer: data.customer },
      };
    }
    // 供应商数据验证通过
    if (vendorValidate && vendorValidate.result === 1) {
      newData = {
        ...newData,
        ...{ basic: data.basic, vendor: data.vendor },
      };
    }

    // 个人 PI认证
    if (data.basic.type === 1) {
      const piCertificationList = data.piCertificationList.map(item => {
        const { uuid, attachmentList, ...other } = item;
        return { ...other, ...{ attachmentCode: uuid } };
      });
      newData = {
        ...newData,
        ...{ piCertificationList },
      };
    }

    // 组织 组织认证
    if (data.basic.type === 2) {
      const { uuid, attachmentList, ...other } = data.organizationCertification;
      const organizationCertification = { ...other, ...{ attachmentCode: uuid } };
      newData = {
        ...newData,
        ...{ organizationCertification },
      };
    }

    api.bp
      .addBP(newData)
      .then(() => {
        message.success('新增业务伙伴成功');
        router.push('/bp/maintain');
      })
      .catch(() => {
        this.setState({
          submitButtonLoading: false,
        });
      });
  };

  // 修改
  update = () => {
    const { oldDetails } = this.props;
    const { customerValidate, vendorValidate } = this.state;
    const details = JSON.parse(JSON.stringify(this.props.details));
    const { basic, customer, vendor } = details;
    const { salesAreaList, addressList, ...customerOther } = customer;

    // 遍历销售范围 格式化数据
    const oldSalesAreaList = oldDetails.customer.salesAreaList || [];
    const newSalesAreaList = salesAreaList.map(item => {
      const {
        billToPartyList,
        soldToPartyList,
        shipToPartyList,
        salerList,
        theNew,
        ...other
      } = item;
      const key = `${item.salesOrganizationCode}-${item.distributionChannelCode}`;

      let oldBillToPartyList = [];
      let oldSoldToPartyList = [];
      let oldShipToPartyList = [];
      let oldSalerList = [];
      // rowkey 存在说明是新增销售范围
      if (!theNew) {
        const oldItem = oldSalesAreaList.filter(oldE => {
          const oldKey = `${oldE.salesOrganizationCode}-${oldE.distributionChannelCode}`;
          return oldKey === key;
        })[0];
        oldBillToPartyList = oldItem.billToPartyList;
        oldSoldToPartyList = oldItem.soldToPartyList;
        oldShipToPartyList = oldItem.shipToPartyList;
        oldSalerList = oldItem.salerList;
      }

      // 收票方
      const billToPartyDiff = diff(oldBillToPartyList, billToPartyList);
      const newBillToPartyList = billToPartyDiff.add.map(e => ({
        id: e.id,
        soldToPartyId: e.soldToPartyId,
      }));
      const deleteBillToPartyList = billToPartyDiff.del.map(e => ({
        id: e.id,
        soldToPartyId: e.soldToPartyId,
      }));

      // 售达方
      const soldToPartyDiff = diff(oldSoldToPartyList, soldToPartyList);
      const newSoldToPartyIdList = soldToPartyDiff.add.map(e => e.id);
      const deleteSoldToPartyIdList = soldToPartyDiff.del.map(e => e.id);

      // 送达方
      const shipToPartyDiff = diff(oldShipToPartyList, shipToPartyList);
      const newShipToPartyIdList = shipToPartyDiff.add.map(e => e.id);
      const deleteShipToPartyIdList = shipToPartyDiff.del.map(e => e.id);

      // 销售员
      const salerListDiff = diff(oldSalerList, salerList);
      const newSalerCodeList = salerListDiff.add.map(e => e.code);
      const deleteSalerCodeList = salerListDiff.del.map(e => e.code);

      return {
        ...other,
        newBillToPartyList,
        deleteBillToPartyList,
        newSoldToPartyIdList,
        deleteSoldToPartyIdList,
        newShipToPartyIdList,
        deleteShipToPartyIdList,
        newSalerCodeList,
        deleteSalerCodeList,
      };
    });

    const preAddressList = oldDetails.customer.addressList;
    const nextAddressList = customer.addressList;
    const addressDiff = diff(preAddressList, nextAddressList);
    // 新增地址
    const newAddressList = addressDiff.add;
    // 修改地址
    const modifyAddressList = addressDiff.update;
    // 删除地址
    const deleteAddressIdList = addressDiff.del.map(e => e.id);

    // 新客户数据
    const newCustomer = {
      ...customerOther,
      salesAreaList: newSalesAreaList,
      newAddressList,
      modifyAddressList,
      deleteAddressIdList,
    };

    // 新供应商数据
    const newVendor = {
      ...vendor,
    };

    let newDetails = { basic };

    // 客户数据验证通过
    if (customerValidate.result === 1) {
      newDetails = { ...newDetails, customer: newCustomer };
    }
    // 供应商数据验证通过
    if (vendorValidate.result === 1) {
      newDetails = { ...newDetails, vendor: newVendor };
    }

    api.bp
      .updateBP(newDetails)
      .then(() => {
        message.success('修改业务伙伴成功');
        router.push('/bp/maintain');
      })
      .catch(() => {
        this.setState({
          submitButtonLoading: false,
        });
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
        <SalesArea
          // eslint-disable-next-line no-return-assign
          ref={ref => (this.salesAreaView = ref)}
        />
        {type === 2 ? (
          <>
            {editType === 'update' ? <OrgCredit /> : null}
            {editType === 'update' ? (
              <OrgCertificationRead></OrgCertificationRead>
            ) : (
              <OrgCertification
                // eslint-disable-next-line no-return-assign
                wrappedComponentRef={ref => (this.orgCertificationView = ref)}
              />
            )}
          </>
        ) : null}
        {type === 1 ? (
          <>
            {editType === 'update' ? <PICredit /> : null}
            <PICertification />
          </>
        ) : null}
        <Address
          // eslint-disable-next-line no-return-assign
          wrappedComponentRef={ref => (this.addressView = ref)}
        />
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
        <PurchasingOrg
          // eslint-disable-next-line no-return-assign
          ref={ref => (this.purchasingOrgView = ref)}
        />
        <Bank
          // eslint-disable-next-line no-return-assign
          wrappedComponentRef={ref => (this.bankView = ref)}
        />
        {type === 2 ? (
          <>
            {editType === 'update' ? <OrgCredit /> : null}
            {editType === 'update' ? (
              <OrgCertificationRead></OrgCertificationRead>
            ) : (
              <OrgCertification
                // eslint-disable-next-line no-return-assign
                wrappedComponentRef={ref => (this.orgCertificationView = ref)}
              />
            )}
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
    const color = 'default';

    return (
      <>
        <Badge color={this.getColor(color)} />
        <FormattedMessage id="bp.maintain_details.customer" />
      </>
    );
  };

  renderVendorTab = () => {
    const color = 'default';

    return (
      <>
        <Badge color={this.getColor(color)} />
        <FormattedMessage id="bp.maintain_details.vendor" />
      </>
    );
  };

  render() {
    const { width, tabActiveKey, editType } = this.state;
    const { pageLoading, details } = this.props;
    const customerTab = this.renderCustomerTab();
    const vendorTab = this.renderVendorTab();

    let title = formatMessage({ id: 'action.add' });
    if (editType === 'update') {
      title = formatMessage({ id: 'action.change' });
      const { basic } = details;
      if (basic && basic.id && basic.code) {
        const query = {
          ...this.props.location.query,
          tabActiveKey,
        };
        const url = `/bp/maintain/details/${basic.id}?${qs.stringify(query)}`;
        title = (
          <>
            {formatMessage({ id: 'action.change' })} {basic.code}
            <Link to={url}>
              <Icon style={{ marginLeft: 15, color: '#666' }} type="file-search" />
            </Link>
          </>
        );
      }
    }

    return (
      <PageHeaderWrapper
        title={title}
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
          {editType === 'update' && pageLoading ? (
            <Empty style={{ padding: 300, background: '#fff' }} description="loading..."></Empty>
          ) : (
            <>
              <div style={{ paddingBottom: 50 }}>{this.renderContent()}</div>
              <FooterToolbar style={{ width }}>
                <Button onClick={() => router.push('/bp/maintain')}>
                  <FormattedMessage id="action.cancel" />
                </Button>
                <Button
                  type="primary"
                  onClick={this.validate}
                  loading={this.state.submitButtonLoading}
                >
                  <FormattedMessage id="action.submit" />
                </Button>
              </FooterToolbar>
            </>
          )}
        </Spin>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(CustomerEdit);

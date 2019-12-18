import {
  Card,
  Form,
  Empty,
  Icon,
  // Cascader,
  Descriptions,
} from 'antd';
import { connect } from 'dva';
import React from 'react';
import { formatter } from '@/utils/utils';

const DescriptionsItem = Descriptions.Item;

@connect(({ partnerMaintainEdit, basicCache, global, bp }) => {
      // 付款条件
  const paymentTerms = basicCache.paymentTerms.filter(e => e.languageCode === global.languageCode);
  const currencies = basicCache.currencies.filter(e => e.languageCode === global.languageCode);
  return ({
    paymentTerms,
    purchaseGroups: basicCache.purchaseGroups,
    details: partnerMaintainEdit.supplier,
    purchaseOrganizations: basicCache.purchaseOrganizations,
    currencies,
    VendorLevelCode: bp.VendorLevelCode,
  })
})
class PurchasingOrg extends React.Component {
  constructor(props) {
    super(props);
    const { details: { vendor } } = this.props;
    if (vendor) {
      this.state = {
        tabKey: (
          vendor.purchaseOrganizationList && vendor.purchaseOrganizationList[0] &&
          vendor.purchaseOrganizationList[0].purchaseOrganizationCode) || '',
      };
    } else {
      this.state = {
        tabKey: '',
      }
    }
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'basicCache/getCache',
      payload: { type: 'purchaseOrganizations' },
    })
    this.props.dispatch({
      type: 'basicCache/getCache',
      payload: { type: 'purchaseGroups' },
    })
    this.props.dispatch({
      type: 'basicCache/getCache',
      payload: { type: 'paymentTerms' },
    })
    this.props.dispatch({
      type: 'basicCache/getCache',
      payload: { type: 'currencies' },
    })
  }

  renderTabPane = () => {
    const { tabKey } = this.state;
    const {
      details: { vendor: { purchaseOrganizationList } },
      paymentTerms,
      purchaseGroups,
      currencies,
      VendorLevelCode,
    } = this.props;
    let data = null;
    purchaseOrganizationList.map(item => {
      if (item.purchaseOrganizationCode === tabKey) {
        data = (
          <Descriptions
              className="s-descriptions"
              layout="vertical"
              column={8}
            >
              <DescriptionsItem span={2} label="订单货币">
                {formatter(currencies, item.currencyCode, 'code', 'shortText')}
              </DescriptionsItem>
              <DescriptionsItem span={2} label="付款条件">
                {
                paymentTerms.filter(e => item.paymentTermsCode === e.code) ?
                paymentTerms.filter(e => item.paymentTermsCode === e.code)[0].name : ''
                }
              </DescriptionsItem>
              <DescriptionsItem span={2} label="销售人员">{item.salerName}</DescriptionsItem>
              <DescriptionsItem span={2} label="销售人员电话">{item.salerTelephone}</DescriptionsItem>
              <DescriptionsItem span={2} label="供应商级别">
                {formatter(VendorLevelCode, item.levelCode)}
              </DescriptionsItem>
              <DescriptionsItem span={2} label="收货时发票过账">
                {parseInt(item.invoicePostInReceive, 10) === 1 ? '是' : '否'}
              </DescriptionsItem>
              <DescriptionsItem span={2} label="采购组">
              {
                  purchaseGroups.filter(e => item.purchaseGroupCode === e.code).length !== 0 ?
                  purchaseGroups.filter(e => item.purchaseGroupCode === e.code)[0].name : ''
                }
              </DescriptionsItem>
              <DescriptionsItem span={2} label="计划交货时间">{item.deliveryPlanDays}天</DescriptionsItem>
            </Descriptions>
        )
      }
      return null;
    })
    return data;
  }

  onTabChange = tabKey => {
    if (tabKey === 'select') return;
    this.setState({
      tabKey,
    });
  }

  // 级联选泽采购组织时
  onCascaderChange = obj => {
    const { details } = this.props;
    const { vendor: { purchasingOrganizationList: tabsData } } = details;
    let { vendor } = details;
    const index = obj.length - 1;

    const data = [].concat(tabsData, {
      purchasingOrganizationCode: obj[index],
    });

    vendor = { ...vendor, ...{ purchasingOrganizationList: data } }
    this.props.dispatch({
      type: 'partnerMaintainEdit/setSupplier',
      payload: { ...details, vendor },
    });

    this.setState({
      tabKey: obj[index],
    });
  }

  render() {
    const { details, purchaseOrganizations } = this.props;
    const { tabKey } = this.state;
     if (purchaseOrganizations.length === 0) return null
    let tabList = ''
    if (tabKey) {
      const { vendor: { purchaseOrganizationList } } = details;
      tabList = purchaseOrganizationList.map(e => ({
        key: e.purchaseOrganizationCode,
        tab: purchaseOrganizations.filter(e1 => e1.code === e.purchaseOrganizationCode)[0].name,
      }));
      // tabList = tabList.concat({
      //   key: 'select',
      //   tab: this.renderCascader(),
      // });
      tabList.forEach(e => {
        if (e.key === tabKey) {
          e.tab = (
            <>{e.tab}
            {/* <Icon type="close" style={{ fontSize: 12 }}
            onClick={() => this.closeTab(e.key)} /> */}
            </>
          );
        } else {
          e.tab = (
            <>{e.tab} <Icon type="close" style={{ fontSize: 12, visibility: 'hidden' }} /></>
          );
        }
      });
    }
    return (
      <Card
        title="采购组织"
        bordered={false}
        style={{ marginBottom: '24px' }}
        tabList={tabKey ? tabList : ''}
        activeTabKey={tabKey}
        onTabChange={key => {
          this.onTabChange(key);
        }}
      >
        {tabKey ? this.renderTabPane() : <Empty />}
      </Card>
    );
  }
}

export default Form.create()(PurchasingOrg);

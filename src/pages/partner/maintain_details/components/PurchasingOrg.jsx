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

const DescriptionsItem = Descriptions.Item;

@connect(({ partnerMaintainEdit, basicCache, global }) => {
      // 付款条件
  const paymentTerms = basicCache.paymentTerms.filter(e => e.languageCode === global.languageCode);
  return ({
    paymentTerms,
    purchaseGroups: basicCache.purchaseGroups,
    details: partnerMaintainEdit.supplier,
    purchaseOrganizations: basicCache.purchaseOrganizations,
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
  }

  renderTabPane = () => {
    const { tabKey } = this.state;
    const {
      details: { vendor: { purchaseOrganizationList } },
      paymentTerms,
      purchaseGroups,
    } = this.props;
    let data = null;
    console.log(paymentTerms, purchaseGroups)
    purchaseOrganizationList.map(item => {
      if (item.purchaseOrganizationCode === tabKey) {
        data = (
          <Descriptions
              className="s-descriptions"
              layout="vertical"
              column={8}
            >
              <DescriptionsItem span={2} label="订单货币">{item.currencyCode}</DescriptionsItem>
              <DescriptionsItem span={2} label="付款条件">
                {
                paymentTerms.filter(e => item.paymentTermsCode === e.code) ?
                paymentTerms.filter(e => item.paymentTermsCode === e.code)[0].name : ''
                }
              </DescriptionsItem>
              <DescriptionsItem span={2} label="销售人员">{item.salerName}</DescriptionsItem>
              <DescriptionsItem span={2} label="销售人员电话">{item.salerTelephone}</DescriptionsItem>
              <DescriptionsItem span={2} label="供应商级别">{item.levelCode}</DescriptionsItem>
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

  // renderCascader = () => {
  // const {
  //     details: { vendor: { purchaseOrganizationList } },
  //     purchaseOrganizations
  //   } = this.props;
  //   const codeList = purchaseOrganizationList.map(e => e.purchaseOrganizationCode);
  //   // const cascaderTitle = purchaseOrganizationList.map(e => e.purchaseOrganizationCode);
  //   // console.log(purchaseOrganizations, cascaderTitle)
  //   const options = purchaseOrganizations.map(e => {
  //     let disabled = false;
  //     if (codeList.indexOf(e.code) > -1) {
  //       disabled = true;
  //     }
  //     return { ...e, disabled };
  //   });

    // return (
    //   <Cascader
    //   options={options}
    //   onChange={this.onCascaderChange}
    //   fieldNames={{ label: 'name', value: 'code' }}
    //   >
    //     <a style={{ fontSize: 14, marginLeft: -16 }} href="#">
    //       采购组织 <Icon type="down" style={{ fontSize: 12 }} /></a>
    //   </Cascader>
    // );
  // }

  // closeTab = tabKey => {
  //   let index = -1;
  //   let key = '';
  //   const { details } = this.props;
  //   const { vendor: { purchaseOrganizationList } } = details;
  //   let { vendor } = details;
  //   // 过滤掉关闭的采购组织
  //   const newTabsData = purchaseOrganizationList.filter((e, i) => {
  //     if (e.purchasingOrganizationCode !== tabKey) return true;
  //     index = i;
  //     return false;
  //   });

  //   // 根据index决定选中哪个Tab
  //   if (newTabsData.length > 0) {
  //     // 关闭第一个
  //     if (index === 0) {
  //       key = newTabsData[0].purchasingOrganizationCode;
  //     }
  //     // 关闭最后一个
  //     if (index === purchaseOrganizationList.length - 1) {
  //       key = newTabsData[index - 1].purchasingOrganizationCode;
  //     }
  //     // 关闭中间的Tab
  //     if (index > 0 && index < purchaseOrganizationList.length - 1) {
  //       key = newTabsData[index].purchasingOrganizationCode;
  //     }
  //   } else {
  //     key = '';
  //   }

  //   vendor = { ...vendor, ...{ purchasingOrganizationList: newTabsData } }
  //   this.props.dispatch({
  //     type: 'partnerMaintainEdit/setSupplier',
  //     payload: { ...details, vendor },
  //   });
  //   this.setState({
  //     tabKey: key,
  //   });
  // }

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

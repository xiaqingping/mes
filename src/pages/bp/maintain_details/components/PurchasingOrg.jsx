import { Card, Form, Empty, Icon, Cascader, Descriptions } from 'antd';
import { connect } from 'dva';
import React from 'react';

const DescriptionsItem = Descriptions.Item;

@connect(({ partnerMaintainEdit }) => ({
  details: partnerMaintainEdit.supplier,
}))
class PurchasingOrg extends React.Component {
  constructor(props) {
    super(props);
    const {
      details: { vendor },
    } = this.props;
    if (vendor) {
      const { purchasingOrganizationList: tabsData } = vendor;
      this.state = {
        tabKey: tabsData && tabsData[0] && tabsData[0].purchasingOrganizationCode,
      };
    } else {
      this.state = {
        tabKey: '',
      };
    }
  }

  renderTabPane = () => {
    const { tabKey } = this.state;
    const {
      details: {
        vendor: { purchasingOrganizationList },
      },
    } = this.props;
    let data = null;
    purchasingOrganizationList.map(item => {
      if (item.purchasingOrganizationCode === tabKey) {
        data = (
          <Descriptions className="s-descriptions" layout="vertical" column={8}>
            <DescriptionsItem span={2} label="订单货币">
              {item.currencyCode}
            </DescriptionsItem>
            <DescriptionsItem span={2} label="付款条件">
              {item.paymentTermsCode}
            </DescriptionsItem>
            <DescriptionsItem span={2} label="销售人员">
              {item.salerName}
            </DescriptionsItem>
            <DescriptionsItem span={2} label="销售人员电话">
              {item.salerTelephone}
            </DescriptionsItem>
            <DescriptionsItem span={2} label="供应商级别">
              {item.levelCode}
            </DescriptionsItem>
            <DescriptionsItem span={2} label="收货时发票过账">
              {item.invoicePostInReceive}
            </DescriptionsItem>
            <DescriptionsItem span={2} label="采购组">
              {item.purchasingGroupCode}
            </DescriptionsItem>
            <DescriptionsItem span={2} label="计划交货时间">
              {item.deliveryPlanDays}
            </DescriptionsItem>
          </Descriptions>
        );
      }
      return null;
    });
    return data;
  };

  onTabChange = tabKey => {
    if (tabKey === 'select') return;
    this.setState({
      tabKey,
    });
  };

  // 级联选泽采购组织时
  onCascaderChange = obj => {
    const { details } = this.props;
    const {
      vendor: { purchasingOrganizationList: tabsData },
    } = details;
    let { vendor } = details;
    const index = obj.length - 1;

    const data = [].concat(tabsData, {
      purchasingOrganizationCode: obj[index],
    });

    vendor = { ...vendor, ...{ purchasingOrganizationList: data } };
    this.props.dispatch({
      type: 'partnerMaintainEdit/setSupplier',
      payload: { ...details, vendor },
    });

    this.setState({
      tabKey: obj[index],
    });
  };

  renderCascader = () => {
    const { details } = this.props;
    const {
      vendor: { purchasingOrganizationList: tabsData },
    } = details;
    const cascaderTitle = tabsData.map(e => e.purchasingOrganizationCode);
    const options = [
      {
        value: '生工',
        label: '生工',
      },
      {
        value: 'BBI',
        label: 'BBI',
      },
      {
        value: 'NBS',
        label: 'NBS',
      },
    ];
    options.forEach(e => {
      if (cascaderTitle.indexOf(e.value) > -1) {
        e.disabled = true;
      } else {
        e.disabled = false;
      }
    });
    return (
      <Cascader options={options} onChange={this.onCascaderChange}>
        <a style={{ fontSize: 14, marginLeft: -16 }} href="#">
          采购组织 <Icon type="down" style={{ fontSize: 12 }} />
        </a>
      </Cascader>
    );
  };

  closeTab = tabKey => {
    let index = -1;
    let key = '';
    const { details } = this.props;
    const {
      vendor: { purchasingOrganizationList: tabsData },
    } = details;
    let { vendor } = details;
    // 过滤掉关闭的采购组织
    const newTabsData = tabsData.filter((e, i) => {
      if (e.purchasingOrganizationCode !== tabKey) return true;
      index = i;
      return false;
    });

    // 根据index决定选中哪个Tab
    if (newTabsData.length > 0) {
      // 关闭第一个
      if (index === 0) {
        key = newTabsData[0].purchasingOrganizationCode;
      }
      // 关闭最后一个
      if (index === tabsData.length - 1) {
        key = newTabsData[index - 1].purchasingOrganizationCode;
      }
      // 关闭中间的Tab
      if (index > 0 && index < tabsData.length - 1) {
        key = newTabsData[index].purchasingOrganizationCode;
      }
    } else {
      key = '';
    }

    vendor = { ...vendor, ...{ purchasingOrganizationList: newTabsData } };
    this.props.dispatch({
      type: 'partnerMaintainEdit/setSupplier',
      payload: { ...details, vendor },
    });
    this.setState({
      tabKey: key,
    });
  };

  render() {
    const { details } = this.props;
    const { tabKey } = this.state;
    let tabList = '';
    if (tabKey) {
      const {
        vendor: { purchasingOrganizationList: tabsData },
      } = details;
      tabList = tabsData.map(e => ({
        key: e.purchasingOrganizationCode,
        tab: e.purchasingOrganizationCode,
      }));
      tabList = tabList.concat({
        key: 'select',
        tab: this.renderCascader(),
      });
      tabList.forEach(e => {
        if (e.key === tabKey) {
          e.tab = (
            <>
              {e.tab}{' '}
              <Icon type="close" style={{ fontSize: 12 }} onClick={() => this.closeTab(e.key)} />
            </>
          );
        } else {
          e.tab = (
            <>
              {e.tab} <Icon type="close" style={{ fontSize: 12, visibility: 'hidden' }} />
            </>
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

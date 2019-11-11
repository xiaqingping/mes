import {
  Form,
  Row,
  Col,
  Select,
  Switch,
  Radio,
  Tabs,
  Card,
  Cascader,
  Icon,
  Empty,
} from 'antd';
import React from 'react';
import { connect } from 'dva';
import InvoiceParty from './InvoiceParty';
import SoldToParty from './SoldToParty';
import ShipToParty from './ShipToParty';
import SalesPerson from './SalesPerson';

import styles from '../style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TabPane } = Tabs;

@Form.create()
@connect(({ global, basicCache, bpEdit }) => {
  function byLangFilter(e) {
    return e.languageCode === global.languageCode;
  }
  // 基础数据
  // 大区+网点
  const regionOffice = basicCache.regionOffice.filter(byLangFilter);
  // 付款方式
  const salesPaymentMethods = basicCache.salesPaymentMethods.filter(byLangFilter);
  // 币种
  const currencies = basicCache.currencies.filter(byLangFilter);

  // 业务伙伴数据
  const details = bpEdit.details || {};
  const basicInfo = details.basic || {};

  return {
    salesPaymentMethods,
    regionOffice,
    currencies,
    basicInfo,
  };
})
class FormContent extends React.Component {
  render() {
    const {
      form: { getFieldDecorator },
      basicInfo,
      data,
      valueChange,
      salesPaymentMethods,
      regionOffice,
      currencies,
    } = this.props;
    const countryCode = basicInfo.countryCode || 'china';

    return (
      <Form>
        <Row gutter={32}>
          <Col span={5}>
            <FormItem label="网点归属">
              {getFieldDecorator('regionOffice', {
                initialValue: [data.regionCode, data.officeCode],
              })(
                <Cascader
                  fieldNames={ { label: 'name', value: 'code', children: 'officeList' } }
                  onChange={value => valueChange('regionOffice', value)}
                  options={regionOffice}
                />,
              )}
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem label="默认付款方式">
              {getFieldDecorator('defaultPaymentMethodCode', {
                initialValue: data.defaultPaymentMethodCode,
              })(
                <Select onChange={value => valueChange('defaultPaymentMethodCode', value)}>
                  {
                    salesPaymentMethods.map(e =>
                      <Option key={e.code} value={e.code}>{e.name}</Option>,
                    )
                  }
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="币种">
              {getFieldDecorator('currencyCode', {
                initialValue: data.currencyCode,
              })(
                <Select onChange={value => valueChange('currencyCode', value)}>
                  {
                    currencies.map(e =>
                      <Option key={e.code} value={e.code}>{e.shortText}</Option>,
                    )
                  }
                </Select>,
              )}
            </FormItem>
          </Col>
          {
            (countryCode === 'china' || !countryCode) ? (
              <Col span={7}>
                <FormItem label="默认开票类型">
                  {getFieldDecorator('defaultInvoiceTypeCode', {
                    initialValue: data.defaultInvoiceTypeCode,
                  })(
                    <Radio.Group onChange={e => valueChange('defaultInvoiceTypeCode', e.target.value)}>
                      <Radio.Button value="a">增值税专用发票</Radio.Button>
                      <Radio.Button value="b">增值税普通发票</Radio.Button>
                    </Radio.Group>,
                  )}
                </FormItem>
              </Col>
            ) : null
          }
          {
            (countryCode !== 'china' && countryCode) ? (
              <Col span={6}>
                <FormItem label="税分类">
                  {getFieldDecorator('taxClassificCode', {
                    initialValue: data.taxClassificCode,
                  })(
                    <Select onChange={value => valueChange('taxClassificCode', value)}>
                      <Option value="0">免税</Option>
                      <Option value="1">必须上税</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
            ) : null
          }
          <Col span={3}>
            <FormItem label="销售冻结">
              {getFieldDecorator('salesOrderBlock', {
                initialValue: data.salesOrderBlock,
                valuePropName: 'checked',
              })(<Switch disabled />)}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}

@connect(({ global, basicCache, bpEdit }) => {
  function byLangFilter(e) {
    return e.languageCode === global.languageCode;
  }

  // BP数据
  const details = bpEdit.details || {};
  const basicInfo = details.basic || {};
  const customer = details.customer || { };
  const salesAreaList = customer.salesAreaList || [];

  // 基础数据
  // 销售范围
  const { salesArea } = basicCache;
  // 销售组织
  const salesOrganizations = basicCache.salesOrganizations.filter(byLangFilter);
  // 分销渠道
  const distributionChannels = basicCache.distributionChannels.filter(byLangFilter);

  return {
    details,
    basicInfo,
    customer,
    salesAreaList,
    salesArea,
    salesOrganizations,
    distributionChannels,
  };
}, undefined, undefined, { withRef: true })
class SalesArea extends React.Component {
  constructor(props) {
    super(props);
    const { salesAreaList: tabsData } = this.props;

    this.state = {
      tabKey: (tabsData && tabsData[0] && tabsData[0].title) || '',
    }
  }

  valueChange = (key, value) => {
    const { tabKey } = this.state;
    const { details, customer, salesAreaList } = this.props;

    const newSalesAreaList = salesAreaList.map(e => {
      const itemKey = `${e.salesOrganizationCode}-${e.distributionChannelCode}`;
      if (itemKey === tabKey) {
        if (key === 'regionOffice') {
          const [regionCode, officeCode] = value;
          e.regionCode = regionCode;
          e.officeCode = officeCode;
        } else {
          e[key] = value;
        }
      }
      return e;
    });
    const newCustomer = { ...customer, ...{ salesAreaList: newSalesAreaList } };
    const newDetails = { ...details, ...{ customer: newCustomer } };

    this.props.dispatch({
      type: 'bpEdit/setDetails',
      payload: newDetails,
    });
  }

  onTabChange = tabKey => {
    if (tabKey === 'select') return;
    this.setState({ tabKey });
  }

  // 级联选泽销售范围时
  onCascaderChange = arr => {
    const [salesOrganizationCode, distributionChannelCode] = arr;
    const { details, customer, salesAreaList: tabsData } = this.props;

    const tabKey = `${salesOrganizationCode}-${distributionChannelCode}`;
    const newSalesAreaList = [].concat(tabsData, {
      salesOrganizationCode,
      distributionChannelCode,
    });

    const newCustomer = { ...customer, ...{ salesAreaList: newSalesAreaList } };
    const newDetails = { ...details, ...{ customer: newCustomer } };

    this.props.dispatch({
      type: 'bpEdit/setDetails',
      payload: newDetails,
    });

    this.setState({
      tabKey,
    });
  }

  renderCascader = options => {
    const { salesAreaList: tabsData } = this.props;
    const cascaderTitle = tabsData.map(e => `${e.salesOrganizationCode}-${e.distributionChannelCode}`);

    options.forEach(e => {
      let childrenDisabledLength = 0;
      e.children.forEach(e1 => {
        if (cascaderTitle.indexOf(`${e.value}-${e1.value}`) > -1) {
          e1.disabled = true;
          childrenDisabledLength++;
        } else {
          e1.disabled = false;
        }
      });
      if (childrenDisabledLength === e.children.length) e.disabled = true;
    });

    return (
      <Cascader options={options} onChange={this.onCascaderChange}>
        <a style={{ fontSize: 14, marginLeft: -16 }} href="#">销售范围 <Icon type="down" style={{ fontSize: 12 }} /></a>
      </Cascader>
    );
  }

  formatSalesArea = () => {
    const { salesArea, salesOrganizations, distributionChannels } = this.props;
    const arr = [];

    const salesOrganizationsMap = {};
    salesOrganizations.forEach(e => {
      salesOrganizationsMap[e.code] = e.name;
      arr.push({ value: e.code, label: e.name, children: [] });
    });

    const distributionChannelsMap = {};
    distributionChannels.forEach(e => {
      distributionChannelsMap[e.code] = e.name;
    });

    salesArea.forEach(e => {
      arr.forEach(e1 => {
        if (e.salesOrganizationCode === e1.value) {
          const b = e1.children.some(e2 => e2.value === e.distributionChannelCode);
          if (!b) {
            e1.children.push({
              value: e.distributionChannelCode,
              label: distributionChannelsMap[e.distributionChannelCode],
            });
          }
        }
      });
    });

    return {
      salesOrganizationsMap,
      distributionChannelsMap,
      salesArea: arr,
    };
  }

  closeTab = tabKey => {
    let index = -1;
    let key = '';
    const { details, customer, salesAreaList: tabsData } = this.props;

    // 过滤掉关闭的采购组织
    const newTabsData = tabsData.filter((e, i) => {
      if (e.title !== tabKey) return true;
      index = i;
      return false;
    });

    // 根据index决定选中哪个Tab
    if (newTabsData.length > 0) {
      // 关闭第一个
      if (index === 0) {
        key = newTabsData[0].title;
      }
      // 关闭最后一个
      if (index === tabsData.length - 1) {
        key = newTabsData[index - 1].title;
      }
      // 关闭中间的Tab
      if (index > 0 && index < tabsData.length - 1) {
        key = newTabsData[index].title;
      }
    } else {
      key = '';
    }

    const newCustomer = { ...customer, ...{ salesAreaList: newTabsData } };
    const newDetails = { ...details, ...{ customer: newCustomer } };

    this.props.dispatch({
      type: 'bpEdit/setDetails',
      payload: newDetails,
    });
    this.setState({ tabKey: key });
  }

  render() {
    const { salesAreaList: tabsData } = this.props;
    const { tabKey } = this.state;
    const { salesArea, salesOrganizationsMap, distributionChannelsMap } = this.formatSalesArea();

    let tabList = tabsData.map(e => ({
      key: `${e.salesOrganizationCode}-${e.distributionChannelCode}`,
      tab: salesOrganizationsMap[e.salesOrganizationCode] +
        distributionChannelsMap[e.distributionChannelCode],
    }));

    tabList = tabList.concat({
      key: 'select',
      tab: this.renderCascader(salesArea),
    });
    tabList.forEach(e => {
      if (e.key === tabKey) {
        e.tab = (
          <>{e.tab} <Icon type="close" style={{ fontSize: 12 }} onClick={() => this.closeTab(e.key)} /></>
        );
      } else {
        e.tab = (
          <>{e.tab} <Icon type="close" style={{ fontSize: 12, visibility: 'hidden' }} /></>
        );
      }
    });

    return (
      <Card
        title="销售范围"
        bordered={false}
        style={{ marginBottom: '24px' }}
        tabList={tabList}
        activeTabKey={tabKey}
        onTabChange={key => {
          this.onTabChange(key);
        }}
      >
        {tabKey ?
          tabsData.map(e => {
            const key = `${e.salesOrganizationCode}-${e.distributionChannelCode}`;
            if (tabKey !== key) return null;
            return (
              <div key={key}>
                <FormContent
                  valueChange={this.valueChange}
                  tabKey={tabKey}
                  data={e}
                />
                <Tabs className={styles.internalTab}>
                  <TabPane tab="收票方" key="InvoiceParty">
                    <InvoiceParty
                      tableData={e.invoicePartyList || []}
                      tableKey="invoicePartyList"
                      valueChange={this.valueChange}
                    />
                  </TabPane>
                  <TabPane tab="售达方" key="SoldToParty">
                    <SoldToParty
                      tableData={e.soldToPartyList || []}
                      tableKey="soldToPartyList"
                      valueChange={this.valueChange}
                    />
                  </TabPane>
                  <TabPane tab="送达方" key="ShipToParty">
                    <ShipToParty
                      tableData={e.shipToPartyList || []}
                      tableKey="shipToPartyList"
                      valueChange={this.valueChange}
                    />
                  </TabPane>
                  <TabPane tab="销售员" key="SalesPerson">
                    <SalesPerson
                      tableData={e.salerList || []}
                      tableKey="salerList"
                      valueChange={this.valueChange}
                    />
                  </TabPane>
                </Tabs>
              </div>
            );
          }) : <Empty description="暂无销售范围" />}
      </Card>
    );
  }
}

export default SalesArea;

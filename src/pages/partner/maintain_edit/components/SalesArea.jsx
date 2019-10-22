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
class FormContent extends React.Component {
  render() {
    const {
      form: { getFieldDecorator },
      basic = {},
      data,
      valueChange,
    } = this.props;
    const { countryCode = 'china' } = basic;

    return (
      <Form>
        <Row gutter={32}>
          <Col span={5}>
            <FormItem label="网点归属">
              {getFieldDecorator('officeCode', {
                initialValue: [data.regionCode, data.officeCode],
              })(
                <Select onChange={value => valueChange('officeCode', value)}>
                  <Option value="1">上海</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem label="默认付款方式">
              {getFieldDecorator('defaultPaymentMethodCode', {
                initialValue: data.defaultPaymentMethodCode,
              })(
                <Select onChange={value => valueChange('defaultPaymentMethodCode', value)}>
                  <Option value="1">网银</Option>
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
                  <Option value="1">人民币</Option>
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
                      <Option value="1">免税</Option>
                      <Option value="2">上税</Option>
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

@connect(({ partnerMaintainEdit }) => {
  const details = partnerMaintainEdit.details || {};
  const basic = details.basic || {};
  const customer = details.customer || { };
  const salesAreaList = customer.salesAreaList || [];
  return { details, basic, customer, salesAreaList };
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
      if (e.title === tabKey) {
        if (key === 'officeCode') {
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
      type: 'partnerMaintainEdit/setDetails',
      payload: newDetails,
    });
  }

  onTabChange = tabKey => {
    if (tabKey === 'select') return;
    this.setState({ tabKey });
  }

  // 级联选泽销售范围时
  onCascaderChange = obj => {
    const { details, customer, salesAreaList: tabsData } = this.props;
    const index = obj.length - 1;

    const newSalesAreaList = [].concat(tabsData, {
      title: obj[index],
    });

    const newCustomer = { ...customer, ...{ salesAreaList: newSalesAreaList } };
    const newDetails = { ...details, ...{ customer: newCustomer } };

    this.props.dispatch({
      type: 'partnerMaintainEdit/setDetails',
      payload: newDetails,
    });

    this.setState({
      tabKey: obj[index],
    });
  }

  renderCascader = () => {
    const { salesAreaList: tabsData } = this.props;
    const cascaderTitle = tabsData.map(e => e.title);
    const options = [
      {
        value: '生工生物',
        label: '生工生物',
        children: [
          {
            value: '生工国内直销',
            label: '生工国内直销',
          },
          {
            value: '生工国内电商',
            label: '生工国内电商',
          },
          {
            value: '生工国外直销',
            label: '生工国外直销',
          },
          {
            value: '生工国外电商',
            label: '生工国外电商',
          },
        ],
      },
      {
        value: 'BBI',
        label: 'BBI',
        children: [
          {
            value: 'BBI国内直销',
            label: 'BBI国内直销',
          },
          {
            value: 'BBI国内电商',
            label: 'BBI国内电商',
          },
          {
            value: 'BBI国外直销',
            label: 'BBI国外直销',
          },
          {
            value: 'BBI国外电商',
            label: 'BBI国外电商',
          },
        ],
      },
    ];
    options.forEach(e => {
      e.children.forEach(e1 => {
        if (cascaderTitle.indexOf(e1.value) > -1) {
          e1.disabled = true;
        } else {
          e1.disabled = false;
        }
      });
    });
    return (
      <Cascader options={options} onChange={this.onCascaderChange}>
        <a style={{ fontSize: 14, marginLeft: -16 }} href="#">销售范围 <Icon type="down" style={{ fontSize: 12 }} /></a>
      </Cascader>
    );
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
      type: 'partnerMaintainEdit/setDetails',
      payload: newDetails,
    });
    this.setState({ tabKey: key });
  }

  render() {
    const { tabKey } = this.state;
    const { salesAreaList: tabsData } = this.props;

    let tabList = tabsData.map(e => ({ key: e.title, tab: e.title }));
    tabList = tabList.concat({
      key: 'select',
      tab: this.renderCascader(),
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
            if (tabKey !== e.title) return null;
            return (
              <div key={e.title}>
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

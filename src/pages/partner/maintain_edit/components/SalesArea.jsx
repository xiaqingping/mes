/**
 * 客户 销售范围
 */
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
  message,
} from 'antd';
import React from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import debounce from 'lodash/debounce';
import { validateForm } from '@/utils/utils';
import BillToParty from './BillToParty';
import SoldToParty from './SoldToParty';
import ShipToParty from './ShipToParty';
import SalesPerson from './SalesPerson';

import styles from '../style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TabPane } = Tabs;

@Form.create()
@connect(({ global, basicCache, bpEdit, bp }) => {
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

  // 默认开票类型
  const { DefaultInvoiceType } = bp;

  return {
    salesPaymentMethods,
    regionOffice,
    currencies,
    basicInfo,
    DefaultInvoiceType,
  };
})
class FormContent extends React.Component {
  constructor(props) {
    super(props);
    props.getChildrenForm(props.form);
    // 异步验证做节流处理
    this.checkRegionOffice = debounce(this.checkRegionOffice, 800);
  }

  checkRegionOffice = (rule, value, callback) => {
    if (!value[0] || !value[1]) {
      callback('请选择网点归属');
      return;
    }
    callback();
  };

  render() {
    const {
      form: { getFieldDecorator },
      basicInfo,
      data,
      valueChange,
      salesPaymentMethods,
      regionOffice,
      currencies,
      DefaultInvoiceType,
    } = this.props;

    const sapCountryCode = basicInfo.sapCountryCode || 'CN';

    return (
      <Form hideRequiredMark>
        <Row gutter={32}>
          <Col span={5}>
            <FormItem
              label={formatMessage({ id: 'bp.maintain_details.sales_distribution.sales_area' })}
            >
              {getFieldDecorator('regionOffice', {
                initialValue: [data.regionCode, data.officeCode],
                rules: [{ required: true, validator: this.checkRegionOffice }],
              })(
                <Cascader
                  fieldNames={{ label: 'name', value: 'code', children: 'officeList' }}
                  onChange={value => valueChange('regionOffice', value)}
                  options={regionOffice}
                />,
              )}
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem
              label={formatMessage({
                id: 'bp.maintain_details.sales_distribution.default_payment_menthod',
              })}
            >
              {getFieldDecorator('defaultPaymentMethodCode', {
                initialValue: data.defaultPaymentMethodCode,
                rules: [{ required: true }],
              })(
                <Select onChange={value => valueChange('defaultPaymentMethodCode', value)}>
                  {salesPaymentMethods.map(e => (
                    <Option key={e.code} value={e.code}>
                      {e.name}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem
              label={formatMessage({ id: 'bp.maintain_details.sales_distribution.currency' })}
            >
              {getFieldDecorator('currencyCode', {
                initialValue: data.currencyCode,
                rules: [{ required: true }],
              })(
                <Select
                  showSearch
                  filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                  onChange={value => valueChange('currencyCode', value)}
                >
                  {currencies.map(e => (
                    <Option key={e.code} value={e.code}>
                      {e.shortText}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          {sapCountryCode === 'CN' || !sapCountryCode ? (
            <Col span={7}>
              <FormItem
                label={formatMessage({ id: 'bp.maintain_details.sales_distribution.invoice_type' })}
              >
                {getFieldDecorator('defaultInvoiceTypeCode', {
                  initialValue: data.defaultInvoiceTypeCode,
                  rules: [{ required: true }],
                })(
                  <Radio.Group
                    onChange={e => valueChange('defaultInvoiceTypeCode', e.target.value)}
                  >
                    {DefaultInvoiceType.map(e => (
                      <Radio.Button key={e.id} value={e.id}>
                        {e.name}
                      </Radio.Button>
                    ))}
                  </Radio.Group>,
                )}
              </FormItem>
            </Col>
          ) : null}
          {sapCountryCode !== 'CN' && sapCountryCode ? (
            <Col span={6}>
              <FormItem label="税分类">
                {getFieldDecorator('taxClassificCode', {
                  initialValue: data.taxClassificCode,
                  rules: [{ required: true }],
                })(
                  <Select onChange={value => valueChange('taxClassificCode', value)}>
                    <Option value="0">免税</Option>
                    <Option value="1">必须上税</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
          ) : null}
          <Col span={3}>
            <FormItem
              label={formatMessage({ id: 'bp.maintain_details.sales_distribution.sales_block' })}
            >
              {getFieldDecorator('salesOrderBlock', {
                initialValue: data.salesOrderBlock === 1,
                valuePropName: 'checked',
              })(<Switch disabled />)}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}

@connect(
  ({ global, basicCache, bpEdit }) => {
    function byLangFilter(e) {
      return e.languageCode === global.languageCode;
    }

    // BP数据
    const { editType } = bpEdit;
    const details = bpEdit.details || {};
    const basicInfo = details.basic || {};
    const customer = details.customer || {};
    const salesAreaList = customer.salesAreaList || [];

    // 基础数据
    // 销售范围
    const { salesArea } = basicCache;
    // 销售组织
    const salesOrganizations = basicCache.salesOrganizations.filter(byLangFilter);
    // 分销渠道
    const distributionChannels = basicCache.distributionChannels.filter(byLangFilter);

    return {
      editType,
      details,
      basicInfo,
      customer,
      salesAreaList,
      salesArea,
      salesOrganizations,
      distributionChannels,
    };
  },
  null,
  null,
  { withRef: true },
)
class SalesArea extends React.Component {
  constructor(props) {
    super(props);
    const { salesAreaList: tabsData } = this.props;

    let tabKey = '';
    if (tabsData && tabsData[0]) {
      tabKey = `${tabsData[0].salesOrganizationCode}-${tabsData[0].distributionChannelCode}`;
    }

    this.state = {
      // 销售范围TabKey
      tabKey,
      // 销售范围下面表格TabKey
      tableTabKey: 'BillToParty',
    };
  }

  valueChange = (key, value) => {
    const { tabKey } = this.state;
    const { details, customer, salesAreaList } = this.props;

    const newSalesAreaList = salesAreaList.map(e => {
      const itemKey = `${e.salesOrganizationCode}-${e.distributionChannelCode}`;
      // 如果本次修改的是直销[10]或电商[20]，则生成另一个对应的key
      let matchKey;
      const arr = ['10', '20'];
      const codeIndex = arr.indexOf(tabKey.split('-')[1]);
      if (codeIndex !== -1) {
        arr.splice(codeIndex, 1);
        matchKey = `${e.salesOrganizationCode}-${arr[0]}`;
      }

      if (itemKey === tabKey || itemKey === matchKey) {
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
      type: 'bpEdit/setState',
      payload: {
        type: 'details',
        data: newDetails,
      },
    });
  };

  onTabChange = async tabKey => {
    if (tabKey === 'select') return;

    // 检查当前正在编辑的数据是否验证通过
    const viewform = this.childrenForm;
    if (viewform) {
      const result = await validateForm(viewform);
      if (!result[0]) {
        message.error('销售范围数据不完整');
        return;
      }
    }

    this.setState({ tabKey });
  };

  onTabelTabChange = activeKey => {
    // TODO: 这里要验证表格数据
    this.setState({ tableTabKey: activeKey });
  };

  // 级联选泽销售范围时
  onCascaderChange = async arr => {
    const { salesArea } = this.formatSalesArea();
    const [salesOrganizationCode, distributionChannelCode] = arr;
    const { details, customer, salesAreaList: tabsData } = this.props;
    const tabKey = `${salesOrganizationCode}-${distributionChannelCode}`;

    // 检查当前正在编辑的数据是否验证通过
    const viewform = this.childrenForm;
    if (viewform) {
      const result = await validateForm(viewform);
      if (!result[0]) {
        message.error('销售范围数据不完整');
        return;
      }
    }

    // 新增的数据，最多可以一次新增两条，当同一个销售组织下，同时存在直销[10]和电商[20]两个销售渠道时
    // 新增一个时，会把另一个也新增进去
    let addArr = [];
    if (distributionChannelCode === '10' || distributionChannelCode === '20') {
      salesArea.forEach(e1 => {
        if (e1.value === salesOrganizationCode) {
          e1.children.forEach(e2 => {
            if (e2.value === '10' || e2.value === '20') {
              addArr.push({
                // theNew 存在代表是新增数据
                theNew: true,
                salesOrganizationCode: e1.value,
                distributionChannelCode: e2.value,
              });
            }
          });
        }
      });
    }

    if (addArr.length !== 2) {
      addArr = [
        {
          // theNew 存在代表是新增数据
          theNew: true,
          salesOrganizationCode,
          distributionChannelCode,
        },
      ];
    }

    const newSalesAreaList = [].concat(tabsData, ...addArr);
    const newCustomer = { ...customer, ...{ salesAreaList: newSalesAreaList } };
    const newDetails = { ...details, ...{ customer: newCustomer } };

    this.props.dispatch({
      type: 'bpEdit/setState',
      payload: {
        type: 'details',
        data: newDetails,
      },
    });

    this.setState({
      tabKey,
    });
  };

  renderCascader = options => {
    const { salesAreaList: tabsData } = this.props;
    const cascaderTitle = tabsData.map(
      e => `${e.salesOrganizationCode}-${e.distributionChannelCode}`,
    );

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
        <a style={{ fontSize: 14, marginLeft: -16 }}>
          <FormattedMessage id="bp.maintain_details.sales_distribution.sales_org" />
          <Icon type="down" style={{ fontSize: 12 }} />
        </a>
      </Cascader>
    );
  };

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
  };

  closeTab = tabKey => {
    let index = -1;
    let key = '';
    let length = 0;
    const { details, customer, salesAreaList: tabsData } = this.props;

    // 如果本次修改的是直销[10]或电商[20]，则生成另一个对应的key，两个tab应该一起删除
    let matchKey;
    const arr = ['10', '20'];
    const codeIndex = arr.indexOf(tabKey.split('-')[1]);
    if (codeIndex !== -1) {
      arr.splice(codeIndex, 1);
      matchKey = `${tabKey.split('-')[0]}-${arr[0]}`;
    }

    // 过滤掉关闭的采购组织
    const newTabsData = tabsData.filter((e, i) => {
      const thisTabKey = `${e.salesOrganizationCode}-${e.distributionChannelCode}`;
      if (thisTabKey !== tabKey && thisTabKey !== matchKey) return true;
      index = i;
      length++;
      return false;
    });

    // 根据index决定选中哪个Tab
    if (newTabsData.length > 0) {
      // 关闭第一个
      if (index === 0) {
        key = newTabsData[0].title;
      }
      // 关闭最后一个
      if (index === tabsData.length - length) {
        key = newTabsData[index - length].title;
      }
      // 关闭中间的Tab
      if (index > 0 && index < tabsData.length - length) {
        key = newTabsData[index].title;
      }
    } else {
      key = '';
    }

    const newCustomer = { ...customer, ...{ salesAreaList: newTabsData } };
    const newDetails = { ...details, ...{ customer: newCustomer } };

    this.props.dispatch({
      type: 'bpEdit/setState',
      payload: {
        type: 'details',
        data: newDetails,
      },
    });
    this.setState({ tabKey: key });
  };

  getChildrenForm = form => {
    this.childrenForm = form;
  };

  render() {
    const { salesAreaList: tabsData, editType } = this.props;
    let { tabKey } = this.state;
    const { tableTabKey } = this.state;
    const { salesArea, salesOrganizationsMap, distributionChannelsMap } = this.formatSalesArea();

    // 如有有数据，但没有选中，则默认选中第一条
    if (!tabKey && tabsData.length > 0) {
      tabKey = `${tabsData[0].salesOrganizationCode}-${tabsData[0].distributionChannelCode}`;
    }

    let tabList = tabsData.map(e => ({
      key: `${e.salesOrganizationCode}-${e.distributionChannelCode}`,
      tab:
        salesOrganizationsMap[e.salesOrganizationCode] +
        distributionChannelsMap[e.distributionChannelCode],
      theNew: e.theNew,
    }));

    tabList = tabList.concat({
      key: 'select',
      tab: this.renderCascader(salesArea),
    });
    tabList.forEach(e => {
      // 修改时无法删除已有的销售范围
      if (editType === 'update' && !e.theNew) {
        return;
      }

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

    return (
      <Card
        title={formatMessage({ id: 'bp.maintain_details.sales_distribution' })}
        bordered={false}
        style={{ marginBottom: '24px' }}
        tabList={tabList}
        activeTabKey={tabKey}
        onTabChange={key => {
          this.onTabChange(key);
        }}
      >
        {tabKey ? (
          tabsData.map(e => {
            const key = `${e.salesOrganizationCode}-${e.distributionChannelCode}`;
            if (tabKey !== key) return null;
            return (
              <div key={key}>
                <FormContent
                  getChildrenForm={this.getChildrenForm}
                  valueChange={this.valueChange}
                  tabKey={tabKey}
                  data={e}
                />
                <Tabs
                  className={styles.internalTab}
                  onChange={this.onTabelTabChange}
                  activeKey={tableTabKey}
                >
                  <TabPane
                    tab={formatMessage({
                      id: 'bp.maintain_details.sales_distribution.bill_to_party',
                    })}
                    key="BillToParty"
                  >
                    <BillToParty
                      tableData={e.billToPartyList || []}
                      tableKey="billToPartyList"
                      valueChange={this.valueChange}
                    />
                  </TabPane>
                  <TabPane
                    tab={formatMessage({
                      id: 'bp.maintain_details.sales_distribution.sold_to_party',
                    })}
                    key="SoldToParty"
                  >
                    <SoldToParty
                      tableData={e.soldToPartyList || []}
                      tableKey="soldToPartyList"
                      valueChange={this.valueChange}
                    />
                  </TabPane>
                  <TabPane
                    tab={formatMessage({
                      id: 'bp.maintain_details.sales_distribution.ship_to_party',
                    })}
                    key="ShipToParty"
                  >
                    <ShipToParty
                      tableData={e.shipToPartyList || []}
                      tableKey="shipToPartyList"
                      valueChange={this.valueChange}
                    />
                  </TabPane>
                  <TabPane
                    tab={formatMessage({ id: 'bp.maintain_details.sales_distribution.sales_rep' })}
                    key="SalesPerson"
                  >
                    <SalesPerson
                      tableData={e.salerList || []}
                      tableKey="salerList"
                      valueChange={this.valueChange}
                    />
                  </TabPane>
                </Tabs>
              </div>
            );
          })
        ) : (
          <Empty
            description={formatMessage({ id: 'bp.maintain_details.sales_distribution.empty' })}
          />
        )}
      </Card>
    );
  }
}

export default SalesArea;

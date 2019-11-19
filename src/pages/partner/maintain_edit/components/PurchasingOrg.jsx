import {
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Switch,
  Empty,
  Icon,
  Cascader,
} from 'antd';
import { connect } from 'dva';
import React from 'react';
import { MobilePhoneInput } from '@/components/CustomizedFormControls';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
@connect(({ global, basicCache }) => {
  function byLangFilter(e) {
    return e.languageCode === global.languageCode;
  }
  // 基础数据
  // 币种
  const currencies = basicCache.currencies.filter(byLangFilter);
  // 付款条件
  const paymentTerms = basicCache.paymentTerms.filter(byLangFilter);
  // 采购组
  const { purchaseGroups } = basicCache;

  return { currencies, paymentTerms, purchaseGroups };
})
class FormContent extends React.Component {
  render() {
    const {
      form: { getFieldDecorator },
      data,
      tabKey,
      valueChange,
      currencies,
      paymentTerms,
      purchaseGroups,
    } = this.props;

    if (tabKey !== data.purchasingOrganizationCode) return null;
    return (
      <Form layout="vertical">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6}>
            <FormItem label="订单货币">
              {getFieldDecorator('currencyCode', {
                rules: [{ required: true }],
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
          <Col md={6}>
            <FormItem label="付款条件">
              {getFieldDecorator('paymentTermsCode', {
                rules: [{ required: true }],
                initialValue: data.paymentTermsCode,
              })(
                <Select onChange={value => valueChange('paymentTermsCode', value)}>
                  {
                    paymentTerms.map(e =>
                      <Option key={e.code} value={e.code}>{e.name}</Option>,
                    )
                  }
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem label="销售人员">
              {getFieldDecorator('salerName', {
                rules: [{ required: true }],
                initialValue: data.salerName,
              })(
                <Input onChange={e => valueChange('salerName', e.target.value)}/>,
              )}
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem label="销售人员电话">
              {getFieldDecorator('salerTelephone', {
                rules: [{ required: true }],
                initialValue: {
                  mobilePhoneCountryCode: data.salerTelephoneCountryCode,
                  mobilePhone: data.salerTelephone,
                },
              })(
                <MobilePhoneInput onChange={value => valueChange('salerTelephone', value)}/>,
              )}
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem label="供应商级别">
              {getFieldDecorator('levelCode', {
                rules: [{ required: true }],
                initialValue: data.levelCode,
              })(
                <Select onChange={value => valueChange('levelCode', value)}>
                  <Option value="1">级别1</Option>
                  <Option value="2">级别2</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem label="收货时发票过账">
              {getFieldDecorator('invoicePostInReceive', {
                rules: [{ required: true }],
                valuePropName: 'checked',
                initialValue: data.invoicePostInReceive,
              })(
                <Switch onChange={value => valueChange('invoicePostInReceive', value)}/>)
              }
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem label="采购组">
              {getFieldDecorator('purchasingGroupCode', {
                rules: [{ required: true }],
                initialValue: data.purchasingGroupCode,
              })(
                <Select onChange={value => valueChange('purchasingGroupCode', value)}>
                  {
                    purchaseGroups.map(e =>
                      <Option key={e.code} value={e.code}>{e.name}</Option>,
                    )
                  }
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem label="计划交货时间">
              {getFieldDecorator('deliveryPlanDays', {
                rules: [{ required: true }],
                initialValue: data.deliveryPlanDays,
              })(
                <InputNumber
                  min={1}
                  formatter={value => `${value}天`}
                  parser={value => value.replace('天', '')}
                  onChange={value => valueChange('deliveryPlanDays', value)}
                />,
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}

@connect(({ bpEdit, basicCache }) => {
  // BP数据
  const details = bpEdit.details || {};
  const vendor = details.vendor || { };
  const purchasingOrganizationList = vendor.purchasingOrganizationList || [];

  // 基础数据
  // 采购组织
  const { purchaseOrganizations } = basicCache;
  return { details, vendor, purchasingOrganizationList, purchaseOrganizations };
}, undefined, undefined, { withRef: true })
class PurchasingOrg extends React.Component {
  constructor(props) {
    super(props);
    const { purchasingOrganizationList: tabsData } = this.props;
    this.state = {
      tabKey: (tabsData && tabsData[0] && tabsData[0].purchasingOrganizationCode) || '',
    }
  }

  valueChange = (key, value) => {
    const { tabKey } = this.state;
    const { details, vendor, purchasingOrganizationList } = this.props;

    const newPurchasingOrganizationList = purchasingOrganizationList.map(e => {
      if (e.purchasingOrganizationCode === tabKey) {
        if (key === 'salerTelephone') {
          e.salerTelephone = value.mobilePhone;
          e.salerTelephoneCountryCode = value.mobilePhoneCountryCode;
        } else {
          e[key] = value;
        }
      }
      return e;
    });
    const newVendor = {
      ...vendor,
      ...{ purchasingOrganizationList: newPurchasingOrganizationList },
    };
    const newDetails = { ...details, ...{ vendor: newVendor } };

    // this.props.dispatch({
    //   type: 'bpEdit/setDetails',
    //   payload: newDetails,
    // });
    this.props.dispatch({
      type: 'bpEdit/setState',
      payload: {
        type: 'details',
        data: newDetails,
      },
    });
  }

  onTabChange = tabKey => {
    if (tabKey === 'select') return;
    this.setState({ tabKey });
  }

  // 级联选泽采购组织时
  onCascaderChange = obj => {
    const { details, vendor, purchasingOrganizationList: tabsData } = this.props;
    const index = obj.length - 1;

    const newPurchasingOrganizationList = [].concat(tabsData, {
      purchasingOrganizationCode: obj[index],
    });

    const newVendor = {
      ...vendor,
      ...{ purchasingOrganizationList: newPurchasingOrganizationList },
    };
    const newDetails = { ...details, ...{ vendor: newVendor } };

    // this.props.dispatch({
    //   type: 'bpEdit/setDetails',
    //   payload: newDetails,
    // });
    this.props.dispatch({
      type: 'bpEdit/setState',
      payload: {
        type: 'details',
        data: newDetails,
      },
    });

    this.setState({
      tabKey: obj[index],
    });
  }

  renderCascader = () => {
    const { purchasingOrganizationList: tabsData, purchaseOrganizations } = this.props;
    const codeList = tabsData.map(e => e.purchasingOrganizationCode);

    const options = purchaseOrganizations.map(e => {
      let disabled = false;
      if (codeList.indexOf(e.code) > -1) {
        disabled = true;
      }
      return { ...e, disabled };
    });
    return (
      <Cascader
        options={options}
        onChange={this.onCascaderChange}
        fieldNames={{ label: 'name', value: 'code' }}>
        <a style={{ fontSize: 14, marginLeft: -16 }} href="#">
          采购组织 <Icon type="down" style={{ fontSize: 12 }} />
        </a>
      </Cascader>
    );
  }

  closeTab = tabKey => {
    let index = -1;
    let key = '';
    const { details, vendor, purchasingOrganizationList: tabsData } = this.props;

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

    const newVendor = { ...vendor, ...{ purchasingOrganizationList: newTabsData } };
    const newDetails = { ...details, ...{ vendor: newVendor } };

    // this.props.dispatch({
    //   type: 'bpEdit/setDetails',
    //   payload: newDetails,
    // });
    this.props.dispatch({
      type: 'bpEdit/setState',
      payload: {
        type: 'details',
        data: newDetails,
      },
    });
    this.setState({ tabKey: key });
  }

  render() {
    const { tabKey } = this.state;
    const {
      purchasingOrganizationList: tabsData,
      purchaseOrganizations,
    } = this.props;

    let tabList = tabsData.map(e => ({
      key: e.purchasingOrganizationCode,
      tab: purchaseOrganizations.filter(e1 => e1.code === e.purchasingOrganizationCode)[0].name,
    }));

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
        title="采购组织"
        bordered={false}
        style={{ marginBottom: '24px' }}
        tabList={tabList}
        activeTabKey={tabKey}
        onTabChange={key => {
          this.onTabChange(key);
        }}
      >
        {tabKey ?
          tabsData.map(e =>
            <FormContent
              key={e.purchasingOrganizationCode}
              valueChange={this.valueChange}
              tabKey={tabKey}
              data={e} />,
          ) : <Empty description="暂无采购组织" />
        }
      </Card>
    );
  }
}

export default PurchasingOrg;

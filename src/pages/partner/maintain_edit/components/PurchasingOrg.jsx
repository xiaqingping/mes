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
class FormContent extends React.Component {
  render() {
    const {
      form: { getFieldDecorator },
      data,
      tabKey,
      valueChange,
    } = this.props;

    if (tabKey !== data.purchasingOrganizationCode) return null;
    return (
      <Form layout="vertical">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6}>
            <FormItem label="订单货币">
              {getFieldDecorator('currencyCode', {
                initialValue: data.currencyCode,
              })(
                <Select onChange={value => valueChange('currencyCode', value)}>
                  <Option value="1">人民币</Option>
                  <Option value="2">美元</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem label="付款条件">
              {getFieldDecorator('paymentTermsCode', {
                initialValue: data.paymentTermsCode,
              })(
                <Select onChange={value => valueChange('paymentTermsCode', value)}>
                  <Option value="1">条件1</Option>
                  <Option value="2">条件2</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem label="销售人员">
              {getFieldDecorator('salerName', {
                initialValue: data.salerName,
              })(
                <Input onChange={e => valueChange('salerName', e.target.value)}/>,
              )}
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem label="销售人员电话">
              {getFieldDecorator('salerTelephone', {
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
                initialValue: data.purchasingGroupCode,
              })(
                <Select onChange={value => valueChange('purchasingGroupCode', value)}>
                  <Option value="1">组1</Option>
                  <Option value="2">组2</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem label="计划交货时间">
              {getFieldDecorator('deliveryPlanDays', {
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

@connect(({ partnerMaintainEdit }) => {
  const details = partnerMaintainEdit.details || {};
  const vendor = details.vendor || { };
  const purchasingOrganizationList = vendor.purchasingOrganizationList || [];
  return { details, vendor, purchasingOrganizationList };
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
    const newVendor = { ...vendor, ...{ purchasingOrganizationList: newPurchasingOrganizationList } };
    const newDetails = { ...details, ...{ vendor: newVendor } };

    this.props.dispatch({
      type: 'partnerMaintainEdit/setDetails',
      payload: newDetails,
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

    const newVendor = { ...vendor, ...{ purchasingOrganizationList: newPurchasingOrganizationList } };
    const newDetails = { ...details, ...{ vendor: newVendor } };

    this.props.dispatch({
      type: 'partnerMaintainEdit/setDetails',
      payload: newDetails,
    });

    this.setState({
      tabKey: obj[index],
    });
  }

  renderCascader = () => {
    const { purchasingOrganizationList: tabsData } = this.props;
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
        <a style={{ fontSize: 14, marginLeft: -16 }} href="#">采购组织 <Icon type="down" style={{ fontSize: 12 }} /></a>
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

    this.props.dispatch({
      type: 'partnerMaintainEdit/setDetails',
      payload: newDetails,
    });
    this.setState({ tabKey: key });
  }

  render() {
    const { tabKey } = this.state;
    const { purchasingOrganizationList: tabsData } = this.props;

    let tabList = tabsData.map(e => ({
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

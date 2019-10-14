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

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ partnerMaintainEdit }) => ({
  details: partnerMaintainEdit.details,
}), undefined, undefined, { withRef: true })
class PurchasingOrg extends React.Component {
  constructor(props) {
    super(props);
    const { details: { purchaseOrganizationList: tabsData } } = this.props;
    this.state = {
      tabKey: (tabsData && tabsData[0] && tabsData[0].purchaseOrganizationCode) || '',
    }
  }

  renderTabPane = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Form layout="vertical">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6}>
            <FormItem label="订单货币">
              {getFieldDecorator('currencyCode')(
                <Select>
                  <Option value="1">人民币</Option>
                  <Option value="2">美元</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem label="付款条件">
              {getFieldDecorator('payTermsCode')(
                <Select>
                  <Option value="1">条件1</Option>
                  <Option value="2">条件2</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem label="销售人员">
              {getFieldDecorator('salerName')(<Input />)}
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem label="销售人员电话">
              {getFieldDecorator('salerTelephone')(<Input />)}
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem label="供应商级别">
              {getFieldDecorator('levelCode')(
                <Select>
                  <Option value="1">级别1</Option>
                  <Option value="2">级别2</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem label="收货时发票过账">
              {getFieldDecorator('invoicePostInReceive', { valuePropName: 'checked' })(<Switch />)}
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem label="采购组">
              {getFieldDecorator('purchaseGroupCode')(
                <Select>
                  <Option value="1">组1</Option>
                  <Option value="2">组2</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem label="计划交货时间">
              {getFieldDecorator('deliveryPlanDays', {
                initialValue: 1,
              })(
                <InputNumber
                  min={1}
                  formatter={value => `${value}天`}
                  parser={value => value.replace('天', '')}
                />,
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
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
    const { purchaseOrganizationList: tabsData } = details;
    const index = obj.length - 1;

    const data = [].concat(tabsData, {
      purchaseOrganizationCode: obj[index],
    });

    this.props.dispatch({
      type: 'partnerMaintainEdit/setDetails',
      payload: { ...details, ...{ purchaseOrganizationList: data } },
    });

    this.setState({
      tabKey: obj[index],
    });
  }

  renderCascader = () => {
    const { details } = this.props;
    const { purchaseOrganizationList: tabsData } = details;
    const cascaderTitle = tabsData.map(e => e.purchaseOrganizationCode);
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
    const { details } = this.props;
    const { purchaseOrganizationList: tabsData } = details;

    // 过滤掉关闭的采购组织
    const newTabsData = tabsData.filter((e, i) => {
      if (e.purchaseOrganizationCode !== tabKey) return true;
      index = i;
      return false;
    });

    // 根据index决定选中哪个Tab
    if (newTabsData.length > 0) {
      // 关闭第一个
      if (index === 0) {
        key = newTabsData[0].purchaseOrganizationCode;
      }
      // 关闭最后一个
      if (index === tabsData.length - 1) {
        key = newTabsData[index - 1].purchaseOrganizationCode;
      }
      // 关闭中间的Tab
      if (index > 0 && index < tabsData.length - 1) {
        key = newTabsData[index].purchaseOrganizationCode;
      }
    } else {
      key = '';
    }

    this.props.dispatch({
      type: 'partnerMaintainEdit/setDetails',
      payload: { ...details, ...{ purchaseOrganizationList: newTabsData } },
    });
    this.setState({
      tabKey: key,
    });
  }

  render() {
    const { tabKey } = this.state;
    const { details } = this.props;
    const { purchaseOrganizationList: tabsData } = details;

    let tabList = tabsData.map(e => ({
      key: e.purchaseOrganizationCode,
      tab: e.purchaseOrganizationCode,
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
        {tabKey ? this.renderTabPane() : <Empty description="暂无采购组织" />}
      </Card>
    );
  }
}

export default Form.create()(PurchasingOrg);

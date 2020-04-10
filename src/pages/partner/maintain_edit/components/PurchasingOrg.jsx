/**
 * 供应商 采购组织
 */
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
  Cascader,
  message,
} from 'antd';
import { DownOutlined, CloseOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import React from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { MobilePhoneInput } from '@/components/CustomizedFormControls';

const FormItem = Form.Item;
const { Option } = Select;

@connect(
  ({ global, basicCache, bp }) => {
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

    // 供应商级别
    const { VendorLevelCode } = bp;

    return { currencies, paymentTerms, purchaseGroups, VendorLevelCode };
  },
  null,
  null,
  { forwardRef: true },
)
class FormContent extends React.Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
  }

  render() {
    const {
      data,
      tabKey,
      valueChange,
      currencies,
      paymentTerms,
      purchaseGroups,
      VendorLevelCode,
    } = this.props;

    if (tabKey !== data.purchaseOrganizationCode) return null;
    return (
      <Form
        ref={this.formRef}
        layout="vertical"
        hideRequiredMark
        initialValues={{
          currencyCode: data.currencyCode,
          paymentTermsCode: data.paymentTermsCode,
          salerName: data.salerName,
          salerTelephone: {
            mobilePhoneCountryCode: data.salerTelephoneCountryCode,
            mobilePhone: data.salerTelephone,
          },
          levelCode: data.levelCode,
          invoicePostInReceive: data.invoicePostInReceive === 1,
          purchaseGroupCode: data.purchaseGroupCode,
          deliveryPlanDays: data.deliveryPlanDays,
        }}
      >
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6}>
            <FormItem
              name="currencyCode"
              label={formatMessage({ id: 'bp.maintain_details.purchase_org.order_currency' })}
              rules={[{ required: true }]}
            >
              <Select
                onChange={value => valueChange('currencyCode', value)}
                showSearch
                filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
              >
                {currencies.map(e => (
                  <Option key={e.code} value={e.code}>
                    {e.shortText}
                  </Option>
                ))}
              </Select>
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem
              name="paymentTermsCode"
              label={formatMessage({ id: 'bp.maintain_details.purchase_org.payment_condition' })}
              rules={[{ required: true }]}
            >
              <Select onChange={value => valueChange('paymentTermsCode', value)}>
                {paymentTerms.map(e => (
                  <Option key={e.code} value={e.code}>
                    {e.name}
                  </Option>
                ))}
              </Select>
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem
              name="salerName"
              label={formatMessage({ id: 'bp.maintain_details.purchase_org.sales_rep' })}
              rules={[{ required: true }]}
            >
              <Input onChange={e => valueChange('salerName', e.target.value)} />
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem
              name="salerTelephone"
              label={formatMessage({ id: 'bp.maintain_details.purchase_org.sales_rep_phone' })}
              rules={[{ required: true }]}
            >
              <MobilePhoneInput onChange={value => valueChange('salerTelephone', value)} />
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6}>
            <FormItem
              name="levelCode"
              label={formatMessage({ id: 'bp.maintain_details.purchase_org.supplier_level' })}
              rules={[{ required: true }]}
            >
              <Select onChange={value => valueChange('levelCode', value)}>
                {VendorLevelCode.map(e => (
                  <Option key={e.id} value={e.id}>
                    {e.name}
                  </Option>
                ))}
              </Select>
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem
              name="invoicePostInReceive"
              label={formatMessage({
                id: 'bp.maintain_details.purchase_org.invoice_when_good_receipt',
              })}
              rules={[{ required: true }]}
              valuePropName="checked"
            >
              <Switch onChange={value => valueChange('invoicePostInReceive', value)} />
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem
              name="purchaseGroupCode"
              label={formatMessage({
                id: 'bp.maintain_details.purchase_org.purchase_organization',
              })}
              rules={[{ required: true }]}
            >
              <Select onChange={value => valueChange('purchaseGroupCode', value)}>
                {purchaseGroups.map(e => (
                  <Option key={e.code} value={e.code}>
                    {e.name}
                  </Option>
                ))}
              </Select>
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem
              name="deliveryPlanDays"
              label={formatMessage({ id: 'bp.maintain_details.purchase_org.delivery_time_plan' })}
              rules={[{ required: true }]}
            >
              <InputNumber
                min={1}
                formatter={value => `${value}天`}
                parser={value => value.replace('天', '')}
                onChange={value => valueChange('deliveryPlanDays', value)}
              />
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}

@connect(
  ({ bpEdit, basicCache }) => {
    // BP数据
    const { editType } = bpEdit;
    const details = bpEdit.details || {};
    const vendor = details.vendor || {};
    const purchaseOrganizationList = vendor.purchaseOrganizationList || [];

    // 基础数据
    // 采购组织
    const { purchaseOrganizations } = basicCache;
    return { editType, details, vendor, purchaseOrganizationList, purchaseOrganizations };
  },
  null,
  null,
  { forwardRef: true },
)
class PurchasingOrg extends React.Component {
  constructor(props) {
    super(props);
    this.formContentRef = React.createRef();
    const { purchaseOrganizationList: tabsData } = this.props;
    this.state = {
      tabKey: (tabsData && tabsData[0] && tabsData[0].purchaseOrganizationCode) || '',
    };
  }

  valueChange = (key, value) => {
    const { tabKey } = this.state;
    const { details, vendor, purchaseOrganizationList } = this.props;

    const newPurchaseOrganizationList = purchaseOrganizationList.map(e => {
      if (e.purchaseOrganizationCode === tabKey) {
        e[key] = value;
        if (key === 'salerTelephone') {
          e.salerTelephone = value.mobilePhone;
          e.salerTelephoneCountryCode = value.mobilePhoneCountryCode;
        }
        if (key === 'invoicePostInReceive') {
          e[key] = value ? 1 : 2;
        }
      }
      return e;
    });
    const newVendor = {
      ...vendor,
      ...{ purchaseOrganizationList: newPurchaseOrganizationList },
    };
    const newDetails = { ...details, ...{ vendor: newVendor } };

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

    try {
      if (this.formContentRef.current && this.formContentRef.current.formRef) {
        await this.formContentRef.current.formRef.current.validateFields();
        this.setState({ tabKey });
      }
    } catch (error) {
      console.log(error);
      message.error('采购组织验证未通过');
    }
  };

  // 级联选泽采购组织时
  onCascaderChange = async obj => {
    const { details, vendor, purchaseOrganizationList: tabsData } = this.props;
    const index = obj.length - 1;

    try {
      if (this.formContentRef.current && this.formContentRef.current.formRef.current) {
        await this.formContentRef.current.formRef.current.validateFields();
      }
      const newPurchaseOrganizationList = [].concat(tabsData, {
        purchaseOrganizationCode: obj[index],
        invoicePostInReceive: 2,
        // theNew代表新增加的数据
        theNew: true,
      });

      const newVendor = {
        ...vendor,
        ...{ purchaseOrganizationList: newPurchaseOrganizationList },
      };
      const newDetails = { ...details, ...{ vendor: newVendor } };

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
    } catch (error) {
      console.log(error);
      message.error('采购组织验证未通过');
    }
  };

  renderCascader = () => {
    const { purchaseOrganizationList: tabsData, purchaseOrganizations } = this.props;
    const codeList = tabsData.map(e => e.purchaseOrganizationCode);

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
        fieldNames={{ label: 'name', value: 'code' }}
      >
        <a style={{ fontSize: 14, marginLeft: -16 }}>
          <FormattedMessage id="bp.maintain_details.purchase_org.purchase_org" />
          <DownOutlined style={{ fontSize: 12 }} />
        </a>
      </Cascader>
    );
  };

  closeTab = tabKey => {
    let index = -1;
    let key = '';
    const { details, vendor, purchaseOrganizationList: tabsData } = this.props;

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

    const newVendor = { ...vendor, ...{ purchaseOrganizationList: newTabsData } };
    const newDetails = { ...details, ...{ vendor: newVendor } };

    this.props.dispatch({
      type: 'bpEdit/setState',
      payload: {
        type: 'details',
        data: newDetails,
      },
    });
    this.setState({ tabKey: key });
  };

  render() {
    let { tabKey } = this.state;
    const { editType, purchaseOrganizationList: tabsData, purchaseOrganizations } = this.props;

    // 如有有数据，但没有选中，则默认选中第一条
    if (!tabKey && tabsData.length > 0) {
      tabKey = tabsData[0].purchaseOrganizationCode;
    }

    let tabList = tabsData.map(e => ({
      key: e.purchaseOrganizationCode,
      tab: purchaseOrganizations.filter(e1 => e1.code === e.purchaseOrganizationCode)[0].name,
      theNew: e.theNew,
    }));

    tabList = tabList.concat({
      key: 'select',
      tab: this.renderCascader(),
    });
    tabList.forEach(e => {
      // 修改时无法删除已有的采购组织
      if (editType === 'update' && !e.theNew) {
        return;
      }
      if (e.key === tabKey) {
        e.tab = (
          <>
            {e.tab} <CloseOutlined style={{ fontSize: 12 }} onClick={() => this.closeTab(e.key)} />
          </>
        );
      } else {
        e.tab = (
          <>
            {e.tab}
            <CloseOutlined style={{ fontSize: 12, visibility: 'hidden' }} />
          </>
        );
      }
    });

    return (
      <Card
        title={formatMessage({ id: 'bp.maintain_details.purchase_org' })}
        bordered={false}
        style={{ marginBottom: '24px' }}
        tabList={tabList}
        activeTabKey={tabKey}
        onTabChange={key => {
          this.onTabChange(key);
        }}
      >
        {tabKey ? (
          tabsData.map(e => (
            <FormContent
              ref={this.formContentRef}
              key={e.purchaseOrganizationCode}
              valueChange={this.valueChange}
              tabKey={tabKey}
              data={e}
            />
          ))
        ) : (
          <Empty description={formatMessage({ id: 'bp.maintain_details.purchase_org.empty' })} />
        )}
      </Card>
    );
  }
}

export default PurchasingOrg;

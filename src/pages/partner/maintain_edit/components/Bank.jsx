/**
 * 供应商 付款银行
 */
import { Card, Col, Form, Input, Row, Select, Spin } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import debounce from 'lodash/debounce';
import api from '@/api';

const FormItem = Form.Item;
const { Option } = Select;

@connect(
  ({ global, basicCache, bpEdit }) => {
    function byLangFilter(e) {
      return e.languageCode === global.languageCode;
    }
    // 业务伙伴数据
    const details = bpEdit.details || {};
    const basic = details.basic || {};
    const vendor = details.vendor || {};
    const paymentBank = vendor.paymentBank || {};

    // 基础数据
    // 国家
    const countrys = basicCache.countrys.filter(byLangFilter);
    return { details, basic, vendor, paymentBank, countrys };
  },
  null,
  null,
  { forwardRef: true },
)
class Bank extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bank: [],
      bankFetching: false,
    };
    this.formRef = React.createRef();
    // 防抖
    this.fetchBank = debounce(this.fetchBank, 800);
  }

  valueChange = (key, value) => {
    const { details, vendor, paymentBank } = this.props;

    const newPaymentBank = { ...paymentBank, ...{ [key]: value } };
    // 修改国家时清掉开户行
    if (key === 'countryCode') {
      newPaymentBank.bankCode = '';
      this.formRef.current.setFieldsValue({ bankCode: '' });
    }
    const newVendor = { ...vendor, ...{ paymentBank: newPaymentBank } };
    const newDetails = { ...details, ...{ vendor: newVendor } };

    this.props.dispatch({
      type: 'bpEdit/setState',
      payload: {
        type: 'details',
        data: newDetails,
      },
    });
  };

  fetchBank = value => {
    if (!value) {
      this.setState({ bank: [] });
      return;
    }
    const { countryCode } = this.props.paymentBank;
    api.basic
      .getBanks({
        codeOrFullName: value,
        countryCode,
      })
      .then(bank => {
        this.setState({ bank });
      });
  };

  render() {
    const { basic, paymentBank, countrys } = this.props;
    const type = basic.type || 1;
    const { bank, bankFetching } = this.state;

    return (
      <Card
        bordered={false}
        title={formatMessage({ id: 'bp.maintain_details.bank' })}
        style={{ marginBottom: type === 2 ? '24px' : null }}
      >
        <Form
          layout="vertical"
          ref={this.formRef}
          hideRequiredMark
          initialValues={{
            countryCode: paymentBank.countryCode,
            bankCode: paymentBank.bankCode,
            bankAccount: paymentBank.bankAccount,
            bankAccountName: paymentBank.bankAccountName,
          }}
        >
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={6}>
              <FormItem
                name="countryCode"
                label={formatMessage({ id: 'bp.maintain_details.bank.country' })}
                rules={[{ required: true }]}
              >
                <Select
                  showSearch
                  filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                  onChange={value => this.valueChange('countryCode', value)}
                >
                  {countrys.map(e => (
                    <Option key={e.code} value={e.code}>
                      {e.name}
                    </Option>
                  ))}
                </Select>
              </FormItem>
            </Col>
            <Col md={6}>
              <FormItem
                name="bankCode"
                label={formatMessage({ id: 'bp.maintain_details.bank.bank_name' })}
                rules={[{ required: true }]}
              >
                <Select
                  showSearch
                  disabled={!paymentBank.countryCode}
                  notFoundContent={bankFetching ? <Spin size="small" /> : null}
                  filterOption={false}
                  onSearch={this.fetchBank}
                  onChange={value => this.valueChange('bankCode', value)}
                >
                  {bank.map(d => (
                    <Option key={d.code} value={d.code}>
                      {d.fullName}
                    </Option>
                  ))}
                </Select>
              </FormItem>
            </Col>
            <Col md={6}>
              <FormItem
                name="bankAccount"
                label={formatMessage({ id: 'bp.maintain_details.bank.bank_account' })}
                rules={[{ required: true }]}
              >
                <Input onChange={e => this.valueChange('bankAccount', e.target.value)} />
              </FormItem>
            </Col>
            <Col md={6}>
              <FormItem
                name="bankAccountName"
                label={formatMessage({ id: 'bp.maintain_details.bank.contact_name' })}
                rules={[{ required: true }]}
              >
                <Input onChange={e => this.valueChange('bankAccountName', e.target.value)} />
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }
}

export default Bank;

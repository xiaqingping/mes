import { Card, Col, Form, Input, Row, Select, Spin } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import debounce from 'lodash/debounce';
import basicApi from '@/api/basic';

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
  { withRef: true },
)
class Bank extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bank: [],
      bankFetching: false,
    };
    // 防抖
    this.fetchBank = debounce(this.fetchBank, 500);
  }

  valueChange = (key, value) => {
    const { details, vendor, paymentBank } = this.props;

    const newPaymentBank = { ...paymentBank, ...{ [key]: value } };
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
    basicApi
      .getBanks({
        codeOrFullName: value,
      })
      .then(bank => {
        this.setState({ bank });
      });
  };

  render() {
    const {
      form: { getFieldDecorator },
      basic,
      paymentBank,
      countrys,
    } = this.props;
    const type = basic.type || 1;
    const { bank, bankFetching } = this.state;

    return (
      <Card title="付款银行" bordered={false} style={{ marginBottom: type === 2 ? '24px' : null }}>
        <Form layout="vertical">
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={6}>
              <FormItem label="国家">
                {getFieldDecorator('countryCode', {
                  initialValue: paymentBank.countryCode,
                  rules: [{ required: true }],
                })(
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
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col md={6}>
              <FormItem label="开户行">
                {getFieldDecorator('bankCode', {
                  initialValue: paymentBank.bankCode,
                  rules: [{ required: true }],
                })(
                  <Select
                    showSearch
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
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col md={6}>
              <FormItem label="银行账户">
                {getFieldDecorator('bankAccount', {
                  initialValue: paymentBank.bankAccount,
                  rules: [{ required: true }],
                })(<Input onChange={e => this.valueChange('bankAccount', e.target.value)} />)}
              </FormItem>
            </Col>
            <Col md={6}>
              <FormItem label="户名">
                {getFieldDecorator('bankAccountName', {
                  initialValue: paymentBank.bankAccountName,
                  rules: [{ required: true }],
                })(<Input onChange={e => this.valueChange('bankAccountName', e.target.value)} />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }
}

export default Form.create()(Bank);

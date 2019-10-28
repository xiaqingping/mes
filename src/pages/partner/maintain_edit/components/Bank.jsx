import {
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
} from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ bpEdit }) => {
  const details = bpEdit.details || {};
  const basic = details.basic || {};
  const vendor = details.vendor || { };
  const paymentBank = vendor.paymentBank || {};
  return { details, basic, vendor, paymentBank };
}, undefined, undefined, { withRef: true })
class Bank extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  valueChange = (key, value) => {
    const { details, vendor, paymentBank } = this.props;

    const newPaymentBank = { ...paymentBank, ...{ [key]: value } };
    const newVendor = { ...vendor, ...{ paymentBank: newPaymentBank } };
    const newDetails = { ...details, ...{ vendor: newVendor } }

    this.props.dispatch({
      type: 'bpEdit/setDetails',
      payload: newDetails,
    });
  }

  render() {
    const {
      form: { getFieldDecorator },
      basic,
      paymentBank,
    } = this.props;
    const type = basic.type || 1;

    return (
      <Card
        title="付款银行"
        bordered={false}
        style={{ marginBottom: type === 2 ? '24px' : null }}
      >
        <Form layout="vertical">
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={6}>
              <FormItem label="国家">
                {getFieldDecorator('countryCode', {
                  initialValue: paymentBank.countryCode,
                })(
                  <Select onChange={value => this.valueChange('countryCode', value)}>
                    <Option value="1">中国</Option>
                    <Option value="2">美国</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col md={6}>
              <FormItem label="开户行">
                {getFieldDecorator('bankCode', {
                  initialValue: paymentBank.bankCode,
                })(
                  <Select onChange={value => this.valueChange('bankCode', value)}>
                    <Option value="1">工商银行</Option>
                    <Option value="2">中国银行</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col md={6}>
              <FormItem label="银行账户">
                {getFieldDecorator('bankAccount', {
                  initialValue: paymentBank.bankAccount,
                })(<Input onChange={e => this.valueChange('bankAccount', e.target.value)} />)}
              </FormItem>
            </Col>
            <Col md={6}>
              <FormItem label="户名">
                {getFieldDecorator('bankAccountName', {
                  initialValue: paymentBank.bankAccountName,
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

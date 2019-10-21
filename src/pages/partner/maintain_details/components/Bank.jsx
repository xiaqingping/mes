import {
  Card,
  Form,
  Descriptions,
} from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import './style.less'

const DescriptionsItem = Descriptions.Item;

@connect(({ partnerMaintainEdit }) => ({
  details: partnerMaintainEdit.supplier,
}))
class Bank extends Component {
  state = {}

  render() {
    const { details: { vendor: { paymentBank } } } = this.props;
    return (
      <Card title="付款银行" bordered={false} style={{ marginBottom: '24px' }} className="check-tabs">
        <Descriptions
          className="s-descriptions"
          layout="vertical"
          column={4}
        >
          <DescriptionsItem label="国家">{paymentBank.countryCode}</DescriptionsItem>
          <DescriptionsItem label="开户行">{paymentBank.bankName}</DescriptionsItem>
          <DescriptionsItem label="银行账户">{paymentBank.bankAccount}</DescriptionsItem>
          <DescriptionsItem label="户名">{paymentBank.bankAccountName}</DescriptionsItem>
        </Descriptions>
      </Card>
    );
  }
}

export default Form.create()(Bank);

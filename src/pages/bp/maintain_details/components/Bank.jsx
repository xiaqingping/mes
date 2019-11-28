import { Card, Form, Descriptions, Empty } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import './style.less';

const DescriptionsItem = Descriptions.Item;

@connect(({ partnerMaintainEdit }) => ({
  details: partnerMaintainEdit.supplier,
}))
class Bank extends Component {
  state = {};

  render() {
    const {
      details: { vendor },
    } = this.props;
    return (
      <Card
        title="付款银行"
        bordered={false}
        style={{ marginBottom: '24px' }}
        className="check-tabs"
      >
        {vendor ? (
          <Descriptions className="s-descriptions" layout="vertical" column={4}>
            <DescriptionsItem label="国家">{vendor.paymentBank.countryCode}</DescriptionsItem>
            <DescriptionsItem label="开户行">{vendor.paymentBank.bankName}</DescriptionsItem>
            <DescriptionsItem label="银行账户">{vendor.paymentBank.bankAccount}</DescriptionsItem>
            <DescriptionsItem label="户名">{vendor.paymentBank.bankAccountName}</DescriptionsItem>
          </Descriptions>
        ) : (
          <Empty />
        )}
      </Card>
    );
  }
}

export default Form.create()(Bank);

import {
  Card,
  Form,
  Descriptions,
  Empty,
} from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import './style.less';
import { formatMessage } from 'umi/locale';

const DescriptionsItem = Descriptions.Item;

@connect(({ partnerMaintainEdit }) => ({
  details: partnerMaintainEdit.supplier,
}))
class Bank extends Component {
  state = {}

  render() {
    const { details: { vendor } } = this.props;
    return (
      <Card
      title={formatMessage({ id: 'bp.maintain_details.bank' })}
      bordered={false}
      style={{ marginBottom: '24px' }}
      className="check-tabs">
        {vendor ? <Descriptions
          className="s-descriptions"
          layout="vertical"
          column={4}
        >
          <DescriptionsItem label={formatMessage({ id: 'bp.maintain_details.bank.country' })}>
            {vendor.paymentBank ? vendor.paymentBank.countryCode : ''}
          </DescriptionsItem>
          <DescriptionsItem label={formatMessage({ id: 'bp.maintain_details.bank.bank_name' })}>
            {vendor.paymentBank ? vendor.paymentBank.bankName : ''}
          </DescriptionsItem>
          <DescriptionsItem label={formatMessage({ id: 'bp.maintain_details.bank.bank_account' })}>
            {vendor.paymentBank ? vendor.paymentBank.bankAccount : ''}
          </DescriptionsItem>
          <DescriptionsItem label={formatMessage({ id: 'bp.maintain_details.bank.contact_name' })}>
            {vendor.paymentBank ? vendor.paymentBank.bankAccountName : ''}
          </DescriptionsItem>
        </Descriptions>
        : <Empty />
        }

      </Card>
    );
  }
}

export default Form.create()(Bank);

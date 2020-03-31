import { Card, Form, Descriptions, Empty } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import './style.less';
import { formatMessage } from 'umi/locale';
import { formatter } from '@/utils/utils';

const DescriptionsItem = Descriptions.Item;

@connect(({ partnerMaintainEdit, basicCache, global }) => {
  const countrys = basicCache.countrys.filter(item => item.languageCode === global.languageCode);
  return {
    details: partnerMaintainEdit.supplier,
    countrys,
  };
})
class Bank extends Component {
  state = {};

  componentDidMount() {
    // this.props.dispatch({
    //   type: 'basicCache/getCache',
    //   payload: { type: 'countrys' },
    // });
  }

  render() {
    const {
      details: { vendor },
      countrys,
    } = this.props;
    return (
      <Card
        title={formatMessage({ id: 'bp.maintain_details.bank' })}
        bordered={false}
        style={{ marginBottom: '24px' }}
        className="check-tabs"
      >
        {vendor ? (
          <Descriptions className="s-descriptions" layout="vertical" column={4}>
            <DescriptionsItem label={formatMessage({ id: 'bp.maintain_details.bank.country' })}>
              {vendor.paymentBank
                ? formatter(countrys, vendor.paymentBank.countryCode, 'code', 'name')
                : ''}
            </DescriptionsItem>
            <DescriptionsItem label={formatMessage({ id: 'bp.maintain_details.bank.bank_name' })}>
              {vendor.paymentBank ? vendor.paymentBank.bankName : ''}
            </DescriptionsItem>
            <DescriptionsItem
              label={formatMessage({ id: 'bp.maintain_details.bank.bank_account' })}
            >
              {vendor.paymentBank ? vendor.paymentBank.bankAccount : ''}
            </DescriptionsItem>
            <DescriptionsItem
              label={formatMessage({ id: 'bp.maintain_details.bank.contact_name' })}
            >
              {vendor.paymentBank ? vendor.paymentBank.bankAccountName : ''}
            </DescriptionsItem>
          </Descriptions>
        ) : (
          <Empty />
        )}
      </Card>
    );
  }
}

export default Bank;

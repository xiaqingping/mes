/**
 * 组织信贷数据
 */
import { Card, Descriptions, Divider, Empty } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';

const DescriptionsItem = Descriptions.Item;

@connect(({ bpEdit }) => ({
  details: bpEdit.details || {},
  creditList: (bpEdit.details && bpEdit.details.creditList) || [],
}))
class OrgCredit extends Component {
  renderCredit = data => (
    <Descriptions className="s-descriptions" layout="vertical" column={4}>
      <DescriptionsItem
        label={formatMessage({ id: 'bp.maintain_details.credit_management.credit' })}
      >
        {data.credit} {data.currencyCode} 1天后调整
      </DescriptionsItem>
      <DescriptionsItem
        label={formatMessage({ id: 'bp.maintain_details.credit_management.temporary_credit' })}
      >
        {data.tempCreditLimit} {data.currencyCode} 25天后到期
      </DescriptionsItem>
      <DescriptionsItem
        label={formatMessage({ id: 'bp.maintain_details.credit_management.payment_period' })}
      >
        开票后{data.billingCycle}天到期
      </DescriptionsItem>
      <DescriptionsItem
        label={formatMessage({ id: 'bp.maintain_details.credit_management.invoiced_period' })}
      >
        每月{data.billingDay}日开票
      </DescriptionsItem>
    </Descriptions>
  );

  render() {
    const { creditList } = this.props;
    const data = (creditList && creditList[0]) || {};
    const hasCredit = creditList && creditList.length > 0;
    const renderCredit = this.renderCredit(data);
    const extra = (
      <>
        <a>
          <FormattedMessage id="bp.maintain_details.credit_management.credit_adjustment" />
        </a>
        <Divider type="vertical" />
        <a>
          <FormattedMessage id="bp.maintain_details.credit_management.temporary_credit" />
        </a>
      </>
    );

    return (
      <Card
        title={formatMessage({ id: 'bp.maintain_details.credit_management' })}
        bordered={false}
        style={{ marginBottom: '24px' }}
        // extra={hasCredit ? extra : null}
        extra={extra}
      >
        {hasCredit ? <renderCredit /> : <Empty />}
      </Card>
    );
  }
}

export default OrgCredit;

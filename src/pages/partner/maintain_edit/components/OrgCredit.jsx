import {
  Card,
  Descriptions,
  Divider,
} from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';

const DescriptionsItem = Descriptions.Item;


@connect(({ bpEdit }) => ({
  details: bpEdit.details || {},
  creditList: (bpEdit.details && bpEdit.details.creditList) || [],
}))
class OrgCredit extends Component {
  render() {
    const { creditList } = this.props;
    const data = (creditList && creditList[0]) || {};

    return (
      <Card
        title="信贷数据"
        bordered={false}
        style={{ marginBottom: '24px' }}
        extra={
          <>
            <a>额度调整</a>
            <Divider type="vertical" />
            <a>临时额度</a>
          </>
        }
      >
        <Descriptions
          className="s-descriptions"
          layout="vertical"
          column={4}
        >
          <DescriptionsItem label="额度">{data.credit} {data.currencyCode} 1天后调整</DescriptionsItem>
          <DescriptionsItem label="临时额度">{data.tempCreditLimit} {data.currencyCode} 25天后到期</DescriptionsItem>
          <DescriptionsItem label="付款周期">开票后{data.billingCycle}天到期</DescriptionsItem>
          <DescriptionsItem label="账单间隔">每月{data.billingDay}日开票</DescriptionsItem>
        </Descriptions>
      </Card>
    );
  }
}

export default OrgCredit;

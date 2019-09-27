import {
  Card,
  Descriptions,
  Divider,
} from 'antd';
import React, { Component } from 'react';

const DescriptionsItem = Descriptions.Item;

// eslint-disable-next-line react/prefer-stateless-function
class OrgCredit extends Component {
  render() {
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
          <DescriptionsItem label="额度">20000 CNY 1天后调整</DescriptionsItem>
          <DescriptionsItem label="临时额度">40000 CNY 25天后调整</DescriptionsItem>
          <DescriptionsItem label="付款周期">开票后60天到期</DescriptionsItem>
          <DescriptionsItem label="账单间隔">每月5日开票</DescriptionsItem>
        </Descriptions>
      </Card>
    );
  }
}

export default OrgCredit;

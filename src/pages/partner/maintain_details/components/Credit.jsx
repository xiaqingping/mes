import {
  Card,
  Descriptions,
} from 'antd';
import React, { Component } from 'react';
import './style.less'

const DescriptionsItem = Descriptions.Item;

// eslint-disable-next-line react/prefer-stateless-function
class BasicInfo extends Component {
  render() {
    return (
      <Card
        title="信贷数据"
        className="check-tabs"
        bordered={false}
        style={{ marginBottom: '24px' }}>
        <Descriptions
          className="s-descriptions"
          layout="vertical"
          column={4}
        >
          <DescriptionsItem label="额度">20000 CNY 1天</DescriptionsItem>
          <DescriptionsItem label="临时额度">5600000 CNY 2天</DescriptionsItem>
          <DescriptionsItem label="付款周期">开票后60天到期</DescriptionsItem>
          <DescriptionsItem label="账单间隔">每月5日开票</DescriptionsItem>
        </Descriptions>
      </Card>
    );
  }
}

export default BasicInfo;

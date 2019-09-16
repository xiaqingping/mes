import {
  Card,
  Descriptions,
} from 'antd';
import React, { Component } from 'react';

const DescriptionsItem = Descriptions.Item;

// eslint-disable-next-line react/prefer-stateless-function
class BasicInfo extends Component {
  render() {
    return (
      <Card title="信贷数据" bordered={false} style={{ marginBottom: '24px' }}>
        <Descriptions
          className="s-descriptions"
          layout="vertical"
          column={4}
        >
          <DescriptionsItem label="账期">立即付款</DescriptionsItem>
          <DescriptionsItem label="信用额度">0 CNY</DescriptionsItem>
        </Descriptions>
      </Card>
    );
  }
}

export default BasicInfo;

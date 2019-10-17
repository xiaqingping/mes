import {
  Card,
  Form,
  Descriptions,
} from 'antd';
import React, { Component } from 'react';
import './style.less'

const DescriptionsItem = Descriptions.Item;

class Bank extends Component {
  state = {}

  render() {
    return (
      <Card title="付款银行" bordered={false} style={{ marginBottom: '24px' }} className="check-tabs">
        <Descriptions
          className="s-descriptions"
          layout="vertical"
          column={4}
        >
          <DescriptionsItem label="国家">中国</DescriptionsItem>
          <DescriptionsItem label="开户行">工商银行松江支行</DescriptionsItem>
          <DescriptionsItem label="银行账户">666666666666666</DescriptionsItem>
          <DescriptionsItem label="户名">客户xx</DescriptionsItem>
        </Descriptions>
      </Card>
    );
  }
}

export default Form.create()(Bank);

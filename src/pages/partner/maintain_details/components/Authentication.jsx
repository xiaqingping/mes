import {
  Row,
  Col,
  Card,
  Descriptions,
} from 'antd';
import React, { Component } from 'react';

const DescriptionsItem = Descriptions.Item;

class BasicInfo extends Component {
  state = {};

  render() {
    return (
      <Card title="认证资料" bordered={false} style={{ marginBottom: '24px' }}>
        <Row gutter={16}>
          <Col span={15}>
            <Descriptions
              className="s-descriptions"
              layout="vertical"
              column={3}
            >
              <DescriptionsItem label="认证状态">已认证</DescriptionsItem>
              <DescriptionsItem label="增值税专用发票资质">开</DescriptionsItem>
              <DescriptionsItem label="统一社会信用代码">11111111111</DescriptionsItem>
              <DescriptionsItem label="基本户开户银行">工商银行</DescriptionsItem>
              <DescriptionsItem label="基本户开户账号">基本户开户账号</DescriptionsItem>
              <DescriptionsItem label="基本户开户名">户名</DescriptionsItem>
              <DescriptionsItem span={2} label="注册地址">上海市松江区香闵路698号</DescriptionsItem>
              <DescriptionsItem label="电话号码">+86-0358-57072136-1234</DescriptionsItem>
              <DescriptionsItem label="认证图片">图片</DescriptionsItem>
            </Descriptions>
          </Col>
          <Col span={9}>
            <Descriptions
              className="s-descriptions"
              layout="vertical"
              column={1}
            >
              <DescriptionsItem label="认证说明">说明说明说明说明说明说明说明说明说明说明说明说明说明说明</DescriptionsItem>
            </Descriptions>
          </Col>
        </Row>
      </Card>
    );
  }
}

export default BasicInfo;

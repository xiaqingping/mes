import {
  Card,
  Descriptions,
} from 'antd';
import React, { Component } from 'react';

const DescriptionsItem = Descriptions.Item;

const tabListNoTitle = [
  {
    key: '1',
    tab: '生工国内电商',
  },
  {
    key: '2',
    tab: '生工国外电商',
  },
  {
    key: '3',
    tab: '生工国内直销',
  },
  {
    key: '4',
    tab: '生工国外直销',
  },
];

// eslint-disable-next-line react/prefer-stateless-function
class BasicInfo extends Component {
  state = {
    noTitleKey: '1',
  }

  onTabChange = key => {
    this.setState({
      noTitleKey: key,
    });
  }

  render() {
    return (
      <Card
        bordered={false}
        style={{ width: '100%', marginBottom: '24px' }}
        tabList={tabListNoTitle}
        activeTabKey={this.state.noTitleKey}
        onTabChange={key => {
          this.onTabChange(key);
        }}
      >
        <Descriptions
          className="s-descriptions"
          layout="vertical"
          column={7}
        >
          <DescriptionsItem label="网点归属">华东大区/山东网点</DescriptionsItem>
          <DescriptionsItem label="默认付款方式">银行付款</DescriptionsItem>
          <DescriptionsItem label="币种">意大利里拉</DescriptionsItem>
          <DescriptionsItem label="客户分类">客户</DescriptionsItem>
          <DescriptionsItem label="随货开票">是</DescriptionsItem>
          <DescriptionsItem label="销售冻结">活跃</DescriptionsItem>
          <DescriptionsItem label="默认开票类型">增值税专用发票</DescriptionsItem>
        </Descriptions>
      </Card>
    );
  }
}

export default BasicInfo;

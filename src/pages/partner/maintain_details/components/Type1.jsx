import {
  Card,
  Form,
  Descriptions,
} from 'antd';
import React, { Component } from 'react';
import './style.less'

const DescriptionsItem = Descriptions.Item;

const tabListNoTitle = [
  {
    key: '1',
    tab: '生工',
  },
  {
    key: '2',
    tab: 'BBI',
  },
  {
    key: '3',
    tab: 'NBS',
  },
];

// eslint-disable-next-line react/prefer-stateless-function
class Type extends Component {
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
        className="check-tabs"
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
          column={4}
        >
          <DescriptionsItem label="订单货币">人民币</DescriptionsItem>
          <DescriptionsItem label="付款条件">立即付款</DescriptionsItem>
          <DescriptionsItem label="销售人员">王**</DescriptionsItem>
          <DescriptionsItem label="销售人员电话">+8618735818888</DescriptionsItem>
          <DescriptionsItem label="供应商级别">一级</DescriptionsItem>
          <DescriptionsItem label="收货时发票过账">是</DescriptionsItem>
          <DescriptionsItem label="采购组">组1</DescriptionsItem>
          <DescriptionsItem label="计划交货时间">2天</DescriptionsItem>
        </Descriptions>
      </Card>
    );
  }
}

export default Form.create()(Type);

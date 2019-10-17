import {
  Card,
  Descriptions,
  Divider,
} from 'antd';
import React, { Component } from 'react';
import './style.less'
import FixedQuota from './FixedQuota'
import TemporaryQuota from './TemporaryQuota'

const DescriptionsItem = Descriptions.Item;

// eslint-disable-next-line react/prefer-stateless-function
class BasicInfo extends Component {
  state = {
    fixedVisible: false,
    temporaryVisible: false,
  }

  // 固定额度
  fixedQuota = v => {
    this.setState({
      fixedVisible: v,
    })
  }

  // 临时额度
  temporaryQuota = v => {
    this.setState({
      temporaryVisible: v,
    })
  }

  titleType = () => (
    <div>
      <span>信贷数据</span>
      <span style={{ float: 'right', fontSize: '14px' }}>
        <a onClick={ () => { this.fixedQuota(true) } }>额度调整</a>
        <Divider type="vertical"/>
        <a onClick={ () => { this.temporaryQuota(true) } }>临时额度</a>
        </span>
    </div>
  )

  render() {
    const { fixedVisible, temporaryVisible } = this.state
    return (
      <Card
        title={this.titleType()}
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
        <FixedQuota visible={fixedVisible}
        fixedQuota={v => { this.fixedQuota(v) }}
        />
        <TemporaryQuota visible={temporaryVisible}
        temporaryQuota={v => { this.temporaryQuota(v) }}
        />
      </Card>
    );
  }
}

export default BasicInfo;

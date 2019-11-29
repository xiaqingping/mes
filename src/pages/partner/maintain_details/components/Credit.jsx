import {
  Card,
  Descriptions,
  Divider,
  Empty,
} from 'antd';
import React, { Component } from 'react';
import './style.less'
import { connect } from 'dva';
import FixedQuota from './FixedQuota'
import TemporaryQuota from './TemporaryQuota'

const DescriptionsItem = Descriptions.Item;

@connect(({ partnerMaintainEdit }) => ({
  details: partnerMaintainEdit.details,
}))
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

  titleContent = () => (
    <div style={{ lineHeight: '24px' }}>
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
    const { details: { creditList } } = this.props;
    return (
      <Card
        title={this.titleContent()}
        className="check-tabs"
        bordered={false}
        style={{ marginBottom: '24px' }}>
        {creditList.length !== 0 ? <>
          <Descriptions
          className="s-descriptions"
          layout="vertical"
          column={4}
          >
            <DescriptionsItem label="额度">{creditList[0].credit}</DescriptionsItem>
            <DescriptionsItem label="临时额度">{creditList[0].tempCreditLimit}</DescriptionsItem>
            <DescriptionsItem label="付款周期">{creditList[0].creditPeriod}</DescriptionsItem>
            <DescriptionsItem label="账单间隔">{creditList[0].billingDay}</DescriptionsItem>
          </Descriptions>
        </>
        : <Empty />
        }
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

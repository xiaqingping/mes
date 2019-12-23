import {
  Card,
  Descriptions,
  Divider,
  Empty,
} from 'antd';
import React, { Component } from 'react';
import './style.less'
import { connect } from 'dva';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import FixedQuota from './FixedQuota';
import TemporaryQuota from './TemporaryQuota';

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
      <span>{formatMessage({ id: 'bp.maintain_details.credit_management' })}</span>
      <span style={{ float: 'right', fontSize: '14px' }}>
        <a onClick={ () => { this.fixedQuota(true) } }>
          {formatMessage({ id: 'bp.maintain_details.credit_management.credit_adjustment' })}
        </a>
        <Divider type="vertical"/>
        <a onClick={ () => { this.temporaryQuota(true) } }>
          {formatMessage({ id: 'bp.maintain_details.credit_management.temporary_credit' })}
        </a>
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
            <DescriptionsItem
            label={formatMessage({ id: 'bp.maintain_details.credit_management.credit' })}
            >
            {creditList[0].creditLimit} {creditList[0].currencyCode}&nbsp;&nbsp;
            {moment(creditList[0].lastEvaluationDate).fromNow()}调整
            </DescriptionsItem>
            <DescriptionsItem
            label={formatMessage({ id: 'bp.maintain_details.credit_management.temporary_credit' })}
            >
            {creditList[0].tempCreditLimit} {creditList[0].currencyCode}&nbsp;&nbsp;
            {moment(creditList[0].tempCreditLimitExpirationDate).fromNow()}到期
            </DescriptionsItem>
            <DescriptionsItem
            label={formatMessage({ id: 'bp.maintain_details.credit_management.payment_period' })}
            >
              {formatMessage(
                { id: 'bp.maintain_details.credit_management.dueDate' },
                { name: creditList[0].creditPeriod },
                )}
            </DescriptionsItem>
            <DescriptionsItem
            label={formatMessage({ id: 'bp.maintain_details.credit_management.invoiced_period' })}
            >
              {formatMessage(
                { id: 'bp.maintain_details.credit_management.invoiceIssued' },
                { name: creditList[0].billingDay })}
            </DescriptionsItem>
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

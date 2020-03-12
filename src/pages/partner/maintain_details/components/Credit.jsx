// 信贷数据
import { Card, Descriptions, Divider, Empty } from 'antd';
import React, { Component } from 'react';
import './style.less';
import { connect } from 'dva';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import FixedQuota from './FixedQuota';
import TemporaryQuota from './TemporaryQuota';

const DescriptionsItem = Descriptions.Item;

@connect(({ partnerMaintainEdit }) => ({
  details: partnerMaintainEdit.details,
}))
class BasicInfo extends Component {
  titleContent = () => {
    const {
      details: { basic },
    } = this.props;
    return (
      <div style={{ lineHeight: '24px' }}>
        <span>{formatMessage({ id: 'bp.maintain_details.credit_management' })}</span>
        {basic.certificationStatus === 2 ? (
          ''
        ) : (
          <span style={{ float: 'right', fontSize: '14px' }}>
            <a
              onClick={() => {
                this.FixedQuota.passData(true);
              }}
            >
              {formatMessage({ id: 'bp.maintain_details.credit_management.credit_adjustment' })}
            </a>
            <Divider type="vertical" />
            <a
              onClick={() => {
                this.TemporaryQuota.passData(true);
              }}
            >
              {formatMessage({ id: 'bp.maintain_details.credit_management.temporary_credit' })}
            </a>
          </span>
        )}
      </div>
    );
  };

  render() {
    const {
      details: { creditList },
    } = this.props;
    return (
      <Card
        title={this.titleContent()}
        className="check-tabs"
        bordered={false}
        style={{ marginBottom: '24px' }}
      >
        {creditList.length !== 0 ? (
          <>
            <Descriptions className="s-descriptions" layout="vertical" column={4}>
              <DescriptionsItem
                label={formatMessage({ id: 'bp.maintain_details.credit_management.credit' })}
              >
                {creditList[0].creditLimit ? (
                  <>
                    {creditList[0].creditLimit} {creditList[0].currencyCode}&nbsp;&nbsp;
                    {moment(creditList[0].lastEvaluationDate).fromNow()}调整
                  </>
                ) : (
                  ''
                )}
              </DescriptionsItem>
              <DescriptionsItem
                label={formatMessage({
                  id: 'bp.maintain_details.credit_management.temporary_credit',
                })}
              >
                {creditList[0].tempCreditLimit ? (
                  <>
                    {creditList[0].tempCreditLimit} {creditList[0].currencyCode}&nbsp;&nbsp;
                    {moment(creditList[0].tempCreditLimitExpirationDate).fromNow()}到期
                  </>
                ) : (
                  ''
                )}
              </DescriptionsItem>
              <DescriptionsItem
                label={formatMessage({
                  id: 'bp.maintain_details.credit_management.payment_period',
                })}
              >
                {formatMessage(
                  { id: 'bp.maintain_details.credit_management.dueDate' },
                  { name: creditList[0].creditPeriod },
                )}
              </DescriptionsItem>
              <DescriptionsItem
                label={formatMessage({
                  id: 'bp.maintain_details.credit_management.invoiced_period',
                })}
              >
                {formatMessage(
                  { id: 'bp.maintain_details.credit_management.invoiceIssued' },
                  { name: creditList[0].billingDay },
                )}
              </DescriptionsItem>
            </Descriptions>
          </>
        ) : (
          <Empty />
        )}
        <FixedQuota
          onRef={ref => {
            this.FixedQuota = ref;
          }}
        />
        <TemporaryQuota
          onRef={ref => {
            this.TemporaryQuota = ref;
          }}
        />
      </Card>
    );
  }
}

export default BasicInfo;

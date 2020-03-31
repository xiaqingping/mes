import { Card, Divider, List, Empty } from 'antd';
import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import FixedQuota from './FixedQuota';
import TemporaryQuota from './TemporaryQuota';

@connect(({ partnerMaintainEdit }) => ({
  details: partnerMaintainEdit.details || {},
  creditList: (partnerMaintainEdit.details && partnerMaintainEdit.details.creditList) || [],
}))
class PersonCredit extends React.Component {
  renderListItem = item => (
    <List.Item key={item.billToPartyId}>
      <Card
        hoverable
        title={item.billToPartyName}
        extra={
          <>
            <a
              onClick={() => {
                this.FixedQuota.passData(true, item.billToPartyId);
              }}
            >
              {formatMessage({ id: 'bp.maintain_details.credit_management.credit_adjustment' })}
            </a>
            <Divider type="vertical" />
            <a
              onClick={() => {
                this.TemporaryQuota.passData(true, item.billToPartyId);
              }}
            >
              {formatMessage({ id: 'bp.maintain_details.credit_management.temporary_credit' })}
            </a>
          </>
        }
      >
        {item.creditLimit ? (
          <>
            <span>
              <span style={{ color: '#1890ff', fontWeight: '600' }}>{item.creditLimit} </span>
              {` ${item.currencyCode} `}&nbsp;&nbsp;&nbsp;&nbsp;
              {moment(item.lastEvaluationDate).fromNow()}调整
            </span>
            <br />
            <br />
          </>
        ) : (
          ''
        )}
        {item.tempCreditLimit ? (
          <>
            <span>
              <span style={{ color: '#1890ff', fontWeight: '600' }}>{item.tempCreditLimit} </span>
              {` ${item.currencyCode} `}&nbsp;&nbsp;&nbsp;&nbsp;
              {moment(item.tempCreditLimitExpirationDate).fromNow()}到期
            </span>
            <br />
            <br />
          </>
        ) : (
          ''
        )}
        <span>
          {formatMessage(
            { id: 'bp.maintain_details.credit_management.dueDate' },
            { name: item.creditPeriod },
          )}
        </span>
        <br />
        <br />
        <span>
          {formatMessage(
            { id: 'bp.maintain_details.credit_management.invoiceIssued' },
            { name: item.billingDay },
          )}
        </span>
      </Card>
    </List.Item>
  );

  render() {
    const { creditList } = this.props;
    return (
      <Card
        title={formatMessage({ id: 'bp.maintain_details.credit_management' })}
        bordered={false}
        style={{ marginBottom: '24px' }}
      >
        {creditList.length !== 0 ? (
          <>
            <List
              rowKey="id"
              grid={{
                gutter: 24,
                lg: 3,
                md: 2,
                sm: 1,
                xs: 1,
              }}
              dataSource={creditList}
              renderItem={this.renderListItem}
            />
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

export default PersonCredit;

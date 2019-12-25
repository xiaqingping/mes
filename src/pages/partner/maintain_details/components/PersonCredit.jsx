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
  constructor(props) {
    super(props);
    this.state = {
      fixedVisible: false,
      temporaryVisible: false,
      billToPartyId: '',
    };
  }

  // 固定额度
  fixedQuota = (v, billToPartyId) => {
    this.setState({
      fixedVisible: v,
      billToPartyId,
    });
  };

  // 临时额度
  temporaryQuota = (v, billToPartyId) => {
    this.setState({
      temporaryVisible: v,
      billToPartyId,
    });
  };

  renderListItem = item => (
    <List.Item key={item.billToPartyId}>
      <Card
        hoverable
        title={item.billToPartyName}
        extra={
          <>
            <a
              onClick={() => {
                this.fixedQuota(true, item.billToPartyId);
              }}
            >
              {formatMessage({ id: 'bp.maintain_details.credit_management.credit_adjustment' })}
            </a>
            <Divider type="vertical" />
            <a
              onClick={() => {
                this.temporaryQuota(true, item.billToPartyId);
              }}
            >
              {formatMessage({ id: 'bp.maintain_details.credit_management.temporary_credit' })}
            </a>
          </>
        }
      >
        <span>
          <span style={{ color: '#3C88D4' }}>{item.creditLimit ? `${item.creditLimit} ` : ''}</span>
          {item.creditLimit ? `${item.currencyCode} ` : ''}
          {moment(item.lastEvaluationDate).fromNow()}
        </span>
        <br />
        <br />
        <span>
          <span style={{ color: '#3C88D4' }}>
            {item.tempCreditLimit ? `${item.tempCreditLimit} ` : ''}
          </span>
          {item.tempCreditLimit ? `${item.currencyCode} ` : ''}
          {moment(item.tempCreditLimitExpirationDate).fromNow()}
        </span>
        <br />
        <br />
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
    const { fixedVisible, temporaryVisible, billToPartyId } = this.state;
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
          visible={fixedVisible}
          fixedQuota={v => {
            this.fixedQuota(v);
          }}
          billToPartyId={billToPartyId}
        />
        <TemporaryQuota
          visible={temporaryVisible}
          temporaryQuota={v => {
            this.temporaryQuota(v);
          }}
          billToPartyId={billToPartyId}
        />
      </Card>
    );
  }
}

export default PersonCredit;

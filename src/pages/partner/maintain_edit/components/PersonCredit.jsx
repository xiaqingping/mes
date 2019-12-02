/**
 * 个人信贷数据
 */
import { Card, Divider, List } from 'antd';
import React from 'react';
import { connect } from 'dva';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

@connect(({ bpEdit }) => ({
  details: bpEdit.details || {},
  creditList: (bpEdit.details && bpEdit.details.creditList) || [],
}))
class PersonCredit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderListItem = item => (
    <List.Item key={item.billToPartyId}>
      <Card
        hoverable
        title={item.billToPartyName}
        extra={
          <>
            <a>
              <FormattedMessage id="bp.maintain_details.credit_management.credit_adjustment" />
            </a>
            <Divider type="vertical" />
            <a>
              <FormattedMessage id="bp.maintain_details.credit_management.temporary_credit" />
            </a>
          </>
        }
      >
        <span>
          {item.credit} {item.currencyCode} 1天后调整
        </span>
        <br />
        <span>
          {item.tempCreditLimit} {item.currencyCode} 25天后到期
        </span>
        <br />
        <span>开票后{item.billingCycle}天到期</span>
        <br />
        <span>每月{item.billingDay}日开票</span>
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
      </Card>
    );
  }
}

export default PersonCredit;

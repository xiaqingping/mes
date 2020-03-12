/**
 * 个人信贷数据
 */
import { Card, Divider, List, Empty } from 'antd';
import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import CreditAdjust from './CreditAdjust';
import styles from '../style.less';

@connect(({ bpEdit }) => {
  const { details } = bpEdit;
  const { creditList, piCertificationList } = details;

  // 未认证的开票方，不可以申请信用额度
  const list = piCertificationList
    .filter(e => e.status === 2 && !creditList.some(e1 => e1.billToPartyId === e.billToPartyId))
    .map(e => ({
      billToPartyId: e.billToPartyId,
      billToPartyCode: e.billToPartyCode,
      billToPartyName: e.billToPartyName,
    }));

  const newCreditList = [].concat(creditList, list);

  return {
    details,
    creditList: newCreditList,
    piCertificationList,
  };
})
class PICredit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bpId: undefined,
      creditAdjustVisible: false,
      creditAdjustType: undefined,
      creditAdjustItem: {},
    };
  }

  renderListItem = item => {
    const { creditList } = this.props;
    const credit = creditList.filter(e => e.billToPartyId === item.billToPartyId);
    let data = null;
    if (credit.length > 0) [data] = credit;

    // 临时额度到期日期
    let tempCreditLimitExpirationDate;
    if (data && data.tempCreditLimitExpirationDate) {
      tempCreditLimitExpirationDate = moment(data.tempCreditLimitExpirationDate).fromNow();
    }
    // 固定额度调整日期
    let lastEvaluationDate;
    if (data && data.lastEvaluationDate) {
      lastEvaluationDate = moment(data.lastEvaluationDate).fromNow();
    }

    return (
      <List.Item key={item.billToPartyId}>
        <Card
          hoverable
          title={item.billToPartyName}
          extra={
            <>
              <a onClick={() => this.showCreditAdjustModal(item, 1)}>
                <FormattedMessage id="bp.maintain_details.credit_management.credit_adjustment" />
              </a>
              <Divider type="vertical" />
              <a onClick={() => this.showCreditAdjustModal(item, 2)}>
                <FormattedMessage id="bp.maintain_details.credit_management.temporary_credit" />
              </a>
            </>
          }
        >
          {data.creditLimit || data.tempCreditLimit ? (
            <>
              <div className={styles['piCredit-item-line']}>
                {data.creditLimit ? (
                  <>
                    <span className={styles.number}>{data.creditLimit}</span>
                    <span className={styles.currency}>{data.currencyCode}</span>
                  </>
                ) : null}
                {lastEvaluationDate ? `${lastEvaluationDate}调整` : null}
              </div>
              {data.tempCreditLimit ? (
                <div className={styles['piCredit-item-line']}>
                  <>
                    <span className={styles.number}>{data.tempCreditLimit}</span>
                    <span className={styles.currency}>{data.currencyCode}</span>
                  </>
                  {`${tempCreditLimitExpirationDate}到期`}
                </div>
              ) : null}
              <div className={styles['piCredit-item-line']}>
                {data.creditPeriod ? `开票后${data.creditPeriod}天到期` : null}
              </div>
              <div>{data.billingDay ? `每月${data.billingDay}日开票` : null}</div>
            </>
          ) : (
            <Empty />
          )}
        </Card>
      </List.Item>
    );
  };

  // 显示调整额度界面
  showCreditAdjustModal = (item, type) => {
    const {
      details: { basic },
    } = this.props;
    this.setState({
      creditAdjustVisible: true,
      creditAdjustType: type,
      creditAdjustItem: item,
      bpId: basic.id,
    });
  };

  // 关闭调整额度界面
  handleCancel = () => {
    const { details, creditList } = this.props;

    if (this.CreditAdjustView.state.status === 2) {
      const { creditData } = this.CreditAdjustView.state;
      const target = this.CreditAdjustView.props.data.billToPartyId;

      const newCreditList = creditList.map(e => {
        if (e.billToPartyId === target) {
          const newCredit = {
            ...e,
            ...creditData,
          };

          // 固定额度设置最后调整时间
          if (this.CreditAdjustView.props.type === 1) {
            newCredit.lastEvaluationDate = new Date();
          }
          return newCredit;
        }
        return e;
      });

      const newDetails = { ...details, creditList: newCreditList };
      this.props.dispatch({
        type: 'bpEdit/setState',
        payload: {
          type: 'details',
          data: newDetails,
        },
      });
    }
    this.setState({
      creditAdjustVisible: false,
      creditAdjustItem: {},
    });
  };

  render() {
    const { piCertificationList } = this.props;
    const { creditAdjustVisible, creditAdjustItem, creditAdjustType, bpId } = this.state;

    // 未认证的开票方，不可以申请信用额度
    const list = piCertificationList.filter(e => e.status === 2);

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
          dataSource={list}
          renderItem={this.renderListItem}
        />
        {creditAdjustVisible ? (
          <CreditAdjust
            visible={creditAdjustVisible}
            onCancel={this.handleCancel}
            data={creditAdjustItem}
            type={creditAdjustType}
            bpId={bpId}
            // eslint-disable-next-line no-return-assign
            ref={ref => (this.CreditAdjustView = ref)}
          />
        ) : null}
      </Card>
    );
  }
}

export default PICredit;

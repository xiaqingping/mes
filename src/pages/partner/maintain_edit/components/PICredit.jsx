/**
 * 个人信贷数据
 */
import { Card, Divider, List, Empty, Modal, Button } from 'antd';
import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import CreditAdjust from './CreditAdjust';

@connect(({ bpEdit }) => {
  const { details } = bpEdit;
  const { creditList, piCertificationList } = details;
  return {
    details,
    creditList,
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
    if (data.tempCreditLimitExpirationDate) {
      tempCreditLimitExpirationDate = moment(data.tempCreditLimitExpirationDate).fromNow();
    }
    // 固定额度调整日期
    let lastEvaluationDate;
    if (data.lastEvaluationDate) {
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
          {data ? (
            <>
              <span>
                {data.creditLimit ? `${data.creditLimit} ${data.currencyCode} ` : null}
                {lastEvaluationDate ? `${lastEvaluationDate}调整` : null}
              </span>
              <br />
              <span>
                {data.tempCreditLimit ? `${data.tempCreditLimit} ${data.currencyCode} ` : null}
                {tempCreditLimitExpirationDate ? `${tempCreditLimitExpirationDate}到期` : null}
              </span>
              <br />
              <span>{data.creditPeriod ? `开票后${data.creditPeriod}天到期` : null}</span>
              <br />
              <span>{data.billingDay ? `每月${data.billingDay}日开票` : null}</span>
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
      creditAdjustFooter: true,
    });
  };

  // 提交额度申请
  handleOk = () => {
    this.setState({
      creditAdjustFooter: false,
    });
    this.CreditAdjustView.submit();
  };

  // 关闭调整额度界面
  handleCancel = () => {
    const { details } = this.props;
    const { creditList } = details;

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
    const {
      creditAdjustItem,
      creditAdjustType,
      bpId,
      creditAdjustFooter,
      creditAdjustVisible,
    } = this.state;

    // 未认证的开票方，不可以申请信用额度
    const list = piCertificationList.filter(e => e.status === 2);
    let footer = null;
    if (creditAdjustFooter) {
      footer = (
        <Button type="primary" onClick={this.handleOk}>
          提交
        </Button>
      );
    }

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
        <Modal
          title={creditAdjustType === 1 ? '固定额度调整' : '临时额度调整'}
          width={300}
          visible={creditAdjustVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={footer}
        >
          {creditAdjustVisible ? (
            <CreditAdjust
              destroyOnClose
              data={creditAdjustItem}
              type={creditAdjustType}
              bpId={bpId}
              // eslint-disable-next-line no-return-assign
              ref={ref => (this.CreditAdjustView = ref)}
            />
          ) : null}
        </Modal>
      </Card>
    );
  }
}

export default PICredit;

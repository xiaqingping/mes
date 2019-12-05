/**
 * 组织信贷数据
 */
import { Card, Descriptions, Divider, Empty, Modal, Button, message } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import CreditAdjust from './CreditAdjust';

const DescriptionsItem = Descriptions.Item;

@connect(({ bpEdit }) => ({
  details: bpEdit.details || {},
  creditList: (bpEdit.details && bpEdit.details.creditList) || [],
}))
class OrgCredit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bpId: undefined,
      creditAdjustVisible: false,
      creditAdjustType: undefined,
      creditAdjustItem: {},
    };
  }

  renderCredit = data => (
    <Descriptions className="s-descriptions" layout="vertical" column={4}>
      <DescriptionsItem
        label={formatMessage({ id: 'bp.maintain_details.credit_management.credit' })}
      >
        {data.credit} {data.currencyCode} 1天后调整
      </DescriptionsItem>
      <DescriptionsItem
        label={formatMessage({ id: 'bp.maintain_details.credit_management.temporary_credit' })}
      >
        {data.tempCreditLimit} {data.currencyCode} 25天后到期
      </DescriptionsItem>
      <DescriptionsItem
        label={formatMessage({ id: 'bp.maintain_details.credit_management.payment_period' })}
      >
        开票后{data.billingCycle}天到期
      </DescriptionsItem>
      <DescriptionsItem
        label={formatMessage({ id: 'bp.maintain_details.credit_management.invoiced_period' })}
      >
        每月{data.billingDay}日开票
      </DescriptionsItem>
    </Descriptions>
  );

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
    const { details } = this.props;
    const { basic } = details;
    if (basic.certificationStatus !== 4) {
      message.warning('该业务伙伴未认证，无法调整额度');
      return;
    }
    this.setState({
      creditAdjustFooter: false,
    });
    this.CreditAdjustView.submit();
  };

  // 关闭调整额度界面
  handleCancel = () => {
    const { details } = this.props;

    if (this.CreditAdjustView.state.status === 2) {
      const { creditData } = this.CreditAdjustView.state;
      let oldCredit = {
        billingCycle: 0,
        billingDay: 0,
        credit: 0,
        creditPeriod: 0,
        currencyCode: 'CNY',
        tempCreditLimit: 0,
      };
      if (details.creditList && details.creditList.length > 0) {
        [oldCredit] = details.creditList;
      }

      // billToPartyCode: null
      // billToPartyId: null
      // billToPartyName: null
      // billingCycle: 30
      // billingDay: 10
      // credit: 21000
      // creditPeriod: 1
      // currencyCode: "CNY"
      // lastEvaluationDate: "2019-12-05T14:32:35"
      // tempCreditLimit: 21000
      // tempCreditLimitExpirationDate: null

      const newCredit = {
        ...oldCredit,
        credit: creditData.creditLimit,
        creditPeriod: creditData.creditPeriod,
        currencyCode: creditData.currencyCode,
        billingCycle: creditData.billingCycle,
        billingDay: creditData.billingDay,
      };

      const newDetails = { ...details, creditList: [newCredit] };
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
    const { creditList } = this.props;
    const data = (creditList && creditList[0]) || {};
    const hasCredit = creditList && creditList.length > 0;
    const extra = (
      <>
        <a onClick={() => this.showCreditAdjustModal({}, 1)}>
          <FormattedMessage id="bp.maintain_details.credit_management.credit_adjustment" />
        </a>
        <Divider type="vertical" />
        <a onClick={() => this.showCreditAdjustModal({}, 2)}>
          <FormattedMessage id="bp.maintain_details.credit_management.temporary_credit" />
        </a>
      </>
    );

    const {
      creditAdjustItem,
      creditAdjustType,
      bpId,
      creditAdjustFooter,
      creditAdjustVisible,
    } = this.state;
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
        extra={extra}
      >
        {hasCredit ? this.renderCredit(data) : <Empty />}
        <Modal
          title="固定额度调整"
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

export default OrgCredit;

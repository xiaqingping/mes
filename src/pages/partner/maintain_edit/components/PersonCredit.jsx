/**
 * 个人信贷数据
 */
import { Card, Divider, List, Empty, Modal, Button } from 'antd';
import React from 'react';
import { connect } from 'dva';
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
class PersonCredit extends React.Component {
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
                {data.credit} {data.currencyCode} 1天后调整
              </span>
              <br />
              <span>
                {data.tempCreditLimit} {data.currencyCode} 25天后到期
              </span>
              <br />
              <span>开票后{data.billingCycle}天到期</span>
              <br />
              <span>每月{data.billingDay}日开票</span>
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

export default PersonCredit;

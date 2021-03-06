// 额度调整提交页面
import { Modal, Button, Icon } from 'antd';
import { connect } from 'dva';
import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import { formatter } from '@/utils/utils';
import api from '@/api';

@connect(({ partnerMaintainEdit }) => ({
  details: partnerMaintainEdit.details,
}))
class FixedQuota extends Component {
  state = {
    visible: false,
    status: 1,
    quotaData: [],
    billToPartyId: '',
  };

  componentDidMount() {
    this.props.onRef(this);
  }

  handleCancel = () => {
    setTimeout(
      this.setState({
        visible: false,
        status: 1,
      }),
      '1000',
    );
  };

  // 提交页面
  handleOk = () => {
    const { details } = this.props;
    const { billToPartyId } = this.state;
    // if (details.basic.type === 2) { // 判断是否为非个人
    const term = {
      id: details.basic.id,
      currencyCode: details.customer.salesAreaList[0].currencyCode,
      billToPartyId: details.basic.type === 2 ? '' : billToPartyId,
    };
    if (details.basic.type === 2) {
      term.billToPartyId = billToPartyId;
    }
    api.bp.creditLimitAdjustment(term).then(res => {
      this.setState({
        quotaData: res,
        status: 2,
      });
      if (details.basic.type === 2) {
        this.props.dispatch({
          type: 'partnerMaintainEdit/setDetails',
          payload: {
            ...details,
            creditList: [
              {
                billingCycle: res.billingCycle,
                billingDay: res.billingDay,
                creditLimit: res.creditLimit,
                creditPeriod: res.creditPeriod,
                currencyCode: res.currencyCode,
                lastEvaluationDate: res.lastEvaluationDate,
                tempCreditLimit:
                  details.creditList.length !== 0 ? details.creditList[0].tempCreditLimit : '',
                tempCreditLimitExpirationDate:
                  details.creditList.length !== 0
                    ? details.creditList[0].tempCreditLimitExpirationDate
                    : '',
              },
            ],
          },
        });
      } else {
        const data = details.creditList;
        const newData = [];
        data.forEach(item => {
          if (item.billToPartyId === billToPartyId) {
            newData.push({
              billToPartyId: item.billToPartyId,
              billToPartyCode: item.billToPartyCode,
              billToPartyName: item.billToPartyName,
              billingCycle: res.billingCycle,
              billingDay: res.billingDay,
              creditLimit: res.creditLimit,
              creditPeriod: res.creditPeriod,
              currencyCode: res.currencyCode,
              lastEvaluationDate: res.lastEvaluationDate,
              tempCreditLimit: item.tempCreditLimit,
              tempCreditLimitExpirationDate: item.tempCreditLimitExpirationDate,
            });
          } else {
            newData.push(item);
          }
        });
        this.props.dispatch({
          type: 'partnerMaintainEdit/setDetails',
          payload: {
            ...details,
            creditList: newData,
          },
        });
      }
    });
    // }
  };

  // 固定额度页面
  detailPage = () => {
    const { quotaData } = this.state;
    const { details } = this.props;
    return (
      <div style={{ marginLeft: '40px' }}>
        <p>{details.basic.name}</p>
        <p>
          <span style={{ color: '#4EA7E9' }}>{quotaData.creditLimit}</span>&nbsp;&nbsp;&nbsp;&nbsp;
          {quotaData.currencyCode}
        </p>
        {/* <p>每月{quotaData.billingDay}日开票</p> */}
        <p>
          {formatMessage(
            { id: 'bp.maintain_details.credit_management.invoiceIssued' },
            { name: quotaData.billingDay },
          )}
        </p>
        {/* <p>开票后{quotaData.creditPeriod}天到期</p> */}
        <p>
          {formatMessage(
            { id: 'bp.maintain_details.credit_management.dueDate' },
            { name: quotaData.creditPeriod },
          )}
        </p>
      </div>
    );
  };

  hangelPage = () => {
    const { quotaData } = this.state;
    return (
      <div style={{ textAlign: 'center' }}>
        <Icon
          type="check-circle"
          style={{
            fontSize: '30px',
            color: '#54C31F',
            marginBottom: '20px',
          }}
        />
        <p>
          {formatMessage({ id: 'bp.maintain_details.credit_management.yourCredit' })}
          <span style={{ color: '#4EA7E9' }}> {quotaData.creditLimit} </span>
          {quotaData.currencyCode}
          {formatMessage({ id: 'bp.maintain_details.credit_management.pleaseCheck' })}
        </p>
      </div>
    );
  };

  passData(visible, billToPartyId = '') {
    this.setState({
      visible,
      billToPartyId,
    });
    const { details } = this.props;
    if (visible) {
      // if (details.basic.type === 2) { // 判断是否为非个人
      //   api.bp.creditLimitAssessment(
      //     { id: details.basic.id, currencyCode: details.customer.salesAreaList[0].currencyCode },
      //     ).then(res => { this.setState({ quotaData: res }) })
      // } else {
      api.bp
        .creditLimitAssessment({
          id: details.basic.id,
          currencyCode:
            details.basic.type === 2
              ? details.customer.salesAreaList[0].currencyCode
              : formatter(details.creditList, billToPartyId, 'billToPartyId', 'currencyCode'),
          billToPartyId: details.basic.type === 2 ? '' : billToPartyId,
        })
        .then(res => {
          this.setState({ quotaData: res });
        });
      // }
    }
  }

  render() {
    const { status, visible } = this.state;
    return (
      <div>
        <Modal
          title={
            status === 1
              ? formatMessage({
                  id: 'bp.maintain_details.credit_management.creditAdjustment',
                })
              : ' '
          }
          visible={visible}
          className="quotaStyle"
          centered
          destroyOnClose
          width="300px"
          onCancel={this.handleCancel}
          footer={
            status === 1
              ? [
                  <Button key="submit" type="primary" onClick={this.handleOk}>
                    {formatMessage({ id: 'action.submit' })}
                  </Button>,
                ]
              : ''
          }
        >
          {/* status是1的时候是调整页面，2是调整完成页面 */}
          {status === 1 ? this.detailPage() : this.hangelPage()}
        </Modal>
      </div>
    );
  }
}

export default FixedQuota;

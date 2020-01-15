import { Modal, Button, Icon } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { formatter } from '@/utils/utils';
import api from '@/api';

@connect(({ partnerMaintainEdit }) => ({
  details: partnerMaintainEdit.details,
}))
class TemporaryQuota extends Component {
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
    this.setState({
      visible: false,
      status: 1,
    });
  };

  handleOk = () => {
    const { details } = this.props;
    const { creditList } = details;
    const { billToPartyId } = this.state;
    // if (details.basic.type === 2) { // 判断是否为非个人
    api.bp
      .tempCreditlimitAdjustment({
        id: details.basic.id,
        currencyCode: details.customer.salesAreaList[0].currencyCode,
        billToPartyId: details.basic.type === 2 ? '' : billToPartyId,
      })
      .then(res => {
        this.setState({
          quotaData: res,
          status: 2,
        });
        if (details.basic.type === 2) {
          const data = creditList[0];
          if (creditList.length !== 0) {
            data.tempCreditLimit = res.tempCreditLimit;
            data.currencyCode = res.currencyCode;
            data.tempCreditLimitExpirationDate =
              details.creditList[0].tempCreditLimitExpirationDate;
          }
          this.props.dispatch({
            type: 'partnerMaintainEdit/setDetails',
            payload: {
              ...details,
              creditList: [data],
            },
          });
        } else {
          const data = details.creditList;
          const newData = [];
          data.forEach(item => {
            if (item.billToPartyId === this.props.billToPartyId) {
              newData.push({
                billToPartyId: item.billToPartyId,
                billToPartyCode: item.billToPartyCode,
                billToPartyName: item.billToPartyName,
                billingCycle: item.billingCycle,
                billingDay: item.billingDay,
                creditLimit: item.creditLimit,
                creditPeriod: item.creditPeriod,
                currencyCode: res.currencyCode,
                lastEvaluationDate: item.lastEvaluationDate,
                tempCreditLimit: res.tempCreditLimit,
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
      <div style={{ marginLeft: '80px' }}>
        <p>{details.basic.name}</p>
        <p>
          <span style={{ color: '#4EA7E9' }}>{quotaData.tempCreditLimit}</span>
          &nbsp;&nbsp;&nbsp;&nbsp;
          {quotaData.currencyCode}
        </p>
      </div>
    );
  };

  // 临时额度页面
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
          {formatMessage({ id: 'bp.maintain_details.credit_management.yourTemporary' })}&nbsp;&nbsp;
          <span style={{ color: '#4EA7E9' }}> {quotaData.tempCreditLimit} </span>&nbsp;&nbsp;
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
      api.bp
        .tempCreditLimitAssessment({
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
                  id: 'bp.maintain_details.credit_management.temporaryCreditApp',
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
          {status === 1 ? this.detailPage() : this.hangelPage()}
        </Modal>
      </div>
    );
  }
}

export default TemporaryQuota;

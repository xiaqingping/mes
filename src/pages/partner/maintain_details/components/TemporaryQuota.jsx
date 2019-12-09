import {
  Modal,
  Button,
  Icon,
} from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import api from '@/api';

@connect(({ partnerMaintainEdit }) => ({
  details: partnerMaintainEdit.details,
}))
class TemporaryQuota extends Component {
  state = {
    visible: false,
    status: 1,
    quotaData: [],
  }

  componentWillReceiveProps(nextProps) {
    const { visible } = nextProps;
    this.setState({
      visible,
    })
    const { details } = this.props;
    // console.log(details)
    if (visible) {
      if (details.basic.type === 2) { // 判断是否为非个人
        api.bp.tempCreditLimitAssessment(
          { id: details.basic.id, currencyCode: details.customer.salesAreaList[0].currencyCode },
          ).then(res => { this.setState({ quotaData: res }) })
      }
    }
  }

  handleCancel = () => {
    this.setState({
      visible: false,
      status: 1,
    });
    this.props.temporaryQuota(false)
  };

  handleOk = () => {
    const { details } = this.props;
    if (details.basic.type === 2) { // 判断是否为非个人
      api.bp.creditLimitAdjustment(

        { id: details.basic.id, currencyCode: details.customer.salesAreaList[0].currencyCode },
        ).then(res => {
          this.setState({
            quotaData: res,
            status: 2,
          })
          // console.log(res)
        })
    }
  }

  // 固定额度页面
  detailPage = () => {
    const { quotaData } = this.state;
    const { details } = this.props;

    return (
      <div style={{ marginLeft: '80px' }}>
        <p>{ details.basic.name }</p>
        <p>
          <span style={{ color: '#4EA7E9' }}>
            { quotaData.tempCreditLimit }
          </span>&nbsp;&nbsp;&nbsp;&nbsp;
          { quotaData.currencyCode }
        </p>
      </div>
    )
}

  // 固定额度页面
  hangelPage = () => {
    const { quotaData } = this.state;
    return (
      <div style={{ textAlign: 'center' }}>
        <Icon type="check-circle" style={{
          fontSize: '30px',
          color: '#54C31F',
          marginBottom: '20px' }}/>
        <p>
        您申请的临时额度为&nbsp;&nbsp;
        <span style={{ color: '#4EA7E9' }}>{quotaData.creditLimit}</span>&nbsp;&nbsp;
        {quotaData.currencyCode} <br/>
          请注意查收！
        </p>
      </div>
    )
  }

  render() {
    const { status, visible } = this.state
    return (
      <div>
        <Modal
          title={ status === 1 ? '固定额度调整' : ' '}
          visible={visible}
          className="quotaStyle"
          centered
          destroyOnClose
          width="300px"
          onCancel={this.handleCancel}
          footer={ status === 1 ? [
            <Button key="submit" type="primary" onClick={this.handleOk}>
              提交
            </Button>,
          ] : ''}
        >
          { status === 1 ? this.detailPage() : this.hangelPage() }
        </Modal>
      </div>
    );
  }
}

export default TemporaryQuota;

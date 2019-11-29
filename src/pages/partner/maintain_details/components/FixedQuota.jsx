import {
  Modal,
  Button,
  Icon,
} from 'antd';
import { connect } from 'dva';
import React, { Component } from 'react';
import api from '@/api';

@connect(({ partnerMaintainEdit }) => ({
  details: partnerMaintainEdit.details,
}))
class FixedQuota extends Component {
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
        api.bp.creditLimitAssessment(
          details.basic.id,
          { currencyCode: details.customer.salesAreaList[0].currencyCode },
          ).then(res => { this.setState({ quotaData: res }) })
      }
    }
  }

  handleCancel = () => {
    setTimeout(this.setState({
      visible: false,
      status: 1,
    }), '1000');
    this.props.fixedQuota(false)
  };

  // 提交页面
  handleOk = () => {
    const { details } = this.props;
    if (details.basic.type === 2) { // 判断是否为非个人
      api.bp.creditLimitAdjustment(
        details.basic.id,
        { currencyCode: details.customer.salesAreaList[0].currencyCode },
        ).then(res => {
          // this.setState({
          //   quotaData: res,
          //   status: 2,
          // })
          console.log(res)
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
        <span style={{ color: '#4EA7E9' }}>{ quotaData.creditLimit}</span>&nbsp;&nbsp;&nbsp;&nbsp;
        { quotaData.currencyCode}
        </p>
        <p>每月{quotaData.billingDay}日开票</p>
        <p>开票后{quotaData.creditPeriod}天到期</p>
      </div>
    )
}

  hangelPage = () => (
      <div style={{ textAlign: 'center' }}>
        <Icon type="check-circle" style={{
          fontSize: '30px',
          color: '#54C31F',
          marginBottom: '20px' }}/>
        <p>
          您的固定额度已调整为&nbsp;&nbsp;<span style={{ color: '#4EA7E9' }}>20000</span>&nbsp;&nbsp;CNY <br/>
          请注意查收！
        </p>
      </div>
    )

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

export default FixedQuota;

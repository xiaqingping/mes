import {
  Modal,
  Button,
  Icon,
} from 'antd';
import { connect } from 'dva';
import React, { Component } from 'react';

@connect(({ partnerMaintainEdit }) => ({
  details: partnerMaintainEdit.details,
}))
class FixedQuota extends Component {
  state = {
    visible: false,
    status: 1,
  }

  componentWillReceiveProps(nextProps) {
    const { visible } = nextProps;
    this.setState({
      visible,
    })
  }

  handleCancel = () => {
    setTimeout(this.setState({
      visible: false,
      status: 1,
    }), '1000');
    this.props.fixedQuota(false)
  };

  handleOk = () => {
    this.setState({
      status: 2,
    });
  }

  // 固定额度页面
  detailPage = () => {
    const { details } = this.props;
    console.log(details)
    return (
      <div style={{ marginLeft: '80px' }}>
        <p>上海交通大学</p>
        <p>
          <span style={{ color: '#4EA7E9' }}>2000</span>&nbsp;&nbsp;&nbsp;&nbsp;
          CNY
        </p>
        <p>每月5日开票</p>
        <p>开票后65天到期</p>
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

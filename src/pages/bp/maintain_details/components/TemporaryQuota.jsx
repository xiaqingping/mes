import { Modal, Button, Icon } from 'antd';
import React, { Component } from 'react';

class TemporaryQuota extends Component {
  state = {
    visible: false,
    status: 1,
  };

  componentWillReceiveProps(nextProps) {
    const { visible } = nextProps;
    this.setState({
      visible,
    });
  }

  handleCancel = () => {
    this.setState({
      visible: false,
      status: 1,
    });
    this.props.temporaryQuota(false);
  };

  handleOk = () => {
    this.setState({
      status: 2,
    });
  };

  // 固定额度页面
  detailPage = () => (
    <div style={{ marginLeft: '80px' }}>
      <p>上海交通大学</p>
      <p>
        <span style={{ color: '#4EA7E9' }}>2000</span>&nbsp;&nbsp;&nbsp;&nbsp; CNY
      </p>
    </div>
  );

  // 固定额度页面
  hangelPage = () => (
    <div style={{ textAlign: 'center' }}>
      <Icon
        type="check-circle"
        style={{ fontSize: '30px', color: '#54C31F', marginBottom: '20px' }}
      />
      <p>
        您申请的临时额度为&nbsp;&nbsp;<span style={{ color: '#4EA7E9' }}>20000</span>&nbsp;&nbsp;CNY{' '}
        <br />
        请注意查收！
      </p>
    </div>
  );

  render() {
    const { status, visible } = this.state;
    return (
      <div>
        <Modal
          title={status === 1 ? '固定额度调整' : ' '}
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
                    提交
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

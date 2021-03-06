/**
 * 信用额度调整
 */
import { Spin, Modal, Button } from 'antd';
import React from 'react';
// import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import api from '@/api';

class CreditAdjust extends React.Component {
  constructor(props) {
    super(props);
    const { data = {} } = props;
    const piType = data.billToPartyId ? 1 : 2;

    this.state = {
      loading: false,
      // 1 人员 2 组织
      piType,
      // 1 评估界面 2 申请界面
      status: 1,
      // 申请后的信贷数据
      creditData: {},
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    const { type, data } = this.props;
    if (type === 1) {
      this.creditLimitAssessment(data);
    }
    if (type === 2) {
      this.tempCreditLimitAssessment(data);
    }
  }

  // 固定额度评估
  creditLimitAssessment = data => {
    const options = {
      currencyCode: 'CNY',
      id: this.props.bpId,
    };
    if (data.billToPartyId) options.billToPartyId = data.billToPartyId;

    api.bp.creditLimitAssessment(options).then(res => {
      this.setState({
        creditData: res,
        loading: false,
      });
    });
  };

  // 固定额度调整
  creditLimitAdjustment = data => {
    const options = {
      currencyCode: 'CNY',
      id: this.props.bpId,
    };

    if (data.billToPartyId) options.billToPartyId = data.billToPartyId;
    api.bp.creditLimitAdjustment(options).then(res => {
      this.setState({
        creditData: res,
        loading: false,
      });
    });
  };

  // 临时额度评估
  tempCreditLimitAssessment = data => {
    const options = {
      currencyCode: 'CNY',
      id: this.props.bpId,
    };
    if (data.billToPartyId) options.billToPartyId = data.billToPartyId;
    api.bp.tempCreditLimitAssessment(options).then(res => {
      this.setState({
        creditData: res,
        loading: false,
      });
    });
  };

  // 临时额度调整
  tempCreditlimitAdjustment = data => {
    const options = {
      currencyCode: 'CNY',
      id: this.props.bpId,
    };
    if (data.billToPartyId) options.billToPartyId = data.billToPartyId;
    api.bp.tempCreditlimitAdjustment(options).then(res => {
      this.setState({
        creditData: res,
        loading: false,
      });
    });
  };

  // 提交额度申请
  submit = () => {
    const { type, data } = this.props;
    this.setState({
      status: 2,
      loading: true,
    });
    // 固定额度
    if (type === 1) {
      this.creditLimitAdjustment(data);
    }
    // 临时额度
    if (type === 2) {
      this.tempCreditlimitAdjustment(data);
    }
  };

  // 评估界面
  renderAssessment = () => {
    const { piType, creditData } = this.state;
    const { type, data } = this.props;
    // 固定额度
    if (type === 1) {
      return (
        <div style={{ marginLeft: 60, fontSize: 14 }}>
          {piType === 1 ? <p>{data.billToPartyName}</p> : null}
          <p>
            <span style={{ fontSize: 16, color: '#1890ff', marginRight: 15 }}>
              {creditData.creditLimit}
            </span>
            {creditData.currencyCode}
          </p>
          <p>每月{creditData.billingDay}日开票</p>
          <p>开票后{creditData.creditPeriod}天到期</p>
        </div>
      );
    }
    // 临时额度
    if (type === 2) {
      return (
        <div style={{ marginLeft: 60, fontSize: 14 }}>
          {piType === 1 ? <p>{data.billToPartyName}</p> : null}
          <p>
            <span style={{ fontSize: 16, color: '#1890ff', marginRight: 15 }}>
              {creditData.tempCreditLimit}
            </span>
            {creditData.currencyCode}
          </p>
        </div>
      );
    }
    return null;
  };

  // 申请界面
  renderAdjustment = () => {
    const { type } = this.props;
    const { creditData } = this.state;
    // 固定额度
    if (type === 1) {
      return (
        <div style={{ margin: '0 10px', fontSize: 14, textAlign: 'center' }}>
          <img style={{ marginBottom: '1em' }} src="/images/icons/success.png" alt="success" />
          <p>
            您的固定额度已调整为 {creditData.creditLimit} {creditData.currencyCode}，<br />
            请注意查收！
          </p>
        </div>
      );
    }
    // 临时额度
    if (type === 2) {
      return (
        <div style={{ margin: '0 10px', fontSize: 14, textAlign: 'center' }}>
          <img style={{ marginBottom: '1em' }} src="/images/icons/success.png" alt="success" />
          <p>
            您申请的临时额度为 {creditData.tempCreditLimit} {creditData.currencyCode}，<br />
            请注意查收！
          </p>
        </div>
      );
    }
    return null;
  };

  renderContent = () => {
    const { status, loading } = this.state;
    if (loading) return <Spin />;
    if (status === 1) return this.renderAssessment();
    if (status === 2) return this.renderAdjustment();
    return null;
  };

  render() {
    const { type, visible, onCancel } = this.props;
    const { status } = this.state;
    let footer = null;
    if (status === 1) {
      footer = (
        <Button type="primary" onClick={this.submit}>
          提交
        </Button>
      );
    }

    return (
      <Modal
        title={type === 1 ? '固定额度调整' : '临时额度调整'}
        width={300}
        visible={visible}
        onOk={this.handleOk}
        onCancel={onCancel}
        footer={footer}
      >
        {this.renderContent()}
      </Modal>
    );
  }
}

export default CreditAdjust;

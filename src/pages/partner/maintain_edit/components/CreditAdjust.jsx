/**
 * 信用额度调整
 */
import { Spin } from 'antd';
import React from 'react';
// import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import bpAPI from '@/api/bp';

class CreditAdjust extends React.Component {
  constructor(props) {
    super(props);
    const { data = {} } = props;
    // 1 人员 2 组织
    const piType = data.billToPartyId ? 1 : 2;

    this.state = {
      loading: false,
      piType,
      status: 1, // 1 评估界面 2 申请界面
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

    bpAPI.creditLimitAssessment(options).then(res => {
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
    bpAPI.creditLimitAdjustment(options).then(res => {
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
    bpAPI.tempCreditLimitAssessment(options).then(res => {
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
    bpAPI.tempCreditlimitAdjustment(options).then(res => {
      this.setState({
        creditData: res,
        loading: false,
      });
    });
  };

  submit = () => {
    const { type, data } = this.props;
    this.setState({ status: 2, loading: true });
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
          <p>开票后{creditData.billingCycle}天到期</p>
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

  render() {
    const { status, loading } = this.state;
    if (loading) return <Spin />;
    if (status === 1) return this.renderAssessment();
    if (status === 2) return this.renderAdjustment();
    return null;
  }
}

export default CreditAdjust;

/**
 * 变更认证
 */
import React from 'react';
import ChangeOrgCertification from './ChangeOrgCertification';
import ChangePICertification from './ChangePICertification';

class ChangeCertification extends React.Component {
  constructor(props) {
    super(props);
    const { id, type, details } = props;
    this.state = {
      id,
      type,
      details,
    };
  }

  componentDidMount() {
    const { id, type, details } = this.state;
    if (!details) {
      if (id && type) {
        console.log('通过id和type获取数据');
        return;
      }
      console.log('缺少数据：[id、type] 或 [details] 最少传一组');
    }
  }

  renderContent = () => {
    const { details } = this.state;
    const { basic } = details;
    if (basic.type === 1) {
      return <ChangePICertification details={details} />;
    }
    if (basic.type === 2) {
      return <ChangeOrgCertification details={details} />;
    }
    return null;
  };

  render() {
    return this.renderContent();
  }
}

export default ChangeCertification;

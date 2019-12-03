/**
 * 变更认证
 */
import React from 'react';
import ChangeOrgCertification from './ChangeOrgCertification';
import ChangePICertification from './ChangePICertification';

class ChangeCertification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      details: {},
    };
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
    const renderContent = this.renderContent();
    return <renderContent />;
  }
}

export default ChangeCertification;

/**
 * 认证气泡框
 */
import React from 'react';
import { Badge, Spin } from 'antd';
import api from '@/api';

class CertificationPopover extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
  }

  componentDidMount() {
    const { id } = this.props;
    api.bp.getLastVerifyRecords(id).then(data => {
      this.setState({ data });
    });
  }

  render() {
    const { data } = this.state;
    if (!data) {
      return (
        <div style={{ width: 280, height: 145 }}>
          <Spin />
        </div>
      );
    }
    return (
      <div style={{ width: 280, height: 145, color: '#999' }}>
        <div>
          <strong style={{ color: '#444' }}>{data.organizationCertification.name}</strong>
        </div>
        <div style={{ marginTop: 10 }}>{data.code}</div>
        <div style={{ marginTop: 10 }}>
          {/* <span>{lastVerifyRecords.operatorName}</span>&nbsp; */}
          <Badge status="success" text="已验证" />
          &nbsp;
          <span>{data.operationDate}</span>
        </div>
        <div style={{ marginTop: 10 }}>
          <span>{data.approverName}</span>
          <span>{data.finishDate}</span>
        </div>
        <div style={{ textAlign: 'right', marginTop: 10 }}>
          <a>查看更多</a>
        </div>
      </div>
    );
  }
}

export default CertificationPopover;

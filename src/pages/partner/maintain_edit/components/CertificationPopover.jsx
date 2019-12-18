/**
 * 认证气泡框
 */
import React from 'react';
import { Badge, Spin, Empty } from 'antd';
import { connect } from 'dva';
import api from '@/api';

@connect(({ bp }) => ({
  VerifyRecordStatus: bp.VerifyRecordStatus,
}))
class CertificationPopover extends React.Component {
  constructor(props) {
    super(props);
    // props.id 业务伙伴ID
    // props.type 业务伙伴类型
    // props.billToPartyId 开票方ID（业务伙伴类型为人员时，需要传）
    this.state = {
      data: null,
      loading: true,
    };
  }

  componentDidMount() {
    const { id } = this.props;
    api.bp.getLastVerifyRecords(id).then(data => {
      this.setState({ data, loading: false });
    });
  }

  renderOrg = () => {
    const { VerifyRecordStatus } = this.props;
    const { data } = this.state;
    const status = VerifyRecordStatus.filter(e => data.status === e.value)[0];
    return (
      <>
        <div>
          <strong style={{ color: '#444' }}>{data.organizationCertification.name}</strong>
        </div>
        <div style={{ marginTop: 10 }}>{data.bpCode}</div>
        <div style={{ marginTop: 10 }}>
          <Badge status={status.status} text={status.text} />
          <span style={{ marginLeft: '1em' }}>{data.operationDate}</span>
        </div>
        <div style={{ marginTop: 10 }}>
          <span>{data.approverName}</span>
          <span>{data.finishDate}</span>
        </div>
      </>
    );
  };

  renderPi = () => {
    const { VerifyRecordStatus } = this.props;
    const { data } = this.state;
    const status = VerifyRecordStatus.filter(e => data.status === e.value)[0];
    return (
      <>
        <div>
          <strong style={{ color: '#444' }}>{data.organizationCertification.name}</strong>
        </div>
        <div style={{ marginTop: 10 }}>{data.bpCode}</div>
        <div style={{ marginTop: 10 }}>
          {/* <span>{lastVerifyRecords.operatorName}</span>&nbsp; */}
          <Badge status={status.status} text={status.text} />
          &nbsp;
          <span>{data.operationDate}</span>
        </div>
        <div style={{ marginTop: 10 }}>
          <span>{data.approverName}</span>
          <span>{data.finishDate}</span>
        </div>
      </>
    );
  };

  render() {
    const { type } = this.props;
    const { data, loading } = this.state;
    const style = { width: 280, height: 145, color: '#999' };

    if (loading) {
      return (
        <div style={style}>
          <Spin />
        </div>
      );
    }

    if (!data) {
      return (
        <div style={style}>
          <Empty description="暂无认证记录" />
        </div>
      );
    }

    return (
      <div style={style}>
        {type === 1 ? this.renderPi() : this.renderOrg()}
        <div style={{ textAlign: 'right', marginTop: 10 }}>
          <a>查看更多</a>
        </div>
      </div>
    );
  }
}

export default CertificationPopover;

/**
 * 认证气泡框
 */
import React from 'react';
import { Badge, Spin, Empty, Popover } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import api from '@/api';
import { formatMessage } from 'umi/locale';
import OrgChina from './OrgChina';
import OrgUsa from './OrgUsa';
import OrgGb from './OrgGb';
import PersonRecord from './PersonRecord';
import { formatter } from '@/utils/utils';

@connect(({ bp }) => ({
  VerifyRecordStatus: bp.VerifyRecordStatus,
}))
class CertificationPopover extends React.Component {
  constructor(props) {
    super(props);
    // props.basic 业务伙伴基础信息
    // props.billToPartyId 开票方ID（业务伙伴类型为人员时，需要传）
    this.state = {
      data: null,
      loading: true,
      more: false,
    };
  }

  componentDidMount() {
    const { basic, billToPartyId } = this.props;
    const { id } = basic;
    api.bp.getLastVerifyRecords(id, { billToPartyId }).then(data => {
      this.setState({ data, loading: false });
    });
  }

  showMore = () => {
    this.setState({ more: true });
  };

  renderPopover = () => {
    const { basic } = this.props;
    const { type } = basic;
    const { VerifyRecordStatus } = this.props;
    const { data, loading } = this.state;
    const style = { width: 300, height: 145, color: '#999' };
    if (type === 1) style.height = 115;

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
          <Empty
            description={formatMessage({
              id: 'bp.maintain_details.popover.noCertificationRecords',
            })}
          />
        </div>
      );
    }

    // const status = VerifyRecordStatus.filter(e => data.status === e.value)[0];

    return (
      <div style={style}>
        <div>
          <strong style={{ color: '#444' }}>
            {type === 1 ? data.piCertification.billToPartyName : null}
            {type === 2 ? data.organizationCertification.name : null}
          </strong>
        </div>
        {type === 2 ? (
          <div style={{ marginTop: 10 }}>{data.organizationCertification.taxNo}</div>
        ) : null}
        <div style={{ marginTop: 10 }}>
          <Badge
            status={formatter(VerifyRecordStatus, data.status, 'value', 'status')}
            text={formatMessage({
              id: formatter(VerifyRecordStatus, data.status, 'value', 'i18n'),
            })}
          />
          {/* 验证中 显示过期时间 */}
          {data.status === 1 ? (
            <span style={{ marginLeft: '1em' }}>{moment(data.expireDate).fromNow()}过期</span>
          ) : null}
          {/* 已验证 显示完成人和完成时间 */}
          {/* 已拒绝 显示拒绝人和拒绝时间 */}
          {data.status === 2 || data.status === 3 ? (
            <>
              <span style={{ marginLeft: '0.5em' }}>({data.finisherName})</span>
              <span style={{ marginLeft: '2em' }}>{data.finishDate}</span>
            </>
          ) : null}
        </div>
        <div style={{ marginTop: 10 }}>
          <span>{data.operatorName}</span>
          <span style={{ marginLeft: '1.5em' }}>{data.operationDate}</span>
        </div>
        <div style={{ textAlign: 'right', marginTop: 10 }}>
          <a onClick={this.showMore}>{formatMessage({ id: 'component.noticeIcon.view-more' })}</a>
        </div>
      </div>
    );
  };

  renderMore = () => {
    const { data } = this.state;
    if (!data.piCertification && !data.organizationCertification) return false;
    if (data.piCertification) return this.renderMorePi();
    if (data.organizationCertification.sapCountryCode === 'CN') return this.renderMoreOrgChina();
    if (data.organizationCertification.sapCountryCode === 'GB') return this.renderMoreOrgGB();
    return this.renderMoreOrg();
  };

  // 人员大气泡
  renderMorePi = () => {
    const { data } = this.state;
    return <PersonRecord data={data} />;
  };

  // 组织美国和其他国家大气泡
  renderMoreOrg = () => {
    const { data } = this.state;
    return <OrgUsa data={data} />;
  };

  // 组织国外大气泡
  renderMoreOrgGB = () => {
    const { data } = this.state;
    return <OrgGb data={data} />;
  };

  // 组织国内大气泡
  renderMoreOrgChina = () => {
    const { data } = this.state;
    return <OrgChina data={data} />;
  };

  render() {
    const { data, loading, more } = this.state;

    // 没有认证记录的不显示气泡框
    if (!loading && !data) {
      return this.props.children;
    }

    let content;
    content = this.renderPopover();
    if (more) {
      content = this.renderMore();
    }

    return (
      <Popover
        content={content}
        title={
          more
            ? formatMessage({
                id: 'bp.maintain_details.popover.certificationRecords',
              })
            : null
        }
        placement="topLeft"
      >
        {this.props.children}
      </Popover>
    );
  }
}

export default CertificationPopover;

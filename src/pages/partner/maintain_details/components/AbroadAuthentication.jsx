import { Row, Col, Card, Descriptions, Badge } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import './style.less';
import { formatMessage } from 'umi/locale';
import { formatter } from '@/utils/utils';
import ChangeModal from '@/pages/partner/maintain/components/ChangeModal';
import api from '@/api';
import CertificationPopover from '@/pages/partner/maintain_edit/components/CertificationPopover';

const DescriptionsItem = Descriptions.Item;

@connect(({ partnerMaintainEdit, bp }) => ({
  details:
    partnerMaintainEdit.type === 'supplier'
      ? partnerMaintainEdit.supplier
      : partnerMaintainEdit.details,
  BpCertificationStatus: bp.BpCertificationStatus,
}))
class BasicInfo extends Component {
  state = {
    pic: [],
  };

  componentDidMount() {
    const { details } = this.props;
    const newData = [];
    if (!details.organizationCertification) {
      this.setState({
        pic: [],
      });
    } else if (details.organizationCertification.attachmentCode) {
      api.disk
        .getFiles({
          sourceKey: 'bp_organization_certification',
          sourceCode: details.organizationCertification.attachmentCode,
        })
        .then(v => {
          v.forEach(item => {
            if (item.id) {
              newData.push(api.disk.downloadFiles(item.id, { view: true }));
            }
          });
          this.setState({
            pic: newData,
          });
        });
    }
  }

  /** 取消认证 */
  cancelIdent = (e, record) => {
    e.preventDefault();
    if (record.basic.type === 2) {
      api.bp.cancelBPOrgCertification(record.basic.id).then(() => {
        // eslint-disable-next-line no-restricted-globals
        location.reload(true);
      });
    }
  };

  certificationStatus = (v, details) => {
    if (parseInt(v, 10) === 4) {
      return (
        <>
          <CertificationPopover basic={details.basic}>
            <a
              onClick={() => {
                this.showChange.visibleShow(true, this.props.details.basic);
              }}
            >
              {formatMessage({ id: 'bp.maintain_details.change' })}
            </a>
          </CertificationPopover>
          &nbsp;&nbsp;
          <a
            onClick={e => {
              this.cancelIdent(e, details);
            }}
          >
            {formatMessage({ id: 'bp.maintain.cancelApproval' })}
          </a>
        </>
      );
    }
    if (parseInt(v, 10) === 1) {
      return (
        <>
          <CertificationPopover basic={details.basic}>
            <a
              onClick={() => {
                this.showChange.visibleShow(true, this.props.details.basic);
              }}
            >
              {formatMessage({ id: 'bp.maintain.approval' })}
            </a>
          </CertificationPopover>
        </>
      );
    }
    if (parseInt(v, 10) === 2) {
      return (
        <>
          <CertificationPopover basic={details.basic}>
            <a>{formatMessage({ id: 'menu.bp.maintain.details' })}</a>
          </CertificationPopover>
        </>
      );
    }
    return '';
  };

  render() {
    const { details, BpCertificationStatus } = this.props;
    const { pic } = this.state;
    return (
      <Card
        title={formatMessage({ id: 'bp.maintain_details.verification_data' })}
        bordered={false}
        style={{ marginBottom: '24px' }}
        className="check-tabs"
      >
        <Row gutter={16}>
          <Col span={5}>
            <Descriptions className="s-descriptions uploads" layout="vertical" column={1}>
              <DescriptionsItem
                label={formatMessage({ id: 'bp.maintain_details.verification_data.status' })}
              >
                <Badge
                  status={formatter(
                    BpCertificationStatus,
                    details.basic.certificationStatus,
                    'id',
                    'badge',
                  )}
                  text={formatMessage({
                    id: formatter(
                      BpCertificationStatus,
                      details.basic.certificationStatus,
                      'id',
                      'i18n',
                    ),
                  })}
                />
                &nbsp;&nbsp;&nbsp;&nbsp;
                {this.certificationStatus(details.basic.certificationStatus, details)}
              </DescriptionsItem>
              <DescriptionsItem
                label={
                  details.basic.countryCode === 'US'
                    ? formatMessage({ id: 'bp.verification.organizationVerification.taxExemptID' })
                    : formatMessage({ id: 'bp.verification.organizationVerification.vat' })
                }
              >
                {details.organizationCertification ? details.organizationCertification.taxNo : ''}
              </DescriptionsItem>
            </Descriptions>
          </Col>
          <Col span={6}>
            <Descriptions className="s-descriptions" layout="vertical" column={1}>
              <DescriptionsItem
                label={formatMessage({
                  id: 'bp.maintain_details.verification_data.verification_documents',
                })}
              >
                <ul style={{ padding: '0' }}>
                  {pic.length !== 0 ? (
                    <>
                      {pic.map((item, index) => (
                        <li
                          // eslint-disable-next-line react/no-array-index-key
                          key={index}
                          style={{
                            width: '100px',
                            height: '100px',
                            border: '1px solid #D9D9D9',
                            textAlign: 'center',
                            lineHeight: '94px',
                            borderRadius: '5px',
                            float: 'left',
                            marginRight: '10px',
                          }}
                        >
                          <img src={item} alt="" width="90" height="90" />
                        </li>
                      ))}
                    </>
                  ) : (
                    ''
                  )}
                </ul>
              </DescriptionsItem>
            </Descriptions>
          </Col>
          <Col span={10}>
            <Descriptions className="s-descriptions" layout="vertical" column={1}>
              <DescriptionsItem
                label={formatMessage({ id: 'bp.maintain_details.verification_data.memo' })}
              >
                {details.organizationCertification ? details.organizationCertification.notes : ''}
              </DescriptionsItem>
            </Descriptions>
          </Col>
        </Row>
        <ChangeModal
          onRef={ref => {
            this.showChange = ref;
          }}
          getData={() => {}}
        />
      </Card>
    );
  }
}

export default BasicInfo;

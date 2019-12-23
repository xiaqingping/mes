/* eslint-disable no-nested-ternary */
import { Row, Col, Card, Descriptions, Badge } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import './style.less';
import ChangeModal from '@/pages/partner/maintain/components/ChangeModal';
import { formatMessage } from 'umi/locale';
import ContactInformation from '@/pages/partner/maintain_edit/components/ContactInformation';
import { formatter } from '@/utils/utils';
import api from '@/api';
import CertificationPopover from '@/pages/partner/maintain_edit/components/CertificationPopover';

const DescriptionsItem = Descriptions.Item;

@connect(({ partnerMaintainEdit, bp }) => ({
  details:
    partnerMaintainEdit.type === 'supplier'
      ? partnerMaintainEdit.supplier
      : partnerMaintainEdit.details,
    BpCertificationStatus: bp.BpCertificationStatus,
    SpecialInvoice: bp.SpecialInvoice,
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

  // 根据状态来判断后面显示的内容
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
            href="#"
            onClick={e => {
              this.cancelIdent(e, details);
            }}
          >
            {formatMessage({ id: 'bp.maintain.cancelApproval' })}
          </a>
        </>
      )
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
              {formatMessage({ id: 'bp.maintain_details.verification_status' })}
            </a>
          </CertificationPopover>
        </>
      )
    }
    if (parseInt(v, 10) === 2) {
      return (
        <>
          <CertificationPopover basic={details.basic}>
            <a>
              {formatMessage({ id: 'menu.bp.maintain.details' })}
            </a>
          </CertificationPopover>
        </>
      )
    }
    return ''
  }

  render() {
    const { details, BpCertificationStatus, SpecialInvoice } = this.props;
    const { pic } = this.state;
    return (
      <Card
        title={formatMessage({ id: 'bp.maintain_details.verification_data' })}
        bordered={false}
        style={{ marginBottom: '24px' }}
        className="check-tabs"
      >
        <Row gutter={16}>
          <Col span={15}>
            <Descriptions className="s-descriptions uploads" layout="vertical" column={3}>
              <DescriptionsItem
              label={formatMessage({ id: 'bp.maintain_details.verification_data.status' })}
              >
              <Badge
                status={
                  formatter(BpCertificationStatus, details.basic.certificationStatus, 'id', 'badge')
                }
                text={
                  formatter(BpCertificationStatus, details.basic.certificationStatus, 'id', 'name')
                }
                />
                &nbsp;&nbsp;&nbsp;&nbsp;
                { this.certificationStatus(details.basic.certificationStatus, details)}
              </DescriptionsItem>
              <DescriptionsItem
              label={formatMessage({ id: 'bp.maintain_details.verification_data.special_invoice' })}
              >
                {/* {details.organizationCertification
                  ? details.organizationCertification.specialInvoice === 1
                    ? '是'
                    : '否'
                  : ''} */}
                  {details.organizationCertification ?
                  formatter(SpecialInvoice, details.organizationCertification.specialInvoice) : ''}
              </DescriptionsItem>
              <DescriptionsItem
              label={formatMessage({ id: 'bp.maintain_details.verification_data.VAT_Business' })}
              >
                {details.organizationCertification ? details.organizationCertification.taxNo : ''}
              </DescriptionsItem>
              <DescriptionsItem
              label={formatMessage({ id: 'bp.maintain_details.verification_data.bank_name' })}
              >
                {details.organizationCertification
                  ? details.organizationCertification.bankName
                  : ''}
              </DescriptionsItem>
              <DescriptionsItem
              label={formatMessage({ id: 'bp.maintain_details.verification_data.account_number' })}
              >
                {details.organizationCertification
                  ? details.organizationCertification.bankAccount
                  : ''}
              </DescriptionsItem>
              <DescriptionsItem label={formatMessage({ id: 'bp.maintain_details.phone' })}>
                <ContactInformation
                  data={{
                    areaCode: details.basic.telephoneAreaCode,
                    code: details.basic.telephone,
                    extension: details.basic.telephoneExtension,
                  }}
                />
              </DescriptionsItem>
              <DescriptionsItem
               span={3}
               label={formatMessage({ id: 'bp.maintain_details.verification_data.address' })}
               >
                {details.organizationCertification ? details.organizationCertification.address : ''}
              </DescriptionsItem>
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
          <Col span={9}>
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

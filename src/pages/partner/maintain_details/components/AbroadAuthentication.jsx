import {
  Row,
  Col,
  Card,
  Descriptions,
  Badge,
} from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import './style.less';
import { formatMessage } from 'umi/locale';
import { formatter } from '@/utils/utils';
import api from '@/api'

const DescriptionsItem = Descriptions.Item;

@connect(({ partnerMaintainEdit, bp }) => ({
  details: partnerMaintainEdit.type === 'supplier' ?
  partnerMaintainEdit.supplier : partnerMaintainEdit.details,
  BpCertificationStatus: bp.BpCertificationStatus,
}))
class BasicInfo extends Component {
  state = {
    pic: [],
  }

  componentDidMount() {
    const { details } = this.props;
    const newData = []
    if (!details.organizationCertification) {
      this.setState({
        pic: [],
      })
    } else if (details.organizationCertification.attachmentCode) {
      api.disk.getFiles({
        sourceKey: 'bp_organization_certification',
        sourceCode: details.organizationCertification.attachmentCode }).then(v => {
        v.forEach(item => {
          if (item.id) {
            newData.push(api.disk.downloadFiles(item.id, { view: true }))
          }
        })
        this.setState({
          pic: newData,
        })
      })
    }
  }

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
            <Descriptions
              className="s-descriptions uploads"
              layout="vertical"
              column={1}
            >
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
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                {parseInt(details.basic.certificationStatus, 10) === 4 ? <>
                  <a>
                    {formatMessage({ id: 'bp.maintain_details.change' })}
                  </a>&nbsp;&nbsp;
                  <a>
                    {formatMessage({ id: 'bp.maintain.cancelApproval' })}
                  </a></> : ''}
              </DescriptionsItem>
              <DescriptionsItem label={details.basic.countryCode === 'US' ?
              formatMessage({ id: 'bp.verification.organizationVerification.taxExemptID' }) :
              formatMessage({ id: 'bp.verification.organizationVerification.vat' })}>
              {details.organizationCertification ? details.organizationCertification.taxNo : ''}
              </DescriptionsItem>
            </Descriptions>
          </Col>
          <Col span={6}>
            <Descriptions
              className="s-descriptions"
              layout="vertical"
              column={1}
            >
              <DescriptionsItem
              label={formatMessage({
                id: 'bp.maintain_details.verification_data.verification_documents',
              })}
              >
              <ul style={{ padding: '0' }}>
                  {pic.length !== 0 ? <>
                    {pic.map((item, index) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <li key={index} style={{
                        width: '100px',
                        height: '100px',
                        border: '1px solid #D9D9D9',
                        textAlign: 'center',
                        lineHeight: '94px',
                        borderRadius: '5px',
                        float: 'left',
                        marginRight: '10px' }}>
                        <img src={item} alt="" width="90" height="90"/></li>
                    ))}
                  </> : ''
                  }

                </ul>
              </DescriptionsItem>
            </Descriptions>
          </Col>
          <Col span={10}>
            <Descriptions
              className="s-descriptions"
              layout="vertical"
              column={1}
            >
              <DescriptionsItem
              label={formatMessage({ id: 'bp.maintain_details.verification_data.memo' })}
              >
                {details.organizationCertification ? details.organizationCertification.notes : ''}
              </DescriptionsItem>
            </Descriptions>
          </Col>
        </Row>
      </Card>
    );
  }
}

export default BasicInfo;

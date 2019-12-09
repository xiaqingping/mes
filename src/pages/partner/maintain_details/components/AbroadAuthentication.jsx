import {
  Row,
  Col,
  Card,
  Descriptions,
  Badge,
  // Upload,
  // Icon,
  // Modal,
} from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import './style.less';
import api from '@/api'

const DescriptionsItem = Descriptions.Item;
// 认证
const renzhengMap = {
  1: {
    value: 'default',
    text: '未认证',
  },
 2: {
    value: 'processing',
    text: '审核中',
  },
  4: {
    value: 'success',
    text: '已认证',
  },
  3: {
    value: 'warning',
    text: '部分认证',
  },
};

@connect(({ partnerMaintainEdit }) => ({
  details: partnerMaintainEdit.type === 'supplier' ?
  partnerMaintainEdit.supplier : partnerMaintainEdit.details,
}))
class BasicInfo extends Component {
  state = {
    pic: [],
  }

  componentDidMount() {
    const { details } = this.props;
    const newData = []
    if (details.organizationCertification.attachmentCode) {
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
    const { details } = this.props;
    const { pic } = this.state;
    return (
      <Card title="认证资料" bordered={false} style={{ marginBottom: '24px' }} className="check-tabs">
        <Row gutter={16}>
          <Col span={5}>
            <Descriptions
              className="s-descriptions uploads"
              layout="vertical"
              column={1}
            >
              <DescriptionsItem label="认证状态">
                <Badge status={renzhengMap[details.basic.certificationStatus].value}
                text={renzhengMap[details.basic.certificationStatus].text} />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                {parseInt(details.basic.certificationStatus, 10) === 4 ? <>
                <a>变更</a>&nbsp;&nbsp;<a>取消认证</a></> : ''}
              </DescriptionsItem>
              <DescriptionsItem label={details.basic.countryCode === 'US' ?
              '免税认证号' : '增值税登记号'}>
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
              <DescriptionsItem label="认证图片">
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
              <DescriptionsItem label="认证说明">
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

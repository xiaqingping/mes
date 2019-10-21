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
import './style.less'

const DescriptionsItem = Descriptions.Item;

@connect(({ partnerMaintainEdit }) => ({
  details: partnerMaintainEdit.type === 'supplier' ? partnerMaintainEdit.supplier : partnerMaintainEdit.details,
}))
class BasicInfo extends Component {
  state = {
    // imageData: [
    //   { imageUrl: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    // ],
  };

  render() {
    const { details } = this.props;

    return (
      <Card title="认证资料" bordered={false} style={{ marginBottom: '24px' }} className="check-tabs">
        <Row gutter={16}>
          <Col span={5}>
            <Descriptions
              className="s-descriptions uploads"
              layout="vertical"
              column={1}
            >
              <DescriptionsItem label="认证状态">{ details.basic.certificationStatus === 1 ? <><Badge status="success"/><span>已认证</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a>变更</a>&nbsp;&nbsp;<a>取消认证</a></> : <><Badge status="error"/><span>未认证</span></>}</DescriptionsItem>
              <DescriptionsItem label={details.basic.telephoneCountryCode === 2 ? '免税认证号' : '增值税登记号'}>11111111111</DescriptionsItem>
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
                  {details.organizationCertification.attachmentList.map((item, index) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <li key={index} style={{ width: '100px', height: '100px', border: '1px solid #D9D9D9', textAlign: 'center', lineHeight: '94px', borderRadius: '5px', float: 'left', marginRight: '10px' }}>{item.type === 'image' ? <img src={item.code} alt="" width="90" height="90"/> : ''}</li>
                    ))}
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
              <DescriptionsItem label="认证说明">{details.organizationCertification.notes}</DescriptionsItem>
            </Descriptions>
          </Col>
        </Row>
      </Card>
    );
  }
}

export default BasicInfo;

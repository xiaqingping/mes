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
  details: partnerMaintainEdit.type === 'supplier' ? partnerMaintainEdit.supplier : partnerMaintainEdit.details,
}))
class BasicInfo extends Component {
  render() {
    const { details } = this.props;
    // details.organizationCertification = {
    //     specialInvoice: true,
    //     taxNo: 123,
    //     bankCode: 12345,
    //     bankAccount: '60045612378',
    //     address: '上海市松江区*****注册',
    //     notes: '这是一段认证说明',
    //     telephone: {
    //       telephoneCountryCode: '+86',
    //       telephoneAreaCode: '1234',
    //       telephone: '57072136',
    //       telephoneExtension: '2136',
    //     },
    //     attachmentList: [
    //       { code: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1571310110031&di=c5c3557d5172db919d831cca34586e4c&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20170718%2Fdc7a88ed8b5146368b068fc71c8c8533.jpeg', name: '照片', type: 'image' },
    //     ],
    //   }

    return (
      <Card title="认证资料" bordered={false} style={{ marginBottom: '24px' }} className="check-tabs">
        <Row gutter={16}>
          <Col span={15}>
            <Descriptions
              className="s-descriptions uploads"
              layout="vertical"
              column={3}
            >
              <DescriptionsItem label="认证状态">
                <Badge status={renzhengMap[details.basic.certificationStatus].value} text={renzhengMap[details.basic.certificationStatus].text} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{parseInt(details.basic.certificationStatus, 10) === 4 ? <><a>变更</a>&nbsp;&nbsp;<a>取消认证</a></> : ''}
              </DescriptionsItem>
              <DescriptionsItem label="增值税专用发票资质">
                {details.organizationCertification ? (details.organizationCertification.specialInvoice === 1 ? '是' : '') : ''}
              </DescriptionsItem>
              <DescriptionsItem label="统一社会信用代码">
                {details.organizationCertification ? details.organizationCertification.taxNo : ''}
              </DescriptionsItem>
              <DescriptionsItem label="基本户开户银行">
                {details.organizationCertification ? details.organizationCertification.bankCode : ''}
              </DescriptionsItem>
              <DescriptionsItem label="基本户开户账号">
                {details.organizationCertification ? details.organizationCertification.bankAccount : ''}
              </DescriptionsItem>
              <DescriptionsItem label="电话号码">
                {details.basic.telephoneCountryCode}{details.basic.telephoneAreaCode}{details.basic.telephone ? `-${details.basic.telephone}` : ''}{details.basic.telephoneExtension ? `-${details.basic.telephoneExtension}` : ''}
              </DescriptionsItem>
              <DescriptionsItem span={3} label="注册地址">
                {details.organizationCertification ? details.organizationCertification.address : ''}
              </DescriptionsItem>
              <DescriptionsItem label="认证图片">
                <ul style={{ padding: '0' }}>
                  {details.organizationCertification ? <>
                    {details.organizationCertification.attachmentList.map((item, index) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <li key={index} style={{ width: '100px', height: '100px', border: '1px solid #D9D9D9', textAlign: 'center', lineHeight: '94px', borderRadius: '5px', float: 'left', marginRight: '10px' }}>{item.type === 'image' ? <img src={item.code} alt="" width="90" height="90"/> : ''}</li>
                    ))}
                  </> : ''
                  }

                </ul>
              </DescriptionsItem>
            </Descriptions>
          </Col>
          <Col span={9}>
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

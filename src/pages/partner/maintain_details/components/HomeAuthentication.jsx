/* eslint-disable no-nested-ternary */
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
import ChangeModal from '@/pages/partner/maintain/components/ChangeModal';
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

    /** 取消认证 */
    cancelIdent = (e, record) => {
      e.preventDefault();
      if (record.basic.type === 2) {
        api.bp.cancelBPOrgCertification(record.basic.id).then(() => {
          // eslint-disable-next-line no-restricted-globals
          location.reload(true);
        })
      }
    };

  render() {
    const { details } = this.props;
    const { pic } = this.state;
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
                <Badge status={renzhengMap[details.basic.certificationStatus].value}
                text={renzhengMap[details.basic.certificationStatus].text} />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                {parseInt(details.basic.certificationStatus, 10) === 4 ? <>
                <a
                  onClick={
                    () => { this.showChange.visibleShow(true, this.props.details.basic) }
                  }
                >
                  变更
                </a>&nbsp;&nbsp;
                <a href="#" onClick={e => { this.cancelIdent(e, details) }}>取消认证</a></> : ''}
              </DescriptionsItem>
              <DescriptionsItem label="增值税专用发票资质">
                {details.organizationCertification ?
                (details.organizationCertification.specialInvoice === 1 ?
                '是' : '') : ''}
              </DescriptionsItem>
              <DescriptionsItem label="统一社会信用代码">
                {details.organizationCertification ? details.organizationCertification.taxNo : ''}
              </DescriptionsItem>
              <DescriptionsItem label="基本户开户银行">
                {details.organizationCertification ?
                details.organizationCertification.bankName : ''}
              </DescriptionsItem>
              <DescriptionsItem label="基本户开户账号">
                {details.organizationCertification ?
                details.organizationCertification.bankAccount : ''}
              </DescriptionsItem>
              <DescriptionsItem label="电话号码">
                {details.basic.telephoneAreaCode ? `+${details.basic.telephoneAreaCode} ` : ''}
                {details.basic.telephone ? `${details.basic.telephone}` : ''}
                {details.basic.telephoneExtension ? `-${details.basic.telephoneExtension}` : ''}
              </DescriptionsItem>
              <DescriptionsItem span={3} label="注册地址">
                {details.organizationCertification ? details.organizationCertification.address : ''}
              </DescriptionsItem>
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
        <ChangeModal
          onRef={ ref => { this.showChange = ref }}
          getData={() => {}}
        />
      </Card>
    );
  }
}

export default BasicInfo;

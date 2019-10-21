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

// function getBase64(file) {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result);
//     reader.onerror = error => reject(error);
//   });
// }

@connect(({ partnerMaintainEdit }) => ({
  details: partnerMaintainEdit.type === 'supplier' ? partnerMaintainEdit.supplier : partnerMaintainEdit.details,
}))
class BasicInfo extends Component {
  state = {
    // fileList: [],
    // previewVisible: false,
    // previewImage: '',
    // imageData: [
    //   { imageUrl: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    //   { imageUrl: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    //   { imageUrl: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    // ],
  };

  // handleCancel = () => this.setState({ previewVisible: false });

  // handlePreview = async file => {
  //   if (!file.url && !file.preview) {
  //     // eslint-disable-next-line no-param-reassign
  //     file.preview = await getBase64(file.originFileObj);
  //   }

  //   this.setState({
  //     previewImage: file.url || file.preview,
  //     previewVisible: true,
  //   });
  // };

  // handleChange = ({ fileList }) => this.setState({ fileList });

  render() {
    // const { fileList, previewVisible, previewImage } = this.state;
      const { details } = this.props;
    // const uploadButton = (
    //   <div>
    //     <Icon type="plus" />
    //     <div className="ant-upload-text">Upload</div>
    //   </div>
    // );
    return (
      <Card title="认证资料" bordered={false} style={{ marginBottom: '24px' }} className="check-tabs">
        <Row gutter={16}>
          <Col span={15}>
            <Descriptions
              className="s-descriptions uploads"
              layout="vertical"
              column={3}
            >
              <DescriptionsItem label="认证状态">{ details.basic.certificationStatus === 1 ? <><Badge status="success"/><span>已认证</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a>变更</a>&nbsp;&nbsp;<a>取消认证</a></> : <><Badge status="error"/><span>未认证</span></>}</DescriptionsItem>
              <DescriptionsItem label="增值税专用发票资质">{details.organizationCertification.specialInvoice === 1 ? '是' : ''}</DescriptionsItem>
              <DescriptionsItem label="统一社会信用代码">{details.organizationCertification.taxNo}</DescriptionsItem>
              <DescriptionsItem label="基本户开户银行">{details.organizationCertification.bankCode}</DescriptionsItem>
              <DescriptionsItem label="基本户开户账号">{details.organizationCertification.bankAccount}</DescriptionsItem>
              <DescriptionsItem label="电话号码">{details.basic.telephoneCountryCode}-{details.basic.telephoneAreaCode}-{details.basic.telephone}-{details.basic.telephoneExtension}</DescriptionsItem>
              <DescriptionsItem span={3} label="注册地址">{details.organizationCertification.address}</DescriptionsItem>
              <DescriptionsItem label="认证图片">
                {/* <div className="clearfix">
                  <Upload
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                  >
                    {fileList.length >= 8 ? null : uploadButton}
                  </Upload>
                  <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                  </Modal>
                </div> */}
                <ul style={{ padding: '0' }}>
                  {details.organizationCertification.attachmentList.map((item, index) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <li key={index} style={{ width: '100px', height: '100px', border: '1px solid #D9D9D9', textAlign: 'center', lineHeight: '94px', borderRadius: '5px', float: 'left', marginRight: '10px' }}>{item.type === 'image' ? <img src={item.code} alt="" width="90" height="90"/> : ''}</li>
                    ))}
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
              <DescriptionsItem label="认证说明">{details.organizationCertification.notes}</DescriptionsItem>
            </Descriptions>
          </Col>
        </Row>
      </Card>
    );
  }
}

export default BasicInfo;

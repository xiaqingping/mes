import {
  Row,
  Col,
  Card,
  Descriptions,
  Badge,
  Upload,
  Icon,
  Modal,
} from 'antd';
import React, { Component } from 'react';
import './style.less'

const DescriptionsItem = Descriptions.Item;

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class BasicInfo extends Component {
  state = {
    fileList: [],
    previewVisible: false,
    previewImage: '',
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      // eslint-disable-next-line no-param-reassign
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  handleChange = ({ fileList }) => this.setState({ fileList });

  render() {
    const { fileList, previewVisible, previewImage } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <Card title="认证资料" bordered={false} style={{ marginBottom: '24px' }} className="check-tabs">
        <Row gutter={16}>
          <Col span={15}>
            <Descriptions
              className="s-descriptions uploads"
              layout="vertical"
              column={3}
            >
              <DescriptionsItem label="认证状态"><Badge status="success"/>已认证&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a>变更</a>&nbsp;&nbsp;<a>取消认证</a></DescriptionsItem>
              <DescriptionsItem label="增值税专用发票资质">是</DescriptionsItem>
              <DescriptionsItem label="统一社会信用代码">11111111111</DescriptionsItem>
              <DescriptionsItem label="基本户开户银行">工商银行</DescriptionsItem>
              <DescriptionsItem label="基本户开户账号">基本户开户账号</DescriptionsItem>
              <DescriptionsItem label="电话号码">+86-0358-57072136-1234</DescriptionsItem>
              <DescriptionsItem span={3} label="注册地址">上海市松江区香闵路698号</DescriptionsItem>
              <DescriptionsItem label="认证图片">
              <div className="clearfix">
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
              </div>
              </DescriptionsItem>
            </Descriptions>
          </Col>
          <Col span={9}>
            <Descriptions
              className="s-descriptions"
              layout="vertical"
              column={1}
            >
              <DescriptionsItem label="认证说明">说明说明说明说明说明说明说明说明说明说明说明说明说明说明</DescriptionsItem>
            </Descriptions>
          </Col>
        </Row>
      </Card>
    );
  }
}

export default BasicInfo;

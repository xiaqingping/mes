import {
  Card,
  Row,
  Col,
  Form,
  Input,
  Switch,
  Upload,
  Icon,
  Badge,
} from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import { TelphoneInput } from '@/components/CustomizedFormControls';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ partnerMaintainEdit }) => ({
  details: partnerMaintainEdit.details,
}))
class OrgCertification extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    const normFile = e => {
      if (Array.isArray(e)) {
        return e;
      }
      return e && e.fileList;
    };

    return (
      <Card
        title="认证资料"
        bordered={false}
        style={{ marginBottom: '24px' }}
      >
        <Form>
          <Row gutter={32}>
            <Col xxl={15} lg={24}>
              <Row gutter={32}>
                <Col span={8}>
                  <FormItem label="认证状态">
                    <Badge status="success" />已认证
                    <a style={{ marginLeft: '1em' }}>取消认证</a>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="增值税专用发票资质">
                    {getFieldDecorator('specialInvoice', { valuePropName: 'checked' })(<Switch />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="统一社会信用代码">
                    {getFieldDecorator('taxNo')(<Input />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="基本户开户银行">
                    {getFieldDecorator('bankCode')(<Input />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="基本户开户账号">
                    {getFieldDecorator('bankAccount')(<Input />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="电话">
                    {getFieldDecorator('telephone')(<TelphoneInput />)}
                  </FormItem>
                </Col>
                <Col span={24}>
                  <FormItem label="注册地址">
                    {getFieldDecorator('address')(<Input />)}
                  </FormItem>
                </Col>
              </Row>
            </Col>
            <Col xxl={9} lg={24}>
              <FormItem label="认证说明">
                {getFieldDecorator('notes')(<TextArea rows={11} />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormItem label="认证图片">
                {getFieldDecorator('attachmentList', {
                  rules: [{ required: true }],
                  valuePropName: 'attachmentList',
                  getValueFromEvent: normFile,
                })(<Upload
                  name="file"
                  listType="picture-card"
                  showUploadList
                  action="/upload"
                  accept=".jpg,.png"
                >
                  {uploadButton}
                </Upload>)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }
}

export default Form.create()(OrgCertification);

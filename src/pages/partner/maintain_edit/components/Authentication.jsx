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
import { TelphoneInput } from '@/components/CustomizedFormControls';

const FormItem = Form.Item;
const { TextArea } = Input;

// eslint-disable-next-line react/prefer-stateless-function
class BasicInfo extends Component {
  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Card title="认证资料" bordered={false} style={{ marginBottom: '24px' }}>
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
                    {getFieldDecorator('zizhi', { valuePropName: 'checked' })(<Switch />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="统一社会信用代码">
                    {getFieldDecorator('code')(<Input />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="基本户开户银行">
                    {getFieldDecorator('bank')(<Input />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="基本户开户账号">
                    {getFieldDecorator('account')(<Input />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="基本户开户名">
                    {getFieldDecorator('name')(<Input />)}
                  </FormItem>
                </Col>
                <Col span={16}>
                  <FormItem label="注册地址">
                    {getFieldDecorator('address')(<Input />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="电话">
                    {getFieldDecorator('tel')(<TelphoneInput />)}
                  </FormItem>
                </Col>
              </Row>
            </Col>
            <Col xxl={9} lg={24}>
              <FormItem label="认证说明">
                {getFieldDecorator('explain')(<TextArea rows={11} />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormItem label="认证图片">
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                >
                  <div>
                    <Icon type="plus" />
                    <div className="ant-upload-text">Upload</div>
                  </div>
                </Upload>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }
}

export default Form.create()(BasicInfo);

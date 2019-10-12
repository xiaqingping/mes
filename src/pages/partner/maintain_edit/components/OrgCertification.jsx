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

  valueChange = (key, value) => {
    const { details } = this.props;
    const { organizationCertification } = details;
    if (key === 'attachmentList') {
      value = value.fileList.map(e => ({
        code: 'https://blog.maxmeng.top/images/avatar.jpg',
        name: e.name,
        type: e.type,
      }));
    }
    const data = { ...organizationCertification, ...{ [key]: value } };

    this.props.dispatch({
      type: 'partnerMaintainEdit/setDetails',
      payload: { ...details, ...{ organizationCertification: data } },
    });
  }

  render() {
    const {
      form: { getFieldDecorator },
      details: { organizationCertification: orgData },
    } = this.props;

    const fileList = orgData.attachmentList.map(e => ({
      uid: e.code,
      name: e.name,
      url: e.code,
    }));

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
                    {getFieldDecorator('specialInvoice', {
                      valuePropName: 'checked',
                      initialValue: orgData.specialInvoice,
                    })(<Switch onChange={value => this.valueChange('specialInvoice', value)} />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="统一社会信用代码">
                    {getFieldDecorator('taxNo', {
                      initialValue: orgData.taxNo,
                    })(<Input onChange={e => this.valueChange('taxNo', e.target.value)} />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="基本户开户银行">
                    {getFieldDecorator('bankCode', {
                      initialValue: orgData.bankCode,
                    })(<Input onChange={e => this.valueChange('bankCode', e.target.value)} />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="基本户开户账号">
                    {getFieldDecorator('bankAccount', {
                      initialValue: orgData.bankAccount,
                    })(<Input onChange={e => this.valueChange('bankAccount', e.target.value)} />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="电话">
                    {getFieldDecorator('telephone', {
                      initialValue: orgData.telephone,
                    })(<TelphoneInput onChange={value => this.valueChange('telephone', value)} />)}
                  </FormItem>
                </Col>
                <Col span={24}>
                  <FormItem label="注册地址">
                    {getFieldDecorator('address', {
                      initialValue: orgData.address,
                    })(<Input onChange={e => this.valueChange('address', e.target.value)} />)}
                  </FormItem>
                </Col>
              </Row>
            </Col>
            <Col xxl={9} lg={24}>
              <FormItem label="认证说明">
                {getFieldDecorator('notes', {
                  initialValue: orgData.notes,
                })(<TextArea rows={11} onChange={e => this.valueChange('notes', e.target.value)} />)}
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
                  fileList={fileList}
                  onChange={value => this.valueChange('attachmentList', value)}
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

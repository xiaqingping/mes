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

@connect(({ bpEdit }) => ({
  details: bpEdit.details || {},
  organizationCertification: (
    bpEdit.details && bpEdit.details.organizationCertification
  ) || { attachmentList: [] },
}))
class OrgCertification extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  valueChange = (key, value) => {
    const { details, organizationCertification } = this.props;
    if (key === 'attachmentList') {
      value = value.fileList.map(e => ({
        code: 'https://blog.maxmeng.top/images/avatar.jpg',
        name: e.name,
        type: e.type,
      }));
    }

    let obj = {
      [key]: value,
    }

    if (key === 'telephone') obj = value;

    const data = { ...organizationCertification, ...obj };

    this.props.dispatch({
      type: 'bpEdit/setDetails',
      payload: { ...details, ...{ organizationCertification: data } },
    });
  }

  uploadButton = () => (
    <div>
      <Icon type="plus" />
      <div className="ant-upload-text">Upload</div>
    </div>
  )

  normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }

  renderChina = () => {
    const {
      form: { getFieldDecorator },
      organizationCertification: orgData,
    } = this.props;

    const fileList = orgData.attachmentList && orgData.attachmentList.map(e => ({
      uid: e.code,
      name: e.name,
      url: e.code,
    }));

    return (
      <Form>
        <Row gutter={32}>
          <Col xxl={15} lg={24}>
            <Row gutter={32}>
              <Col span={8}>
                <FormItem label="认证状态">
                  <Badge status="default" />未认证
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
                    initialValue: {
                      telephoneCountryCode: orgData.telephoneCountryCode,
                      telephoneAreaCode: orgData.telephoneAreaCode,
                      telephone: orgData.telephone,
                      telephoneExtension: orgData.telephoneExtension,
                    },
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
                getValueFromEvent: this.normFile,
              })(<Upload
                name="file"
                listType="picture-card"
                showUploadList
                action="/upload"
                accept=".jpg,.png"
                fileList={fileList}
                onChange={value => this.valueChange('attachmentList', value)}
              >
                {this.uploadButton()}
              </Upload>)}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  renderOther = () => {
    const {
      form: { getFieldDecorator },
      organizationCertification: orgData,
    } = this.props;

    const fileList = orgData.attachmentList && orgData.attachmentList.map(e => ({
      uid: e.code,
      name: e.name,
      url: e.code,
    }));

    return (
      <Form>
        <Row gutter={64}>
          <Col span={6}>
            <Row>
              <Col span={24}>
                <FormItem label="认证状态">
                  <Badge status="default" />未认证
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem label="增值税登记号">
                  {getFieldDecorator('taxNo', {
                    initialValue: orgData.taxNo,
                  })(<Input onChange={e => this.valueChange('taxNo', e.target.value)} />)}
                </FormItem>
              </Col>
            </Row>
          </Col>
          <Col span={6}>
            <FormItem label="认证图片">
              {getFieldDecorator('attachmentList', {
                rules: [{ required: true }],
                valuePropName: 'attachmentList',
                getValueFromEvent: this.normFile,
              })(<Upload
                name="file"
                listType="picture-card"
                showUploadList
                action="/upload"
                accept=".jpg,.png"
                fileList={fileList}
                onChange={value => this.valueChange('attachmentList', value)}
              >
                {this.uploadButton()}
              </Upload>)}
            </FormItem>
          </Col>
          <Col span={10}>
            <FormItem label="认证说明">
              {getFieldDecorator('notes', {
                initialValue: orgData.notes,
              })(<TextArea rows={6} onChange={e => this.valueChange('notes', e.target.value)} />)}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm = () => {
    const { details: { basic } } = this.props;
    const { countryCode } = basic;
    let form;
    switch (countryCode) {
      case 'china':
        form = this.renderChina;
        break;
      case 'USA':
        form = this.renderOther;
        break;
      default:
        form = this.renderChina;
        break;
    }
    return form();
  }

  render() {
    return (
      <Card
        title="认证资料"
        bordered={false}
        style={{ marginBottom: '24px' }}
      >
        {this.renderForm()}
      </Card>
    );
  }
}

export default Form.create()(OrgCertification);

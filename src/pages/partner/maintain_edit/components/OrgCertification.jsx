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
  Select,
  Spin,
} from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import { TelphoneInput } from '@/components/CustomizedFormControls';
import disk from '@/api/disk';
import basicAPI from '@/api/basic';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@connect(({ bpEdit, user }) => ({
  details: bpEdit.details || {},
  uuid: bpEdit.uuid,
  authorization: user.currentUser.authorization,
  organizationCertification: (
    bpEdit.details && bpEdit.details.organizationCertification
  ) || { attachmentList: [] },
}))
class OrgCertification extends Component {
  constructor(props) {
    super(props);
    const uploadUrl = disk.uploadMoreFiles('bp_organization_certification', this.props.uuid);

    this.state = {
      uploadUrl,
      bank: [],
      bankFetching: false,
    };
  }

  valueChange = (key, value) => {
    const { details, organizationCertification } = this.props;
    if (key === 'attachmentList') {
      if (value.file.response) {
        value = value.fileList.map(e => {
          console.log(e.response);
          return {
            code: (e.response && e.response[0]) || '',
            name: e.name,
            type: e.type,
          };
        });
      }
    }

    let obj = {
      [key]: value,
    }

    if (key === 'telephone') obj = value;

    const data = { ...organizationCertification, ...obj };

    this.props.dispatch({
      type: 'bpEdit/setState',
      payload: {
        type: 'details',
        data: { ...details, ...{ organizationCertification: data } },
      },
    });
  }

  uploadButton = () => (
    <div>
      <Icon type="plus" />
      <div className="ant-upload-text">Upload <br/>支持jpg/png</div>
    </div>
  )

  normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }

  fetchBank = value => {
    basicAPI.getBanks({
      codeOrFullName: value,
    }).then(bank => {
      this.setState({ bank });
    });
  }

  renderChina = () => {
    const {
      form: { getFieldDecorator },
      organizationCertification: orgData,
      authorization,
    } = this.props;
    const { uploadUrl, bank, bankFetching } = this.state;

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
                    rules: [{ required: true }],
                  })(<Input onChange={e => this.valueChange('taxNo', e.target.value)} />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="基本户开户银行">
                  {getFieldDecorator('bankCode', {
                    initialValue: orgData.bankCode,
                    rules: [{ required: true }],
                  })(
                    <Select
                      showSearch
                      notFoundContent={bankFetching ? <Spin size="small" /> : null}
                      filterOption={false}
                      onSearch={this.fetchBank}
                      onChange={value => this.valueChange('bankCode', value)}
                    >
                      {bank.map(d => (
                        <Option key={d.code} value={d.code}>{d.fullName}</Option>
                      ))}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="基本户开户账号">
                  {getFieldDecorator('bankAccount', {
                    initialValue: orgData.bankAccount,
                    rules: [{ required: true }],
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
                    rules: [{ required: true }],
                  })(<TelphoneInput onChange={value => this.valueChange('telephone', value)} />)}
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem label="注册地址">
                  {getFieldDecorator('address', {
                    initialValue: orgData.address,
                    rules: [{ required: true }],
                  })(<Input onChange={e => this.valueChange('address', e.target.value)} />)}
                </FormItem>
              </Col>
            </Row>
          </Col>
          <Col xxl={9} lg={24}>
            <FormItem label="认证说明">
              {getFieldDecorator('notes', {
                initialValue: orgData.notes,
                rules: [{ required: true }],
              })(<TextArea rows={11} onChange={e => this.valueChange('notes', e.target.value)} />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem label="认证图片">
              {getFieldDecorator('attachmentList', {
                rules: [{ required: true }],
                valuePropName: 'fileList',
                getValueFromEvent: this.normFile,
              })(<Upload
                name="files"
                multiple
                listType="picture-card"
                showUploadList
                action={uploadUrl}
                accept=".jpg,.png"
                headers={{ Authorization: authorization }}
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
      case 'CN':
        form = this.renderChina;
        break;
      case 'US':
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

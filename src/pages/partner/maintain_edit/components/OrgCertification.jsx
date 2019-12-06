/**
 * 组织认证编辑
 */
import { Card, Row, Col, Form, Input, Switch, Upload, Icon, Badge, Select, Spin } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import debounce from 'lodash/debounce';
import { TelphoneInput } from '@/components/CustomizedFormControls';
import bpAPI from '@/api/bp';
import diskAPI from '@/api/disk';
import basicAPI from '@/api/basic';
import { requestErr } from '@/utils/request';
import { guid } from '@/utils/utils';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@connect(
  ({ bpEdit, user }) => {
    const details = bpEdit.details || {};
    const { basic } = details;
    const organizationCertification = details.organizationCertification || { attachmentList: [] };
    return {
      details,
      basic,
      organizationCertification,
      authorization: user.currentUser.authorization,
    };
  },
  null,
  null,
  { withRef: true },
)
class OrgCertification extends Component {
  constructor(props) {
    super(props);
    const { details, organizationCertification } = this.props;

    let uuid;
    if (organizationCertification.uuid) {
      // eslint-disable-next-line prefer-destructuring
      uuid = organizationCertification.uuid;
    } else {
      uuid = guid();
      organizationCertification.uuid = uuid;
      this.props.dispatch({
        type: 'bpEdit/setState',
        payload: {
          type: 'details',
          data: { ...details, ...{ organizationCertification } },
        },
      });
    }

    const uploadUrl = diskAPI.uploadMoreFiles('bp_organization_certification', uuid);

    this.state = {
      uploadUrl,
      bank: [],
      bankFetching: false,
    };
    // 防抖
    this.fetchBank = debounce(this.fetchBank, 800);
    this.checkTelephone = debounce(this.checkTelephone, 800);
    this.checkTaxNo = debounce(this.checkTaxNo, 800);
  }

  fetchBank = value => {
    if (!value) {
      this.setState({ bank: [] });
      return;
    }
    basicAPI
      .getBanks({
        codeOrFullName: value,
      })
      .then(bank => {
        this.setState({ bank });
      });
  };

  checkTelephone = (rule, value, callback) => {
    if (!value.telephone) {
      callback('电话必须');
      return;
    }
    callback();
  };

  checkTaxNo = (rule, value, callback) => {
    if (!value) {
      callback('税号必须');
      return;
    }

    bpAPI
      .checkBPFields({ taxNo: value })
      .then(res => {
        if (!res) {
          callback();
        } else {
          callback('税号重复');
        }
      })
      .catch(() => callback('接口验证失败'));
  };

  valueChange = (key, value) => {
    const { details, basic, organizationCertification, form } = this.props;

    let obj = {
      [key]: value,
    };

    // 设置 增值税专用发票资质默认值
    const formData = form.getFieldsValue();
    if (
      Object.keys(organizationCertification).indexOf('specialInvoice') === -1 &&
      Object.keys(formData).indexOf('specialInvoice') !== -1
    ) {
      if (formData.specialInvoice) organizationCertification.specialInvoice = 1;
      if (!formData.specialInvoice) organizationCertification.specialInvoice = 2;
    }

    if (key === 'attachmentList') {
      if (value.file.status === 'removed') {
        diskAPI.deleteFiles(value.file.response[0]);
      }
      if (value.file.response) {
        obj[key] = value.fileList.map(e => {
          if (e.status === 'error') requestErr(e.response);
          return {
            id: (e.response && e.response[0]) || '',
            name: e.name,
          };
        });
      }
    }

    if (key === 'telephone') obj = value;

    if (key === 'specialInvoice') {
      if (value) obj[key] = 1;
      if (!value) obj[key] = 2;
    }

    const newOrgCertification = { ...organizationCertification, ...obj };
    let newDetails = { ...details, ...{ organizationCertification: newOrgCertification } };

    // 修改电话时，同步修改基础信息的电话
    if (key === 'telephone') {
      newDetails = { ...newDetails, ...{ basic: { ...basic, ...obj } } };
    }

    this.props.dispatch({
      type: 'bpEdit/setState',
      payload: {
        type: 'details',
        data: newDetails,
      },
    });
  };

  uploadButton = () => (
    <div>
      <Icon type="plus" />
      <div className="ant-upload-text">
        Upload <br />
        支持jpg/png
      </div>
    </div>
  );

  normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

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
                <FormItem
                  label={formatMessage({ id: 'bp.maintain_details.verification_data.status' })}
                >
                  <Badge status="default" text="未认证" />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label={formatMessage({
                    id: 'bp.maintain_details.verification_data.special_invoice',
                  })}
                >
                  {getFieldDecorator('specialInvoice', {
                    valuePropName: 'checked',
                    initialValue: orgData.specialInvoice === 1,
                  })(<Switch onChange={value => this.valueChange('specialInvoice', value)} />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label={formatMessage({
                    id: 'bp.maintain_details.verification_data.VAT_Business',
                  })}
                >
                  {getFieldDecorator('taxNo', {
                    initialValue: orgData.taxNo,
                    rules: [{ validator: this.checkTaxNo }],
                  })(<Input onChange={e => this.valueChange('taxNo', e.target.value)} />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label={formatMessage({ id: 'bp.maintain_details.verification_data.bank_name' })}
                >
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
                        <Option key={d.code} value={d.code}>
                          {d.fullName}
                        </Option>
                      ))}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label={formatMessage({
                    id: 'bp.maintain_details.verification_data.account_number',
                  })}
                >
                  {getFieldDecorator('bankAccount', {
                    initialValue: orgData.bankAccount,
                    rules: [{ required: true }],
                  })(<Input onChange={e => this.valueChange('bankAccount', e.target.value)} />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label={formatMessage({ id: 'bp.maintain_details.phone' })}>
                  {getFieldDecorator('telephone', {
                    initialValue: {
                      telephoneCountryCode: orgData.telephoneCountryCode,
                      telephoneAreaCode: orgData.telephoneAreaCode,
                      telephone: orgData.telephone,
                      telephoneExtension: orgData.telephoneExtension,
                    },
                    rules: [{ validator: this.checkTelephone }],
                  })(<TelphoneInput onChange={value => this.valueChange('telephone', value)} />)}
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem
                  label={formatMessage({ id: 'bp.maintain_details.verification_data.address' })}
                >
                  {getFieldDecorator('address', {
                    initialValue: orgData.address,
                    rules: [{ required: true }],
                  })(<Input onChange={e => this.valueChange('address', e.target.value)} />)}
                </FormItem>
              </Col>
            </Row>
          </Col>
          <Col xxl={9} lg={24}>
            <FormItem label={formatMessage({ id: 'bp.maintain_details.verification_data.memo' })}>
              {getFieldDecorator('notes', {
                initialValue: orgData.notes,
                rules: [{ required: true }],
              })(<TextArea rows={11} onChange={e => this.valueChange('notes', e.target.value)} />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem
              label={formatMessage({
                id: 'bp.maintain_details.verification_data.verification_documents',
              })}
            >
              {getFieldDecorator('attachmentList', {
                rules: [{ required: true }],
                valuePropName: 'fileList',
                getValueFromEvent: this.normFile,
              })(
                <Upload
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
                </Upload>,
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  };

  renderOther = sapCountryCode => {
    const {
      form: { getFieldDecorator },
      organizationCertification: orgData,
      authorization,
    } = this.props;
    const { uploadUrl } = this.state;

    return (
      <Form>
        <Row gutter={64}>
          <Col span={6}>
            <Row>
              <Col span={24}>
                <FormItem
                  label={formatMessage({ id: 'bp.maintain_details.verification_data.status' })}
                >
                  <Badge status="default" />
                  未认证
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem label={sapCountryCode === 'US' ? '免税认证号' : '增值税登记号'}>
                  {getFieldDecorator('taxNo', {
                    initialValue: orgData.taxNo,
                    rules: [{ validator: this.checkTaxNo }],
                  })(<Input onChange={e => this.valueChange('taxNo', e.target.value)} />)}
                </FormItem>
              </Col>
            </Row>
          </Col>
          <Col span={6}>
            <FormItem
              label={formatMessage({
                id: 'bp.maintain_details.verification_data.verification_documents',
              })}
            >
              {getFieldDecorator('attachmentList', {
                rules: [{ required: true }],
                valuePropName: 'fileList',
                getValueFromEvent: this.normFile,
              })(
                <Upload
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
                </Upload>,
              )}
            </FormItem>
          </Col>
          <Col span={10}>
            <FormItem label={formatMessage({ id: 'bp.maintain_details.verification_data.memo' })}>
              {getFieldDecorator('notes', {
                initialValue: orgData.notes,
              })(<TextArea rows={6} onChange={e => this.valueChange('notes', e.target.value)} />)}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  };

  renderForm = () => {
    const {
      details: { basic },
    } = this.props;
    const { sapCountryCode } = basic;
    let form;

    if (!sapCountryCode) form = this.renderChina();
    if (sapCountryCode) form = this.renderOther(sapCountryCode); // 非中国，默认显示英国
    if (sapCountryCode === 'CN') form = this.renderChina();
    if (sapCountryCode === 'US') form = this.renderOther(sapCountryCode);
    if (sapCountryCode === 'GB') form = this.renderChina(sapCountryCode);
    return form;
  };

  render() {
    return (
      <Card title="认证资料" bordered={false} style={{ marginBottom: '24px' }}>
        {this.renderForm()}
      </Card>
    );
  }
}

export default Form.create()(OrgCertification);

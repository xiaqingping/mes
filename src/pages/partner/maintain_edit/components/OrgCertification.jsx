/**
 * 组织认证编辑
 */
import { Card, Row, Col, Form, Input, Switch, Upload, Badge, Select, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import debounce from 'lodash/debounce';
import { TelphoneInput } from '@/components/CustomizedFormControls';
import api from '@/api';
import { requestErr } from '@/utils/request';
import { guid } from '@/utils/utils';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@connect(
  ({ user, bpCache, bpEdit }) => {
    const details = bpEdit.details || {};
    const { basic } = details;
    const organizationCertification = details.organizationCertification || { attachmentList: [] };

    // 行业类别和默认税号
    const { industryCategoryAll } = bpCache;

    return {
      details,
      basic,
      organizationCertification,
      authorization: user.currentUser.authorization,
      industryCategoryAll,
    };
  },
  null,
  null,
  { forwardRef: true },
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

    const uploadUrl = api.disk.uploadMoreFiles('bp_organization_certification', uuid);

    this.state = {
      uploadUrl,
      bank: [],
      bankFetching: false,
    };
    this.formRef = React.createRef();
    // 防抖
    this.fetchBank = debounce(this.fetchBank, 800);
    // this.checkTelephone = debounce(this.checkTelephone, 800);
    // this.checkTaxNo = debounce(this.checkTaxNo, 800);
  }

  fetchBank = value => {
    if (!value) {
      this.setState({ bank: [] });
      return;
    }
    const { sapCountryCode } = this.props.basic;
    api.basic
      .getBanks({
        codeOrFullName: value,
        countryCode: sapCountryCode,
      })
      .then(bank => {
        this.setState({ bank });
      });
  };

  checkTelephone = (rule, value) => {
    if (!value.telephone) {
      return Promise.reject(new Error('电话必填'));
    }
    return Promise.resolve();
  };

  checkTaxNo = async (rule, value) => {
    if (!value) {
      return Promise.reject(new Error('税号必填'));
    }

    // 默认税号不进行后台接口检查
    const taxNoReadonly = this.props.industryCategoryAll.some(
      e => e.taxNo === value && e.repeatTaxNo === 1,
    );
    if (taxNoReadonly) {
      return Promise.resolve();
    }

    try {
      const res = await api.bp.checkBPFields({ taxNo: value });
      if (res) {
        return Promise.reject(new Error('税号重复'));
      }
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(new Error('接口验证失败'));
    }
  };

  valueChange = async (key, value) => {
    const { details, basic, organizationCertification } = this.props;

    let obj = {
      [key]: value,
    };

    // 设置 增值税专用发票资质默认值
    const formData = await this.formRef.current.getFieldsValue();
    if (
      Object.keys(organizationCertification).indexOf('specialInvoice') === -1 &&
      Object.keys(formData).indexOf('specialInvoice') !== -1
    ) {
      if (formData.specialInvoice) organizationCertification.specialInvoice = 1;
      if (!formData.specialInvoice) organizationCertification.specialInvoice = 2;
    }

    if (key === 'attachmentList') {
      if (value.file.status === 'removed') {
        api.disk.deleteFiles(value.file.response[0]);
      }
      if (value.file.response) {
        value.fileList.forEach(e => {
          if (e.status === 'error') requestErr(e.response);
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
      <PlusOutlined />
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
      basic,
      organizationCertification: orgData,
      authorization,
      industryCategoryAll,
    } = this.props;
    const { uploadUrl, bank, bankFetching } = this.state;

    if (!orgData.attachmentList) {
      orgData.attachmentList = [];
    } else if (orgData.attachmentList.fileList) {
      orgData.attachmentList = orgData.attachmentList.fileList;
    }

    // 税号是否默认且不可修改
    const taxNoReadonly = industryCategoryAll.some(
      e => e.taxNo === orgData.taxNo && e.repeatTaxNo === 1,
    );

    return (
      <>
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
                  name="specialInvoice"
                  label={formatMessage({
                    id: 'bp.maintain_details.verification_data.special_invoice',
                  })}
                  valuePropName="checked"
                >
                  <Switch onChange={value => this.valueChange('specialInvoice', value)} />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  name="taxNo"
                  label={formatMessage({
                    id: 'bp.maintain_details.verification_data.VAT_Business',
                  })}
                  rules={[{ validator: this.checkTaxNo }]}
                >
                  <Input
                    readOnly={taxNoReadonly}
                    onChange={e => this.valueChange('taxNo', e.target.value)}
                  />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  name="bankCode"
                  label={formatMessage({ id: 'bp.maintain_details.verification_data.bank_name' })}
                  rules={[{ required: true }]}
                >
                  <Select
                    showSearch
                    disabled={!basic.countryCode}
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
                  </Select>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  name="bankAccount"
                  label={formatMessage({
                    id: 'bp.maintain_details.verification_data.account_number',
                  })}
                  rules={[{ required: true }]}
                >
                  <Input onChange={e => this.valueChange('bankAccount', e.target.value)} />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  name="telephone"
                  label={formatMessage({ id: 'bp.maintain_details.phone' })}
                  rules={[{ validator: this.checkTelephone }]}
                >
                  <TelphoneInput
                    readOnly
                    onChange={value => this.valueChange('telephone', value)}
                  />
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem
                  name="address"
                  label={formatMessage({ id: 'bp.maintain_details.verification_data.address' })}
                  rules={[{ required: true }]}
                >
                  <Input onChange={e => this.valueChange('address', e.target.value)} />
                </FormItem>
              </Col>
            </Row>
          </Col>
          <Col xxl={9} lg={24}>
            <FormItem
              name="notes"
              label={formatMessage({ id: 'bp.maintain_details.verification_data.memo' })}
              rules={[{ required: true }]}
            >
              <TextArea rows={11} onChange={e => this.valueChange('notes', e.target.value)} />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem
              name="attachmentList"
              label={formatMessage({
                id: 'bp.maintain_details.verification_data.verification_documents',
              })}
              rules={[{ required: true }]}
              valuePropName="fileList"
              getValueFromEvent={this.normFile}
            >
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
              </Upload>
            </FormItem>
          </Col>
        </Row>
      </>
    );
  };

  renderOther = sapCountryCode => {
    const { organizationCertification: orgData, authorization } = this.props;
    const { uploadUrl } = this.state;

    if (!orgData.attachmentList) {
      orgData.attachmentList = [];
    } else if (orgData.attachmentList.fileList) {
      orgData.attachmentList = orgData.attachmentList.fileList;
    }

    return (
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
              <FormItem
                name="taxNo"
                label={sapCountryCode === 'US' ? '免税认证号' : '增值税登记号'}
                rules={[{ validator: this.checkTaxNo }]}
              >
                <Input onChange={e => this.valueChange('taxNo', e.target.value)} />
              </FormItem>
            </Col>
          </Row>
        </Col>
        <Col span={6}>
          <FormItem
            name="attachmentList"
            label={formatMessage({
              id: 'bp.maintain_details.verification_data.verification_documents',
            })}
            rules={[{ required: true }]}
            valuePropName="fileList"
            getValueFromEvent={this.normFile}
          >
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
            </Upload>
          </FormItem>
        </Col>
        <Col span={10}>
          <FormItem
            name="notes"
            label={formatMessage({ id: 'bp.maintain_details.verification_data.memo' })}
          >
            <TextArea rows={6} onChange={e => this.valueChange('notes', e.target.value)} />
          </FormItem>
        </Col>
      </Row>
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
    const { organizationCertification: orgData } = this.props;
    return (
      <Card title="认证资料" bordered={false} style={{ marginBottom: '24px' }}>
        <Form
          layout="vertical"
          hideRequiredMark
          ref={this.formRef}
          initialValues={{
            specialInvoice: orgData.specialInvoice === 1,
            taxNo: orgData.taxNo,
            bankCode: orgData.bankCode,
            bankAccount: orgData.bankAccount,
            telephone: {
              telephoneCountryCode: orgData.telephoneCountryCode,
              telephoneAreaCode: orgData.telephoneAreaCode,
              telephone: orgData.telephone,
              telephoneExtension: orgData.telephoneExtension,
            },
            address: orgData.address,
            notes: orgData.notes,
            attachmentList: orgData.attachmentList,
          }}
        >
          {this.renderForm()}
        </Form>
      </Card>
    );
  }
}

export default OrgCertification;

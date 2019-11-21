import {
  Form,
  Input,
  Modal,
  Upload,
  Icon,
} from 'antd';
import React from 'react';
import { connect } from 'dva';
import disk from '@/api/disk';
import ChooseInvoiceParty from '@/components/choosse/bp/InvoiceParty';
import { requestErr } from '@/utils/request';

const FormItem = Form.Item;
const { Search } = Input;

@connect(({ bpEdit, user }) => ({
  details: bpEdit.details || {},
  uuid: bpEdit.uuid,
  authorization: user.currentUser.authorization,
}))
class PersonCertificationAddModal extends React.Component {
  constructor(props) {
    super(props);
    const uploadUrl = disk.uploadMoreFiles('bp_organization_certification', this.props.uuid);

    this.state = {
      uploadUrl,
      invoiceParty: {},
    };
  }

  okHandle = () => {
    const { form } = this.props;
    const { invoiceParty } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      this.props.handleAdd({ ...fieldsValue, ...invoiceParty });
    });
  };

  uploadButton = () => (
    <div>
      <Icon type="plus" />
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  selectChooseModalData = data => {
    this.props.form.setFieldsValue({
      invoicePartyName: data.name,
    });
    this.setState({
      invoiceParty: {
        invoicePartyName: data.name,
        invoicePartyCode: data.code,
        invoicePartyId: data.id,
      },
    });
  }

  valueChange = (key, value) => {
    if (key === 'attachmentList') {
      if (value.file.response) {
        value.fileList.forEach(e => {
          if (e.status === 'error') requestErr(e.response);
        });
      }
    }
  }

  searchInvoiceParty = () => {
    this.ChooseInvoiceParty.wrappedInstance.changeVisible(true)
  }

  render() {
    const { modalVisible, form, handleModalVisible, authorization } = this.props;
    const { uploadUrl } = this.state;

    return (
      <Modal
        destroyOnClose
        title="PI认证"
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
      >
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="收票方"
        >
          {form.getFieldDecorator('invoicePartyName', {
            rules: [{ required: true }],
          })(<Search readOnly onSearch={this.searchInvoiceParty} />)}
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="认证说明"
        >
          {form.getFieldDecorator('notes', {
            rules: [{ required: true }],
          })(<Input.TextArea />)}
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="认证图片"
        >
          {form.getFieldDecorator('attachmentList', {
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
        <ChooseInvoiceParty
          ref={ref => { this.ChooseInvoiceParty = ref }}
          selectChooseModalData={this.selectChooseModalData}
        />
      </Modal>
    );
  }
}

export default Form.create()(PersonCertificationAddModal);

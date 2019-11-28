import { Form, Input, Modal, Upload, Icon } from 'antd';
import React from 'react';

const FormItem = Form.Item;

const PersonCertificationAddModal = props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
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
    <Modal
      destroyOnClose
      title="PI认证"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem
        labelCol={{
          span: 5,
        }}
        wrapperCol={{
          span: 15,
        }}
        label="收票方"
      >
        {form.getFieldDecorator('invoicePartyName', {
          rules: [{ required: true }],
        })(<Input />)}
      </FormItem>
      <FormItem
        labelCol={{
          span: 5,
        }}
        wrapperCol={{
          span: 15,
        }}
        label="认证说明"
      >
        {form.getFieldDecorator('notes', {
          rules: [{ required: true }],
        })(<Input.TextArea />)}
      </FormItem>
      <FormItem
        labelCol={{
          span: 5,
        }}
        wrapperCol={{
          span: 15,
        }}
        label="认证附件"
      >
        {form.getFieldDecorator('attachmentList', {
          rules: [{ required: true }],
          valuePropName: 'attachmentList',
          getValueFromEvent: normFile,
        })(
          <Upload
            name="file"
            listType="picture-card"
            showUploadList
            action="/upload"
            accept=".jpg,.png"
          >
            {uploadButton}
          </Upload>,
        )}
      </FormItem>
    </Modal>
  );
};

export default Form.create()(PersonCertificationAddModal);

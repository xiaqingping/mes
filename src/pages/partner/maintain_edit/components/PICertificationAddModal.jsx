import { Form, Input, Upload, Icon } from 'antd';
import React from 'react';
import { connect } from 'dva';
import disk from '@/api/disk';
import ChooseInvoiceParty from '@/components/choosse/bp/InvoiceParty';
import { requestErr } from '@/utils/request';
import { guid } from '@/utils/utils';

const FormItem = Form.Item;
const { Search } = Input;

@Form.create()
@connect(
  ({ bpEdit, user }) => ({
    details: bpEdit.details || {},
    authorization: user.currentUser.authorization,
  }),
  null,
  null,
  { withRef: true },
)
class PICertificationAddModal extends React.Component {
  constructor(props) {
    console.log('((((((((((((((');
    console.log(props);
    super(props);
    this.state = {
      invoiceParty: props.data || {},
      uuid: props.uuid || guid(),
    };
  }

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
  };

  valueChange = (key, value) => {
    if (key === 'attachmentList') {
      if (value.file.response) {
        value.fileList.forEach(e => {
          if (e.status === 'error') requestErr(e.response);
        });
      }
    }
  };

  searchInvoiceParty = () => {
    this.ChooseInvoiceParty.wrappedInstance.changeVisible(true);
  };

  render() {
    console.log(123);
    const { form, authorization } = this.props;
    const { uuid, invoiceParty } = this.state;
    const uploadUrl = disk.uploadMoreFiles('bp_organization_certification', uuid);

    return (
      <>
        <Form>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="收票方">
            {form.getFieldDecorator('invoicePartyName', {
              initialValue: invoiceParty.invoicePartyName,
              rules: [{ required: true }],
            })(<Search readOnly onSearch={this.searchInvoiceParty} />)}
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="认证说明">
            {form.getFieldDecorator('notes', {
              initialValue: invoiceParty.notes,
              rules: [{ required: true }],
            })(<Input.TextArea />)}
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="认证图片">
            {form.getFieldDecorator('attachmentList', {
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
        </Form>
        <ChooseInvoiceParty
          ref={ref => {
            this.ChooseInvoiceParty = ref;
          }}
          selectChooseModalData={this.selectChooseModalData}
        />
      </>
    );
  }
}

export default PICertificationAddModal;

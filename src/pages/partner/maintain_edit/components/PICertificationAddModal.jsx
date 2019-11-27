/**
 * PI认证 新增模态框
 */
import { Form, Input, Upload, Icon } from 'antd';
import React from 'react';
import { connect } from 'dva';
import disk from '@/api/disk';
import ChooseBillToParty from '@/components/choosse/bp/BillToParty';
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
    super(props);
    this.state = {
      billToParty: props.data || {},
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
      billToPartyName: data.name,
    });
    this.setState({
      billToParty: {
        billToPartyName: data.name,
        billToPartyCode: data.code,
        billToPartyId: data.id,
      },
    });
  };

  valueChange = (key, value) => {
    const { billToParty } = this.state;
    if (key === 'attachmentList') {
      const attachmentList = [];
      if (value.file.response) {
        value.fileList.forEach(e => {
          if (e.status === 'error') requestErr(e.response);
          if (e.old) {
            attachmentList.push({
              code: e.uid,
              name: e.name,
              type: e.type,
            });
          } else {
            attachmentList.push({
              code: (e.response && e.response[0]) || '',
              name: e.name,
              type: e.type,
            });
          }
        });
      }
      this.setState({
        billToParty: {
          ...billToParty,
          attachmentList,
        },
      });
    }
  };

  searchBillToParty = () => {
    this.ChooseBillToParty.wrappedInstance.changeVisible(true);
  };

  render() {
    const { form, authorization } = this.props;
    const { uuid, billToParty } = this.state;
    const uploadUrl = disk.uploadMoreFiles('bp_organization_certification', uuid);

    if (!billToParty.attachmentList) billToParty.attachmentList = [];
    const fileList = billToParty.attachmentList.map(e => {
      const url = disk.downloadFiles(e.code, { view: true });
      return {
        old: true,
        uid: e.code,
        name: e.name,
        type: e.type,
        status: 'done',
        url,
      };
    });

    return (
      <>
        <Form>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="收票方">
            {form.getFieldDecorator('billToPartyName', {
              initialValue: billToParty.billToPartyName,
              rules: [{ required: true }],
            })(<Search readOnly onSearch={this.searchBillToParty} />)}
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="认证说明">
            {form.getFieldDecorator('notes', {
              initialValue: billToParty.notes,
              rules: [{ required: true }],
            })(<Input.TextArea />)}
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="认证图片">
            {form.getFieldDecorator('attachmentList', {
              initialValue: fileList,
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
        <ChooseBillToParty
          ref={ref => {
            this.ChooseBillToParty = ref;
          }}
          selectChooseModalData={this.selectChooseModalData}
        />
      </>
    );
  }
}

export default PICertificationAddModal;

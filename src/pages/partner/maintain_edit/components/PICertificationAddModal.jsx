/**
 * PI认证 新增模态框
 */
import { Form, Input, Upload, Icon, Select } from 'antd';
import React from 'react';
import { connect } from 'dva';
import uniqBy from 'lodash/uniqBy';
import disk from '@/api/disk';
import { requestErr } from '@/utils/request';
import { guid } from '@/utils/utils';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
@connect(
  ({ bpEdit, user }) => {
    const details = bpEdit.details || {};
    const basic = details.basic || {};
    const customer = details.customer || {};
    const salesAreaList = customer.salesAreaList || [];

    // 所有收票方合并去重，并过滤掉自己
    let billToPartyList = salesAreaList.map(e => e.billToPartyList);
    // eslint-disable-next-line prefer-spread
    billToPartyList = uniqBy([].concat.apply([], billToPartyList), 'id');
    billToPartyList = billToPartyList.filter(e => e.id !== basic.id);

    return {
      details,
      salesAreaList,
      billToPartyList,
      authorization: user.currentUser.authorization,
    };
  },
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

  billToPartyChange = data => {
    const { billToPartyList } = this.props;
    const billToParty = billToPartyList.filter(e => e.id === data)[0];

    this.setState({
      billToParty: {
        billToPartyName: billToParty.name,
        billToPartyCode: billToParty.code,
        billToPartyId: billToParty.id,
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

  render() {
    const { form, authorization, billToPartyList } = this.props;
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
            {form.getFieldDecorator('billToPartyId', {
              initialValue: billToParty.billToPartyId,
              rules: [{ required: true }],
            })(
              <Select onChange={this.billToPartyChange}>
                {billToPartyList.map(e => (
                  <Option value={e.id} key={e.id}>
                    {`${e.code} - ${e.name}`}
                  </Option>
                ))}
              </Select>,
            )}
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
      </>
    );
  }
}

export default PICertificationAddModal;

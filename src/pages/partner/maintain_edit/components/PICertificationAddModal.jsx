/**
 * PI认证 新增模态框
 */
import { Form, Input, Upload, Icon, Select, Modal } from 'antd';
import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import uniqBy from 'lodash/uniqBy';
import diskAPI from '@/api/disk';
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
    const piCertificationList = details.piCertificationList || [];

    // 所有收票方合并去重
    let billToPartyList = salesAreaList.map(e => e.billToPartyList);
    // eslint-disable-next-line prefer-spread
    billToPartyList = uniqBy([].concat.apply([], billToPartyList), 'id');
    billToPartyList = billToPartyList.filter(e => {
      // 过滤空数据
      if (!e) return false;
      // 过滤掉收票方是自己
      if (e.id === basic.id) return false;
      // 过滤掉售达方不是自己
      if (e.soldToPartyId !== basic.id) return false;
      // 新增认证时：过滤掉认证中已经存在的收票方
      // 变更刚刚新增的数据时：不能过滤掉此数据的开票方（这里已经过滤掉了，需要在渲染列表时重新添加进去）
      if (piCertificationList.some(e1 => e1.billToPartyId === e.id)) return false;
      return true;
    });

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
    const { data: billToParty } = props;
    const type = billToParty.billToPartyId ? 2 : 1;
    const uuid = billToParty.uuid || guid();
    this.state = {
      // 1 新增 2 变更刚新增的数据
      type,
      // 回填的数据
      billToParty,
      uuid,
      // 变更时删除的文件
      deleteFileIdList: [],
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
      if (value.file.status === 'removed') {
        if (value.file.response) {
          diskAPI.deleteFiles(value.file.response[0]);
        } else {
          const { deleteFileIdList } = this.state;
          this.setState({
            deleteFileIdList: [...deleteFileIdList, value.file.uid],
          });
        }
      }
      if (value.file.response) {
        value.fileList.forEach(e => {
          if (e.status === 'error') requestErr(e.response);
          if (e.old) {
            attachmentList.push({
              id: e.uid,
              name: e.name,
            });
          } else {
            attachmentList.push({
              id: (e.response && e.response[0]) || '',
              name: e.name,
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

  // TODO: 批量删除 使用 async
  onOk = () => {
    const { onOk } = this.props;
    const { deleteFileIdList } = this.state;
    if (deleteFileIdList.length > 0) {
      deleteFileIdList.forEach(e => diskAPI.deleteFiles(e));
    }
    onOk();
  };

  render() {
    const { visible, onCancel, form, authorization, billToPartyList } = this.props;
    const { uuid, billToParty, type } = this.state;
    const uploadUrl = diskAPI.uploadMoreFiles('bp_pi_certification', uuid);

    if (type === 2) {
      billToPartyList.push({
        id: billToParty.billToPartyId,
        name: billToParty.billToPartyName,
        code: billToParty.billToPartyCode,
      });
    }

    if (!billToParty.attachmentList) billToParty.attachmentList = [];
    const fileList = billToParty.attachmentList.map(e => {
      const url = diskAPI.downloadFiles(e.id, { view: true });
      return {
        old: true,
        uid: e.id,
        name: e.name,
        type: e.type,
        status: 'done',
        url,
      };
    });

    return (
      <Modal
        title={formatMessage({ id: 'bp.maintain_details.PI_verification' })}
        visible={visible}
        onOk={this.onOk}
        onCancel={onCancel}
      >
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
      </Modal>
    );
  }
}

export default PICertificationAddModal;

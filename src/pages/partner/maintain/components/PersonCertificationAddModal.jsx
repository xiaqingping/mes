import { Form, Input, Modal, Upload, Icon, Select } from 'antd';
import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import api from '@/api';
import { guid } from '@/utils/utils';

const FormItem = Form.Item;
const { Option } = Select;

// function renderOption(item) {
//   return (
//     <Option key={`${item.id},${item.name}`} text={item.name}>
//       <div style={{ display: 'flex' }}>
//         <span>{item.code}</span>&nbsp;&nbsp;
//         <span>{item.name}</span>
//       </div>
//     </Option>
//   );
// }

class PersonCertificationAddModal extends Component {
  constructor(props) {
    super(props);
    const newGuid = guid();
    const uploadUrl = api.disk.uploadMoreFiles('bp_pi_certification', newGuid);
    this.state = {
      uploadUrl,
      newGuid,
      receivingParty: [], // 收票方
      newBillToPartyId: [],
    };
  }

  componentDidMount() {
    const { details } = this.props;
    const newData = [];
    if (details) {
      // eslint-disable-next-line consistent-return
      api.bp.getBPCustomer(details.id).then(res => {
        let newBillToPartyIds = [];
        res.piCertificationList.forEach(item => {
          newBillToPartyIds = [...newBillToPartyIds, item.billToPartyId];
        });
        if (!res.customer) return false;
        res.customer.salesAreaList.forEach(item => {
          item.billToPartyList.forEach(v => {
            if (v.soldToPartyId === res.basic.id && v.id !== res.basic.id) {
              newData.push(v);
            }
          });
        });
        this.setState({
          receivingParty: newData,
          newBillToPartyId: newBillToPartyIds,
        });
      });
    }
  }

  // 数组去重
  uniq = arr => {
    const result = [];
    const obj = {};
    for (let i = 0; i < arr.length; i++) {
      if (!obj[arr[i].id]) {
        result.push(arr[i]);
        obj[arr[i].id] = true;
      }
    }
    return result;
  };

  okHandle = () => {
    const { newBillToPartyId } = this.state;
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.props.form.resetFields();
      this.props.handleModalVisible(false);
      this.props.handleAdd(fieldsValue, this.state.newGuid);
      const newGuid = guid();
      this.setState({
        uploadUrl: api.disk.uploadMoreFiles('bp_pi_certification', newGuid),
        newGuid,
        newBillToPartyId: [...newBillToPartyId, fieldsValue.billToPartyId.split(',')[0]],
      });
    });
  };

  render() {
    const {
      modalVisible,
      form,
      handleModalVisible,
      authorization,
      newDataList,
      userPersonData,
    } = this.props;
    const { uploadUrl, receivingParty } = this.state;
    const newReceivingParty = [];
    const newBillToPartyId = [];
    userPersonData.forEach(item => {
      if (!newBillToPartyId.includes(item.id)) {
        newBillToPartyId.push(item.id);
      }
    });
    newDataList.forEach(item => {
      if (!newBillToPartyId.includes(item.billToPartyId)) {
        newBillToPartyId.push(item.billToPartyId);
      }
    });
    this.uniq(receivingParty).forEach(item => {
      if (!newBillToPartyId.includes(item.id)) {
        newReceivingParty.push(item);
      }
    });

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

    // 删除图片
    const removePic = e => {
      if (e.response.length !== 0) {
        api.disk.deleteFiles(e.response[0]).then();
      }
    };
    return (
      <Modal
        destroyOnClose
        title={formatMessage({ id: 'bp.maintain_details.PI_verification' })}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible(false)}
      >
        <FormItem
          labelCol={{
            span: 5,
          }}
          wrapperCol={{
            span: 15,
          }}
          label={formatMessage({ id: 'bp.maintain_details.sales_distribution.bill_to_party' })}
        >
          {form.getFieldDecorator('billToPartyId', {
            rules: [{ required: true }],
          })(
            // <AutoComplete
            //   dataSource={receivingParty.map(renderOption)}
            //   onSearch={this.searchCustomer}
            //   optionLabelProp="text"
            //   style= {{ width: '100%' }}
            //   // placeholder="请输入"
            // />,
            <Select style={{ width: '100%' }}>
              {newReceivingParty.map(item => (
                <Option key={`${item.id},${item.name}`} text={item.name}>
                  {item.code}&nbsp;&nbsp;{item.name}
                </Option>
              ))}
            </Select>,
          )}
        </FormItem>
        <FormItem
          labelCol={{
            span: 5,
          }}
          wrapperCol={{
            span: 15,
          }}
          label={formatMessage({ id: 'bp.maintain_details.verification_data.memo' })}
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
          label={formatMessage({ id: 'bp.maintain.ChangeModal.attachment' })}
        >
          {form.getFieldDecorator('attachmentList', {
            rules: [{ required: true }],
            valuePropName: 'attachmentList',
            getValueFromEvent: normFile,
          })(
            <Upload
              name="files"
              multiple
              listType="picture-card"
              className="avatar-uploader"
              showUploadList
              action={uploadUrl}
              headers={{ Authorization: authorization }}
              accept=".jpg"
              onRemove={e => {
                removePic(e);
              }}
            >
              {uploadButton}
            </Upload>,
          )}
        </FormItem>
      </Modal>
    );
  }
}

export default PersonCertificationAddModal;

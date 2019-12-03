import {
  Form,
  Input,
  Modal,
  Upload,
  Icon,
  AutoComplete,
  Select,
} from 'antd';
import React, { Component } from 'react';
import api from '@/api';
import { guid } from '@/utils/utils';
import _ from 'lodash';

const FormItem = Form.Item;
const { Option } = Select;

function renderOption(item) {
  return (
    <Option key={`${item.id},${item.name}`} text={item.name}>
      <div style={{ display: 'flex' }}>
        <span>{item.code}</span>&nbsp;&nbsp;
        <span>{item.name}</span>
      </div>
    </Option>
  );
}

class PersonCertificationAddModal extends Component {
  constructor(props) {
    super(props);
    const newGuid = this.props.attachmentCode || guid()
    const uploadUrl = api.disk.uploadMoreFiles(
      'bp_organization_certification',
      newGuid,
      );
    this.state = {
      uploadUrl,
      newGuid,
      receivingParty: [], // 收票方
      receivingData: [],
    }
    this.callCustomer = _.debounce(this.callCustomer, 500);
  }

  componentWillReceiveProps(props) {
    const { details } = props;
    const { receivingData } = this.state;

    if (details) {
      api.bp.getBPCustomer(details.id).then(res => {
        // receivingData.push({ id: res.basic.id, code: res.basic.code, name: res.basic.name })
        console.log(res)
        // eslint-disable-next-line array-callback-return
        res.customer.salesAreaList.map(item => {
          if (item.soldToPartyId === res.basic.id && item.id !== res.basic.id) {
            item.billToPartyList.map(v => receivingData.push(v))
          }
        })
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
    return result
}


    // 收票方查询
  callCustomer = value => {
    const data = [];
    // eslint-disable-next-line array-callback-return
    this.uniq(this.state.receivingData).map(item => {
      if (item.code.indexOf(value) !== -1 || item.name.indexOf(value) !== -1) {
        data.push(item)
      }
    })
    // console.log(data)
    this.setState({
      receivingParty: data,
    })
  }

  /** 查询收票方 */
  searchCustomer = value => {
    if (value) {
      this.callCustomer(value)
    }
  }

  okHandle = () => {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.props.form.resetFields();
      this.props.handleModalVisible(false)
      this.props.handleAdd(fieldsValue, this.state.newGuid);
    });
  };

  render () {
    const { modalVisible,
      form,
      handleModalVisible,
      authorization } = this.props;
    const { uploadUrl, receivingParty } = this.state;

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
          api.disk.deleteFiles(e.response[0]).then()
        }
      }

    return (
      <Modal
        destroyOnClose
        title="PI认证"
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
          label="收票方"
        >
          {form.getFieldDecorator('invoicePartyId', {
            rules: [{ required: true }],
          })(
            <AutoComplete
              dataSource={receivingParty.map(renderOption)}
              onSearch={this.searchCustomer}
              optionLabelProp="text"
              style= {{ width: '100%' }}
              // placeholder="请输入"
            />,
          )}
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
          })(<Upload
            name="files"
            multiple
            listType="picture-card"
            className="avatar-uploader"
            showUploadList
            action={uploadUrl}
            headers={{ Authorization: authorization }}
            accept=".jpg"
            onRemove={e => { removePic(e) }}
          >
            {uploadButton}
          </Upload>)}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create()(PersonCertificationAddModal);

import React from 'react';
import { Upload, message, Button } from 'antd';
import { UploadOutlined, CloseOutlined } from '@ant-design/icons';

const url = UPLOAD_URL || 'https://www.mocky.io/v2/5cc8019d300000980a055e76';
const props = {
  name: 'file',
  action: url,
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      // console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败`);
    }
  },
  showUploadList: {
    showRemoveIcon: true,
    removeIcon: <CloseOutlined />,
  },
};

const UploadUI = () => (
  <Upload {...props}>
    <Button>
      <UploadOutlined /> 上传文件
    </Button>
  </Upload>
);
export default UploadUI;

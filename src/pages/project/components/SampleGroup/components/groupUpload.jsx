import React from 'react';
import { Upload, message, Table, Input } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import '../index.less';

const { TextArea } = Input;

const { Dragger } = Upload;

class FileUpload extends React.Component {
  state = {
    tableData: [],
  };

  onChange = (a, b, c) => {
    console.log(a, b, c);
  };

  render() {
    const { tableData } = this.state;
    const columns = [];
    const props = {
      name: 'file',
      showUploadList: false,
      // multiple: true,
      action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      onChange(info) {
        const { status } = info.file;
        if (status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (status === 'done') {
          message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };
    return (
      <div className="project_manage_sample_select_sed_model">
        <div style={{ display: 'flex' }}>
          <div>
            <Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">点击或将文件</p>
              <p className="drag-upload">拖拽到这里上传</p>
            </Dragger>
          </div>

          <div style={{ width: '100%', marginLeft: 30 }}>
            <TextArea rows={6} />
          </div>
        </div>
        <Table columns={columns} dataSource={tableData} pagination={false} />
      </div>
    );
  }
}

export default FileUpload;

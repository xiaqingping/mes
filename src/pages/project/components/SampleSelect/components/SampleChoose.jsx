import React from 'react';
import { Table, Button, Upload, message, Checkbox } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

class SampleChoose extends React.Component {
  state = {
    tableData: [],
  };

  handleUploadChange = info => {
    if (info.file.status === 'done') {
      message.success(`文件上传成功！`);
    }
  };

  handleCheckboxChange = (e, row) => {
    console.log(e);
    console.log(row);
  };

  render() {
    const columns = [
      {
        title: '样品',
        dataIndex: 'name',
        key: 'name',
        filters: [],
        render: (text, record, index) => {
          return <Checkbox onChange={e => this.handleCheckboxChange(e, record)}>Checkbox</Checkbox>;
        },
      },
      {
        title: '文件',
        dataIndex: 'file',
        key: 'alia',
        render: (text, record, index) => {
          return <Checkbox onChange={e => this.handleCheckboxChange(e, record)}>Checkbox</Checkbox>;
        },
      },
      {
        title: '序列',
        dataIndex: 'sequence',
        key: 'sequence',
        render: (text, record) => {
          return <div>hsjsjsj</div>;
        },
      },
      {
        title: '长度',
        dataIndex: 'length',
        key: 'length',
        render: (text, record) => {
          return <div>ddd</div>;
        },
      },
      {
        title: '文件',
        dataIndex: 'files',
        key: 'files',
        render: (text, record) => {
          return <a>已选{text || 0}个</a>;
        },
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <a
            onClick={() => {
              this.handleDelete(record);
            }}
          >
            删除
          </a>
          // <Popconfirm
          //   placement="topRight"
          //   title={text}
          //   onConfirm={() => this.handleDelete}
          //   okText="Yes"
          //   cancelText="No"
          // >

          // </Popconfirm>
        ),
      },
    ];
    const { tableData } = this.state;
    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Upload name="file" action="" onChange={this.handleUploadChange} showUploadList={false}>
            <Button type="primary">
              <UploadOutlined /> 序列文件
            </Button>
          </Upload>
        </div>
        <Table columns={columns} dataSource={tableData} pagination={false} />
      </>
    );
  }
}

export default SampleChoose;

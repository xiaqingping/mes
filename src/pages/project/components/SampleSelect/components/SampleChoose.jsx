import React from 'react';
import { Table, Button, message, Checkbox, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import FileUpload from './fileUpload';

class SampleChoose extends React.Component {
  state = {
    tableData: [
      {
        // name:"11",
      },
    ],
    visible: false,
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

  toggleVis = v => {
    this.setState({
      visible: v,
    });
  };

  openUpload = () => {
    this.toggleVis(true);
    // this.setState({
    //   visible: true,
    // });
  };

  handleOk = () => {
    this.toggleVis(false);
  };

  handleCancel = () => {
    this.toggleVis(false);
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
    ];
    const { tableData, visible } = this.state;
    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="primary" onClick={() => this.openUpload(true)}>
            <UploadOutlined /> 序列文件
          </Button>
        </div>
        <Table columns={columns} dataSource={tableData} pagination={false} />
        <Modal
          bodyStyle={{ paddingTop: 10 }}
          title="上传序列文件"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={820}
        >
          <FileUpload />
        </Modal>
      </>
    );
  }
}

export default SampleChoose;

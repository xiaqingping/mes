// 上传序列文件
import React from 'react';
import { Modal, Button, Upload, Carousel, Table } from 'antd';
import { InboxOutlined, CloseOutlined } from '@ant-design/icons';
import './index.less';

const { Dragger } = Upload;

class UploadSequenceFile extends React.Component {
  static getDerivedStateFromProps(nextProps) {
    return { visible: nextProps.visible };
  }

  state = {
    loading: false,
    visible: false,
    fileLists: [
      {
        uid: '1',
        name: 'i11111mage.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      },
      {
        uid: '2',
        name: 'image.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      },
      {
        uid: '3',
        name: 'image.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      },
      {
        uid: '4',
        name: 'image.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      },
      // {
      //   uid: '5',
      //   name: 'image.png',
      //   status: 'error',
      // },
      // {
      //   uid: '6',
      //   name: 'image.png',
      //   status: 'done',
      //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      // },
      // {
      //   uid: '7',
      //   name: 'image.png',
      //   status: 'done',
      //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      // },
      // {
      //   uid: '8',
      //   name: 'image.png',
      //   status: 'done',
      //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      // },
      // {
      //   uid: '9',
      //   name: 'image.png',
      //   status: 'done',
      //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      // },
      // {
      //   uid: '10',
      //   name: 'image.png',
      //   status: 'error',
      // },
      // {
      //   uid: '11',
      //   name: 'bpic10823_s.jpg',
      // },
    ],
  };

  getTableData = (options = {}) => {
    const { pagination } = this.state;
    const query = {
      ...{
        page: pagination.current,
        pageSize: pagination.pageSize,
      },
      ...options,
    };

    this.setState({ loading: true });
    // bpAPI
    //   .getInvoiceParty(query)
    //   .then(res => {
    //     this.setState({
    //       list: res.results,
    //       pagination: {
    //         current: query.page,
    //         pageSize: query.pageSize,
    //         total: res.total,
    //       },
    //     });
    //   })
    //   .finally(() => {
    //     this.setState({ loading: false });
    //   });
  };

  // 上传按钮
  uploadButton = () => (
    <div
      style={{
        textAlign: 'center',
        background: '#FBFBFB',
      }}
    >
      <InboxOutlined style={{ fontSize: '70px', color: '#1890FF' }} />
      <p>点击或将文件</p>
      <p>拖曳到这里上传</p>
    </div>
  );

  // 图片的分组
  expoleArr = arr => {
    const result = [];
    for (let i = 0, len = arr.length; i < len; i += 6) {
      result.push(arr.slice(i, i + 6));
    }
    return result;
  };

  tableChange = ({ current, pageSize, total }) => {
    const pagination = { current, pageSize, total };

    this.setState({ pagination }, () => {
      this.getTableData();
    });
  };

  handleChange = ({ file, fileList }) => {
    const { fileLists } = this.state;
    if (file.status !== 'uploading') {
      console.log(file, fileList);
      this.setState({
        fileLists: [...fileLists, ...fileList],
      });
    }
  };

  render() {
    const { list, loading, visible, fileLists } = this.state;
    const newFileList = this.expoleArr(fileLists);
    const columns = [
      {
        title: '样品',
        dataIndex: 'name',
      },
      {
        title: '原始文件',
        dataIndex: 'age',
      },
      {
        title: '序列',
        dataIndex: 'address',
      },
      {
        title: '长度',
        dataIndex: 'address',
      },
    ];
    return (
      <Modal
        title="上传序列文件"
        visible={visible}
        onCancel={this.props.handleClose}
        width={871}
        footer={[
          <Button key="submit" type="primary" onClick={this.props.handleClose}>
            确认
          </Button>,
        ]}
        maskClosable={false}
      >
        <div style={{ float: 'left', width: '200px' }}>
          <Dragger
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            multiple
            onChange={(file, fileList) => this.handleChange(file, fileList)}
            style={{ width: '173px' }}
            showUploadList={false}
          >
            {this.uploadButton()}
          </Dragger>
        </div>
        {/* 轮播图 */}
        <div style={{ width: '600px', float: 'left' }}>
          <Carousel>
            {newFileList.map((item, index) => (
              <Upload
                key={index}
                defaultFileList={item}
                showUploadList={{
                  removeIcon: (
                    <CloseOutlined
                      onClick={() => {
                        console.log(123);
                      }}
                    />
                  ),
                }}
              />
            ))}
          </Carousel>
        </div>
        <div style={{ clear: 'both' }}>
          <Table
            rowKey="id"
            dataSource={list}
            columns={columns}
            loading={loading}
            onChange={this.tableChange}
            pagination={false}
          />
        </div>
      </Modal>
    );
  }
}

export default UploadSequenceFile;

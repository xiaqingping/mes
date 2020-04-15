// 上传序列文件
import React from 'react';
import { Modal, Button, Carousel, Table } from 'antd';
import { InboxOutlined, CloseOutlined } from '@ant-design/icons';
import { guid } from '@/utils/utils';
import request from '@/utils/request';
import './index.less';
import axios from 'axios';
import disk from '../api/disk';

class UploadSequenceFile extends React.Component {
  static getDerivedStateFromProps(nextProps) {
    return { visible: nextProps.visible };
  }

  constructor(props) {
    super(props);
    const guuid = guid();
    this.state = {
      guuid,
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
  }

  state = {};

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

  // 上传操作
  handleUpload = data => {
    const { guuid } = this.state;
    const uploadUrl = disk.uploadMoreFiles('ngs_sample', guuid);
    const formData = new FormData();
    console.log(this.refs.inputRef);
    // data.map((item, index) => {
    //   const file = {
    //     uri: data.target.value,
    //     type: 'application/octet-stream',
    //     name: '',
    //   };
    //   formData.append('file', file);
    // });
    request(uploadUrl, {
      data: formData,
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(res => {
      console.log(res);
    });

    //   {
    //   method: 'post',
    //   url: uploadUrl,
    //   data: e.target.value,
    //   headers: {
    //     'Content-Type': 'multipart/form-data',
    //   },
    // })
    //   .then(res => {
    //     console.log(res);
    //   })
    //   .catch(err => {
    //     console.log('上传失败！');
    //   });
  };

  update = e => {
    // 上传照片
    const file = e.target.files[0];
    console.log(e.target.files);
    console.log(file);
    console.log(e.target.files.length);
    console.log(e.target.files.length);
    const { guuid } = this.state;
    const uploadUrl = disk.uploadMoreFiles('ngs_sample', guuid);
    const data = new FormData();
    data.append('files', file);
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' },
    };
    // axios.post(uploadUrl, data, config);
    request(uploadUrl.replace('https://devapi.sangon.com:30443', ''), {
      method: 'POST',
      data,
      ...config,
    }).then(res => {
      // console.log(res);
    });
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
          <input
            type="file"
            onChange={e => this.update(e)}
            multiple="multiple"
            style={{ opacity: 1, cursor: 'pointer' }}
          />
        </div>
        {/* 轮播图 */}
        <div style={{ width: '600px', float: 'left' }}>
          <Carousel>
            <div>123</div>
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

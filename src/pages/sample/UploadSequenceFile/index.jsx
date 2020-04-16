// 上传序列文件
import React from 'react';
import { Modal, Button, Carousel, Table, List, Progress } from 'antd';
import { InboxOutlined, PaperClipOutlined, CloseOutlined } from '@ant-design/icons';
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
      filesNameList: [],
      filesId: [],
      progressStatus: '',
    };
  }

  callback = v => v;

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

  // 上传文件
  handleUpload = (e, callback) => {
    const self = this;
    const { filesNameList } = self.state;
    const file = e.target.files;
    const { guuid } = this.state;
    const uploadUrl = disk.uploadMoreFiles('ngs_sample', guuid);
    const data = new FormData();
    for (let i = 0; i < file.length; i++) {
      data.append('files', file[i]);
      self.setState({
        filesNameList: [...filesNameList, file[i].name],
      });
    }
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress(progress) {
        callback(`${(progress.loaded / progress.total) * 100}%`);
      },
    };
    request(uploadUrl, {
      method: 'POST',
      data,
      ...config,
    }).then(res => {
      console.log(res);
    });
  };

  // 文件列表
  itemList = (item, index) => {
    const { progressStatus } = this.state;
    return (
      <List.Item
        style={{ fontSize: '16px', width: '160px', float: 'left', position: 'relative' }}
        key={index + item}
      >
        <span>
          <PaperClipOutlined style={{ fontSize: '18px' }} />
          <span style={{ display: 'inline-block', marginLeft: '10px' }}>{item}</span>
        </span>
        <Button icon={<CloseOutlined />} style={{ border: 'none' }} />
        <Progress
          percent={this.callback}
          size="small"
          showInfo={false}
          style={{ position: 'absolute', top: '55px' }}
        />
      </List.Item>
    );
  };

  render() {
    const { list, loading, visible, progressStatus, filesNameList } = this.state;
    const newFileList = this.expoleArr(filesNameList);
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
        className="upload-page"
        footer={[
          <Button key="submit" type="primary" onClick={this.props.handleClose}>
            确认
          </Button>,
        ]}
        maskClosable={false}
      >
        <div style={{ float: 'left', width: '170px', height: '142px', position: 'relative' }}>
          <div
            style={{
              width: '100%',
              height: '100%',
              border: '1px solid black',
              textAlign: 'center',
              background: '#FBFBFB',
            }}
          >
            <InboxOutlined style={{ fontSize: '64px', color: '#1890FF', marginTop: '12px' }} />
            <div style={{ fontSize: '16px' }}>点击或将文件</div>
            <div style={{ fontSize: '16px' }}>拖拽到这里上传</div>
          </div>
          <input
            type="file"
            onChange={e => this.handleUpload(e, this.callback)}
            multiple="multiple"
            style={{
              opacity: 0,
              cursor: 'pointer',
              width: '170px',
              height: '142px',
              outline: 'none',
              position: 'absolute',
              top: '0',
              zIndex: '10',
            }}
          />
        </div>
        {/* 轮播图 */}
        <div style={{ width: '645px', float: 'left', paddingLeft: '45px' }}>
          <Carousel>
            {newFileList.map((it, index) => (
              <List dataSource={it} renderItem={item => this.itemList(item)} key={index} />
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

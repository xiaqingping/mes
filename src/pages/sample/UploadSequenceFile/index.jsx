/* eslint-disable react/no-string-refs */
// 上传序列文件
import React from 'react';
import { Modal, Button, Carousel, Table, List, Progress, message } from 'antd';
import { InboxOutlined, PaperClipOutlined } from '@ant-design/icons';
import { guid, cutString } from '@/utils/utils';
import api from '@/pages/sample/api/sample';
import './index.less';
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
      countNum: 0,
      tableList: [],
    };
  }

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

  // 删除files文件
  deleteFiles = v => {
    const { filesNameList, tableList } = this.state;
    for (let i = tableList.length - 1; i >= 0; i--) {
      const result = tableList[i].sampleProperties.filter(
        item => item.sourceSequenceFileId !== v.fileId,
      );
      if (result.length !== 0) {
        tableList[i].sampleProperties = result;
      } else {
        console.log(tableList.splice(i, 1));
      }
    }
    const newFiles = filesNameList.filter(item => item.id !== v.id);
    this.setState({
      filesNameList: newFiles,
      tableList: [...tableList],
    });
  };

  // 上传文件
  handleUpload = e => {
    const self = this;
    const file = e.target.files;
    const { guuid, filesNameList, countNum, tableList } = self.state;
    const uploadUrl = disk.uploadMoreFiles('ngs_sample', guuid);
    const data = new FormData();
    let filesData = [];
    const id = countNum;
    const AllImgExt = '.fasta|.fastq|.fq|.jpg|.rar';
    for (let i = 0; i < file.length; i++) {
      const fileArr = file[i].name.split('.');
      if (AllImgExt.indexOf(fileArr[fileArr.length - 1]) === -1) {
        message.error('文件格式不正确');
        return false;
      }
      data.append('files', file[i]);
      filesData = [...filesData, file[i].name];
    }

    const config = {
      headers: { 'Content-Type': 'multipart/form-data' },
      // 进度条
      onUploadProgress(progress) {
        const newData = filesData.map((item, index) => ({
          id: index + id + 1,
          name: item,
          progress: `${(progress.loaded / progress.total) * 100}`,
          status: 'loading',
          done: false,
        }));
        self.setState({
          filesNameList: [...newData, ...filesNameList],
          countNum: id + filesData.length,
        });
      },
    };
    api
      .UploadFiles(uploadUrl, {
        data,
        ...config,
      })
      .then(res => {
        const newData = filesData.map((item, index) => ({
          id: index + id + 1,
          name: item,
          progress: 100,
          status: 'success',
          fileId: res[index],
          done: true,
        }));
        self.setState({
          filesNameList: [...newData, ...filesNameList],
          countNum: id + filesData.length,
        });
        api.getSequenceFileAnalysis(res).then(r => {
          if (tableList.length === 0) {
            self.setState({
              tableList: [...r],
            });
          } else {
            tableList.map((item, index) => {
              r.map(i => {
                if (item.sampleIdentificationCode === i.sampleIdentificationCode) {
                  tableList[index].sampleProperties = [
                    ...item.sampleProperties,
                    ...i.sampleProperties,
                  ];
                }
                return true;
              });
              return true;
            });
            self.setState({
              tableList,
            });
          }
        });
      })
      .catch(() => {
        const newData = filesData.map((item, index) => ({
          id: index + id + 1,
          name: item,
          progress: 100,
          status: 'error',
          done: false,
        }));
        self.setState({
          filesNameList: [...newData, ...filesNameList],
          countNum: id + filesData.length,
        });
      });
  };

  // 文件列表
  itemList = item => (
    <List.Item style={{ width: '160px', float: 'left', position: 'relative' }} key={item.id}>
      {/* <span>{item.done ? 1 : 2}</span> */}
      <span>
        <PaperClipOutlined style={{ fontSize: '18px', float: 'left' }} />
        <span style={{ display: 'inline', marginLeft: '10px', fontSize: '14px' }} title={item.name}>
          <span style={{ fontWeight: 'bolder', color: 'black' }}>{item.id}</span>{' '}
          {cutString(item.name, 10)}
        </span>
      </span>
      <a
        style={{ fontSize: '23px', color: '#C4C4C4' }}
        onClick={() => {
          this.deleteFiles(item);
        }}
      >
        ×
      </a>
      <Progress
        percent={item.progress}
        status={
          // eslint-disable-next-line no-nested-ternary
          item.status === 'error' ? 'exception' : item.status === 'success' ? 'success' : 'normal'
        }
        size="small"
        showInfo={false}
        style={{ position: 'absolute', top: '40px' }}
      />
    </List.Item>
  );

  // 上一页
  handlePrev = () => {
    this.refs.img.prev();
  };

  // 下一页
  handleNext = () => {
    this.refs.img.next();
  };

  // 判断table里面的原始文件数据前面的id
  getFilesContent = (item, filesNameList) => {
    // console.log(item, filesNameList);
    if (item.sequenceFileName) {
      if (filesNameList.filter(i => i.fileId === item.sourceSequenceFileId).length !== 0) {
        return filesNameList.filter(i => i.fileId === item.sourceSequenceFileId)[0].id;
      }
    }
    return '';
  };

  // 提交
  handleOK = () => {
    const { tableList } = this.state;
    api.addSample(tableList).then(() => {
      this.props.handleClose();
    });
  };

  render() {
    const { loading, visible, filesNameList, tableList } = this.state;
    const newFileList = this.expoleArr(filesNameList);
    const columns = [
      {
        title: '样品',
        dataIndex: 'sampleName',
        render: (value, row) => (
          <>
            <div style={{ color: 'black' }}>{value}</div>
            <div>{row.sampleIdentificationCode}</div>
          </>
        ),
      },
      {
        title: '原始文件',
        dataIndex: 'cc',
        render: (value, row) => (
          <>
            {row.sampleProperties && row.sampleProperties.length !== 0
              ? row.sampleProperties.map(item => (
                  <div>
                    <span style={{ color: 'black' }}>
                      {this.getFilesContent(item, filesNameList)}
                    </span>{' '}
                    {item.sourceSequenceFileName}
                  </div>
                ))
              : ''}
          </>
        ),
      },
      {
        title: '序列',
        dataIndex: 'bb',
        render: (value, row) => (
          <>
            {row.sampleProperties && row.sampleProperties.length !== 0
              ? row.sampleProperties.map(item => (
                  <div>{`${item.sampleSequenceCount} (${item.sampleLengthTotal}bp)`}</div>
                ))
              : ''}
          </>
        ),
      },
      {
        title: '长度',
        dataIndex: 'aa',
        render: (value, row) => (
          <>
            {row.sampleProperties && row.sampleProperties.length !== 0
              ? row.sampleProperties.map(item => (
                  <div>
                    {`${item.sampleLengthMin}-${item.sampleLengthMax} (${item.sampleLengthAve})`}
                  </div>
                ))
              : ''}
          </>
        ),
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
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              this.handleOK();
            }}
          >
            确认
          </Button>,
        ]}
        maskClosable={false}
      >
        {/* 上传按钮图标 */}
        <div style={{ float: 'left', width: '170px', height: '142px', position: 'relative' }}>
          <div
            style={{
              width: '100%',
              height: '100%',
              border: '1px dashed #DBDBDB',
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
        <div style={{ width: '645px', float: 'left', paddingLeft: '45px', position: 'relative' }}>
          {newFileList.length > 1 ? (
            <a
              style={{ position: 'absolute', top: '45px', left: '20px', fontSize: '30px' }}
              onClick={this.handlePrev}
            >
              &lt;
            </a>
          ) : (
            ''
          )}
          <Carousel ref="img">
            {newFileList.map((it, index) => (
              <List dataSource={it} renderItem={item => this.itemList(item)} key={index} />
            ))}
          </Carousel>
          {newFileList.length > 1 ? (
            <a
              style={{ position: 'absolute', top: '45px', right: '20px', fontSize: '30px' }}
              onClick={this.handleNext}
            >
              &gt;
            </a>
          ) : (
            ''
          )}
        </div>
        {/* 表格 */}
        <div style={{ clear: 'both' }}>
          <Table
            rowKey={record => record.sampleIdentificationCode}
            dataSource={tableList}
            columns={columns}
            loading={loading}
            onChange={this.tableChange}
            pagination={false}
            scroll={{ y: 260 }}
          />
        </div>
      </Modal>
    );
  }
}

export default UploadSequenceFile;

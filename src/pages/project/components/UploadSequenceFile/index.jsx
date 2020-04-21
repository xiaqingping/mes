// 上传分组方案
import React from 'react';
import { Modal, Button, Table, List, Progress, message, Input } from 'antd';
import { PaperClipOutlined } from '@ant-design/icons';
import { cutString } from '@/utils/utils';
import api from '@/pages/project/api/excel';
import { UploadButton } from '@/pages/project/components/CustomComponents';
import './index.less';

const { TextArea } = Input;
class UploadSequenceFile extends React.Component {
  static getDerivedStateFromProps(nextProps) {
    return { visible: nextProps.visible };
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      filesNameList: [],
      tableHead: [],
      tableList: [],
    };
  }

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
    const file = e.target.files;
    const data = new FormData();
    let filesData = [];
    const AllImgExt = '.xls|.xlsx';
    for (let i = 0; i < file.length; i++) {
      const fileArr = file[i].name.split('.');
      if (AllImgExt.indexOf(fileArr[fileArr.length - 1]) === -1) {
        message.error('文件格式不正确');
        return false;
      }
      data.append('file', file[i]);
      filesData = [...filesData, file[i].name];
    }
    api.getFileProcessExcels(data).then(res => {
      this.checkData(res);
    });
    return true;
  };

  // 文件列表
  itemList = item => (
    <List.Item style={{ width: '160px', float: 'left', position: 'relative' }} key={item.id}>
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

  // 提交
  handleOK = () => {
    // const { tableList } = this.state;
    // api.addSample(tableList).then(() => {
    //   this.props.handleClose();
    // });
  };

  // 数据分割
  handleData = value => {
    const arr = value.split('\n');
    const newData = arr.map(item => item.split(/[，,| ]/));
    let data = [];
    newData.forEach(item => {
      let temp = {};
      item.forEach((it, index) => {
        temp = { ...temp, [index]: it };
      });
      data = [...data, temp];
    });
    this.checkData(data);
  };

  // 数据检查
  checkData = value => {
    // 判断title不能为空
    let err = false;
    if (Object.values(value[0]).some(item => item === '')) {
      message.error('数据格式不正确');
      err = true;
    }
    const lengthNum = Object.keys(value[0]).length;
    value.forEach((item, index) => {
      // 判断每行的数据个数
      if (Object.keys(item).length !== lengthNum) {
        message.error('数据格式不正确');
        err = true;
      }
      if (index !== 0) {
        // TODO: 判断解析出来的数据第一项要等于样品数据的第一项
        // item[0] 第一项
      }
    });

    if (!err) {
      this.setState({
        tableHead: value.shift(),
        tableList: value,
      });
    }
  };

  render() {
    const { loading, tableList, tableHead } = this.state;
    let columns = [];
    Object.getOwnPropertyNames(tableHead).forEach(key => {
      columns = [
        ...columns,
        {
          title: tableHead[key],
          dataIndex: key,
        },
      ];
    });

    return (
      <Modal
        title="上传分组方案"
        visible
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
        {/* 上传文件 */}
        <div style={{ float: 'left', width: '170px', height: '142px', position: 'relative' }}>
          <UploadButton handleUpload={e => this.handleUpload(e)} />
        </div>
        {/* 输入框 */}
        <div style={{ width: '645px', float: 'left', paddingLeft: '45px', position: 'relative' }}>
          <TextArea
            rows={6}
            style={{ resize: 'none' }}
            placeholder="粘贴或快速输入，分隔符支持“逗号（，）”、“空格（ ）”、“竖线（|）”、“制表符（）”"
            onBlur={v => {
              this.handleData(v.target.value);
            }}
          />
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

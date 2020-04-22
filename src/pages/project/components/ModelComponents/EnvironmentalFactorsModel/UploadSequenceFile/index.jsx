// 上传分组方案
import React from 'react';
import { Modal, Button, Table, message, Input } from 'antd';
import { UploadButton } from './CustomComponents';
import api from './api/excel';
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

  // 提交
  handleOK = () => {
    const { tableHead, tableList } = this.state;
    // 整理表头
    const newTableHead = [];
    Object.keys(tableHead).map(key => {
      const item = {};
      const nKey = Number(key) + 1;
      if (key < 1) {
        item.sampleAlias = tableHead[key];
        item.dataIndex = 'sampleAlias';
        item.key = 'sampleAlias';
      }
      if (key > 0) {
        const headerName = `header_${nKey}`;
        item.title = tableHead[key];
        item.dataIndex = headerName;
        item.key = headerName;
      }
      item.id = nKey;
      newTableHead.push(item);
      return false;
    });
    // 整理表数据
    newTableHead.forEach((item, index) => {
      tableList.forEach((it, ind) => {
        it[item.key] = it[index];
        it.id = Number(ind) + 1;
        it.add = '';
        delete it[index];
      });
    });
    // 返回数据
    this.props.getUploadData(newTableHead, tableList);
    this.props.handleClose();
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
  // eslint-disable-next-line consistent-return
  checkData = value => {
    if (value[0][0] === '') return message.warning('未获取到数据, 不进行覆盖');

    const { sampleList } = this.props;
    // 判断title不能为空
    let err = false;
    if (Object.values(value[0]).some(item => item === '')) {
      message.error('数据格式不正确');
      err = true;
    }
    const lengthNum = Object.keys(value[0]).length;

    // 判断是否有不存在的样品
    const dataAll = [];
    sampleList.forEach(item => dataAll.push(item.sampleAlias));
    const newValue = [];
    value.forEach((item, index) => {
      if (index !== 0) newValue.push(item);
    });
    newValue.forEach(item => {
      if (dataAll.indexOf(item[0]) === -1) {
        message.warning(`${item[0]}不存在`);
        err = true;
      }
      return false;
    });

    const newList = [];
    sampleList.forEach(samItem => {
      value.forEach((valItem, index) => {
        // 判断每行的数据个数
        if (Object.keys(valItem).length !== lengthNum) {
          message.error('数据格式不正确');
          err = true;
        }
        // 排序
        if (index !== 0) {
          if (samItem.sampleAlias === valItem[0]) {
            newList.push(valItem);
          }
        }
      });
    });

    if (!err) {
      this.setState({
        tableHead: value.shift(),
        tableList: value,
      });
    } else {
      // 清空表格数据
      this.setState({
        tableHead: [],
        tableList: [],
      });
    }
  };

  render() {
    const { loading, tableList, tableHead, visible } = this.state;
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
            rowKey={(record, index) => index}
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

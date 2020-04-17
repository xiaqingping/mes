import React from 'react';
import { Table, Button, message, Checkbox, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import FileUpload from '../../UploadSequenceFile/lunbotu';

class SampleChoose extends React.Component {
  state = {
    tableData: [
      {
        id: '111',
        sample: '样品1',
        files: [
          { filename: '文件1', fileId: '2222', xulie: '序列', length: '200' },
          { filename: '文件2', fileId: '33333', xulie: '序列', length: '200', checked: true },
        ],
      },
    ],
    visible: false,
  };

  componentDidMount() {
    this.getTableData();
  }

  getTableData = () => {
    // 请求接口, 获取后台数据
    const { tableData } = this.state;
    tableData.forEach(item => {
      const fileCheckedLen = item.files.filter(v => {
        return v.checked;
      }).length;
      if (fileCheckedLen === item.files.length) {
        item.indeterminate = false;
        item.checked = true;
      } else if (fileCheckedLen === 0) {
        item.indeterminate = false;
        item.checked = false;
      } else {
        item.indeterminate = true;
        item.checked = false;
      }
    });
  };

  handleUploadChange = info => {
    if (info.file.status === 'done') {
      message.success(`文件上传成功！`);
    }
  };

  handleCheckboxChange = (e, row, text, item, index) => {
    const { tableData } = this.state;
    console.log(e.target.checked);
    console.log(row);
    console.log(text);
    console.log(item);
    let selectRow = tableData.filter(v => {
      return v.id === row.id;
    });
    selectRow = selectRow[0];
    if (item) {
      selectRow.files.forEach(i => {
        if (i.fileId === item.fileId) {
          i.checked = e.target.checked;
        }
      });
      const checkedLen = selectRow.files.filter(r => {
        return r.checked;
      }).length;
      if (checkedLen === selectRow.files.length) {
        selectRow.indeterminate = false;
        selectRow.checked = true;
      } else if (checkedLen === 0) {
        selectRow.indeterminate = false;
        selectRow.checked = false;
      } else {
        selectRow.indeterminate = true;
        selectRow.checked = false;
      }

      const tbData = [...tableData];
      tbData[index] = selectRow;
      this.setState({
        tableData: tbData,
      });
    } else {
      selectRow.checked = e.target.checked;
      selectRow.indeterminate = false;
      // 如果没有item表示, 是点击的样品
      selectRow.files.forEach(i => {
        i.checked = e.target.checked;
      });
    }
    const tbData = [...tableData];
    tbData[index] = selectRow;
    this.setState({
      tableData: tbData,
    });
  };

  toggleVis = v => {
    this.setState({
      visible: v,
    });
  };

  openUpload = () => {
    this.toggleVis(true);
  };

  handleOk = () => {
    this.toggleVis(false);
  };

  handleFileUploadClose = v => {
    if (v) {
      this.getTableData();
    }
    this.toggleVis(false);
  };

  render() {
    const columns = [
      {
        title: '样品',
        dataIndex: 'sample',
        key: 'sample',
        filters: [],
        render: (text, record, index) => {
          return (
            <Checkbox
              onChange={e => this.handleCheckboxChange(e, record, text, undefined, index)}
              indeterminate={record.indeterminate}
              checked={record.checked}
            >
              {text}
            </Checkbox>
          );
        },
      },
      {
        title: '文件',
        dataIndex: 'files',
        key: 'files',
        render: (text, record, index) => {
          console.log(text);
          return text.map(item => {
            return (
              <div>
                <Checkbox
                  onChange={e => this.handleCheckboxChange(e, record, text, item, index)}
                  key={item.fileId}
                  checked={item.checked}
                >
                  {item.filename}
                </Checkbox>
              </div>
            );
          });
        },
      },
      {
        title: '序列',
        dataIndex: 'xulie',
        key: 'xulie',
        render: (text, record) => {
          return record.files.map(item => {
            return <div>{item.xulie}</div>;
          });
        },
      },
      {
        title: '长度',
        dataIndex: 'length',
        key: 'length',
        render: (text, record) => {
          return record.files.map(item => {
            return <div>{item.length}</div>;
          });
        },
      },
    ];
    const { tableData, visible } = this.state;
    return (
      <>
        <Modal
          bodyStyle={{ paddingTop: 10 }}
          title="选择样品"
          visible
          onOk={this.props.handleOk}
          onCancel={this.props.handleCancel}
          width={820}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="primary" onClick={() => this.openUpload(true)}>
              <UploadOutlined /> 序列文件
            </Button>
          </div>
          <Table columns={columns} dataSource={tableData} pagination={false} />
          {visible && <FileUpload handleClose={this.handleFileUploadClose} />}
        </Modal>
      </>
    );
  }
}

export default SampleChoose;

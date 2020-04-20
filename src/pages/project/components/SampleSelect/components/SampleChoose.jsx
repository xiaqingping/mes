import React from 'react';
import { Table, Button, Tooltip, Checkbox, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import FileUpload from '../../UploadSequenceFile/lunbotu';
import api from '../api/sample.js';

class SampleChoose extends React.Component {
  state = {
    tableData: [],
    visible: false,
    loading: false,
  };

  componentDidMount() {
    this.getTableData();
  }

  getTableData = () => {
    // 请求接口, 获取后台数据
    const { id, chooseFileIds } = this.props;
    this.setState({
      loading: true,
    });
    if (id) {
      // if (formData.status) {
      //   newData = { ...newData, status: formData.status.join(',') };
      //   delete formData.status;
      // }
      const payload = { id, chooseFileIds: chooseFileIds.join(',') };

      api
        .getChosedFileDetails(payload)
        .then(res => {
          this.setState(
            {
              tableData: [res],
              loading: false,
            },
            () => {
              this.handleDataFormat();
            },
          );
        })
        .catch(err => {
          console.log(err);
          this.setState({
            loading: false,
          });
        });
    } else {
      const payload = { bpCode: 'aa', chooseFileIds: chooseFileIds.join(',') };
      api
        .getSampleList(payload)
        .then(res => {
          this.setState(
            {
              tableData: res,
              loading: false,
            },
            () => {
              this.handleDataFormat();
            },
          );
        })
        .catch(err => {
          console.log(err);
          this.setState({
            loading: false,
          });
        });
    }
  };

  handleDataFormat = () => {
    const { tableData } = this.state;
    const list = [...tableData];
    list.forEach(item => {
      const fileCheckedLen = item.sampleProperties.filter(v => {
        return v.isChoose;
      }).length;
      if (fileCheckedLen === item.sampleProperties.length) {
        item.indeterminate = false;
        item.isChoose = 1;
      } else if (fileCheckedLen === 0) {
        item.indeterminate = false;
        item.isChoose = 0;
      } else {
        item.indeterminate = true;
        item.isChoose = 0;
      }
    });
    this.setState({
      tableData: list,
    });
  };

  handleCheckboxChange = (e, row, text, item, index) => {
    const { tableData } = this.state;
    let selectRow = tableData.filter(v => {
      return v.id === row.id;
    });
    selectRow = selectRow[0];
    if (item) {
      selectRow.sampleProperties.forEach(i => {
        if (i.id === item.id) {
          i.isChoose = e.target.checked ? 1 : 0;
        }
      });
      const checkedLen = selectRow.sampleProperties.filter(r => {
        return r.isChoose;
      }).length;
      if (checkedLen === selectRow.sampleProperties.length) {
        selectRow.indeterminate = false;
        selectRow.isChoose = 1;
      } else if (checkedLen === 0) {
        selectRow.indeterminate = false;
        selectRow.isChoose = 0;
      } else {
        selectRow.indeterminate = true;
        selectRow.isChoose = 0;
      }

      const tbData = [...tableData];
      tbData[index] = selectRow;
      this.setState({
        tableData: tbData,
      });
    } else {
      // 选择的是样品
      selectRow.isChoose = e.target.checked ? 1 : 0;
      selectRow.indeterminate = false;

      // 如果没有item表示, 是点击的样品
      selectRow.sampleProperties.forEach(i => {
        i.isChoose = e.target.checked ? 1 : 0;
        return i;
      });
    }

    const tbData = [...tableData];
    tbData[index] = selectRow;
    this.setState({
      tableData: tbData,
    });
  };

  // toggleVis = v => {
  //   this.setState({
  //     visible: v,
  //   });
  // };

  openUpload = () => {
    this.toggleVis(true);
  };

  handleOk = () => {
    const { id } = this.props;
    this.props.handleOk();
    // 从这里发送数据过去
    const { tableData } = this.state;
    if (!id) {
      // 点击选择样品过来的。
      const checkedSample = tableData.filter(item => {
        return item.indeterminate || item.isChoose;
      });
      this.props.sendData(checkedSample);
    } else {
      // 点击已选择文件过来的。
      this.props.sendData(tableData);
    }

    // this.toggleVis(false);
  };

  handleFileUploadClose = v => {
    if (v) {
      this.getTableData();
    }
    // this.toggleVis(false);
  };

  render() {
    const columns = [
      {
        title: '样品',
        width: 150,
        dataIndex: 'sampleName',
        key: 'sampleName',
        filters: [],
        render: (text, record, index) => {
          return (
            <Checkbox
              onChange={e => this.handleCheckboxChange(e, record, text, undefined, index)}
              indeterminate={record.indeterminate}
              checked={record.isChoose}
            >
              {text}
            </Checkbox>
          );
        },
      },
      {
        title: '文件',
        dataIndex: 'sampleProperties',
        key: 'sampleProperties',
        ellipsis: true,

        render: (text, record, index) => {
          return text.map(item => {
            return (
              <div>
                {/* <Tooltip title={item.sequenceFileName} > */}
                <Checkbox
                  onChange={e => this.handleCheckboxChange(e, record, text, item, index)}
                  key={item.fileId}
                  checked={item.isChoose}
                >
                  {item.sequenceFileName}
                </Checkbox>
                {/* </Tooltip> */}
              </div>
            );
          });
        },
      },
      {
        title: '序列',
        dataIndex: 'xulie',
        key: 'xulie',
        width: 180,
        ellipsis: true,
        render: (text, row) => {
          return (
            <>
              {row.sampleProperties &&
                row.sampleProperties.length &&
                row.sampleProperties.map(item => (
                  <div>{`${item.sampleSequenceCount} (${item.sampleLengthTotal}bp)`}</div>
                ))}
            </>
          );
        },
      },
      {
        title: '长度',
        dataIndex: 'length',
        key: 'length',
        width: 130,
        ellipsis: true,
        render: (text, row) => (
          <>
            {row.sampleProperties &&
              row.sampleProperties.length &&
              row.sampleProperties.map(item => (
                <div>
                  {`${item.sampleLengthMin}-${item.sampleLengthMax} (avg ${item.sampleLengthAve})`}
                </div>
              ))}
          </>
        ),
      },
    ];
    const { tableData, visible, loading } = this.state;
    return (
      <>
        <Modal
          width={871}
          bodyStyle={{ paddingTop: 10, height: 500, overflow: 'auto' }}
          title="选择样品"
          visible
          // onOk={() => this.props.handleOk(tableData)}
          onCancel={this.props.handleCancel}
          footer={[
            <Button
              key="submit"
              type="primary"
              onClick={this.handleOk}
              // onClick={() => this.props.handleOk(tableData)}
            >
              确认
            </Button>,
          ]}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="primary" onClick={() => this.openUpload(true)}>
              <UploadOutlined /> 序列文件
            </Button>
          </div>
          <Table columns={columns} dataSource={tableData} pagination={false} loading={loading} />
          {visible && <FileUpload handleClose={this.handleFileUploadClose} />}
        </Modal>
      </>
    );
  }
}

export default SampleChoose;

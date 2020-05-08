import React from 'react';
import { Table, Button, Checkbox, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import FileUpload from '../../UploadSequenceFile/sequenUpload';
import api from '../api/sample.js';

/**
 * 选择样品弹框
 */
class SampleChoose extends React.Component {
  static getDerivedStateFromProps(nextProps) {
    return {
      disabled: nextProps.disabled,
    };
  }

  state = {
    disabled: false,
    tableData: [],
    visible: false,
    loading: false,
    filterData: [],
  };

  componentDidMount() {
    this.getTableData();
  }

  /**
   * 获取表格数据
   */
  getTableData = () => {
    // 请求接口, 获取后台数据
    const { id, chooseFileIds } = this.props;
    this.setState({
      loading: true,
    });
    if (id) {
      const payload = { id, chooseFileIds: chooseFileIds.join(',') };

      api
        .getChosedFileDetails(payload)
        .then(res => {
          const filterData = [res].map(item => {
            item = { text: item.sampleName, value: item.sampleCode };
            return item;
          });
          this.setState(
            {
              tableData: [res],
              loading: false,
              filterData,
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
          const filterData = res.map(item => {
            item = { text: item.sampleName, value: item.sampleCode };
            return item;
          });
          console.log(filterData);
          this.setState(
            {
              tableData: res,
              loading: false,
              filterData,
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

  /**
   * 对获取到的表格数据增加标记
   */
  handleDataFormat = () => {
    const { tableData } = this.state;
    const list = [...tableData];
    list.forEach(item => {
      const fileCheckedLen = item.sampleProperties.filter(v => v.isChoose).length;
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

  /**
   * 点击多选框时， 设置多选框的状态，并渲染页面
   * @param {Object} e 多选框改变时的事件对象
   * @param {Object} row 当前行数据
   * @param {Object} item 每一个文件的信息
   * @param {Number} index 当前行号
   */
  handleCheckboxChange = (e, row, item, index) => {
    const { tableData } = this.state;
    let selectRow = tableData.filter(v => v.id === row.id);
    selectRow = selectRow[0];
    if (item) {
      selectRow.sampleProperties.forEach(i => {
        if (i.id === item.id) {
          i.isChoose = e.target.checked ? 1 : 0;
        }
      });
      const checkedLen = selectRow.sampleProperties.filter(r => r.isChoose).length;
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

  /**
   * 选则样品以及上传序列文件的弹框的显示和隐藏
   */
  toggleVis = v => {
    this.setState({
      visible: v,
    });
  };

  /**
   * 打开上传序列文件
   */
  openUpload = () => {
    this.setState({
      visible: true,
    });
  };

  /**
   * 点击选择样品弹框的确认
   */
  handleOk = () => {
    const { id } = this.props;
    this.props.handleOk();
    // 从这里发送数据过去
    const { tableData } = this.state;
    if (!id) {
      // 点击选择样品过来的。
      const checkedSample = tableData.filter(item => item.indeterminate || item.isChoose);
      this.props.sendData(checkedSample);
    } else {
      // 点击已选择文件过来的。
      this.props.sendData(tableData);
    }
  };

  /**
   * 接受子组件是否关闭弹框指令并根据情况进行相关操作
   */
  handleFileUploadClose = v => {
    this.toggleVis(v);
    if (v) {
      this.getTableData();
    }
  };

  render() {
    const { filterData, disabled } = this.state;
    const columns = [
      {
        title: '样品',
        width: 150,
        dataIndex: 'sampleName',
        key: 'sampleName',
        filters: filterData,
        onFilter: (value, record) => record.sampleCode.includes(value),
        render: (text, record, index) => (
          <div className={disabled ? 'project_manage_params_sample_choose_checkbox' : ''}>
            <Checkbox
              onChange={e => this.handleCheckboxChange(e, record, undefined, index)}
              indeterminate={record.indeterminate}
              checked={record.isChoose}
              disabled={disabled}
            >
              {text}
            </Checkbox>
          </div>
        ),
      },
      {
        title: '文件',
        dataIndex: 'sampleProperties',
        key: 'sampleProperties',
        ellipsis: true,

        render: (text, record, index) =>
          text.map(item => (
            <div
              key={item.fileId}
              className={classnames('project_manage_params_sample_choose_checkbox_style', {
                project_manage_params_sample_choose_checkbox: disabled,
              })}
            >
              {/* <Tooltip title={item.sequenceFileName} > */}
              <Checkbox
                onChange={e => this.handleCheckboxChange(e, record, item, index)}
                checked={item.isChoose}
                disabled={disabled}
              >
                {item.sequenceFileName}
              </Checkbox>
              {/* </Tooltip> */}
            </div>
          )),
      },
      {
        title: '序列',
        dataIndex: 'xulie',
        key: 'xulie',
        width: 180,
        ellipsis: true,
        render: (text, row) => (
          <div>
            {row.sampleProperties &&
              row.sampleProperties.length &&
              row.sampleProperties.map((item, index) => (
                <div className="project_manage_params_sample_choose_checkbox_style" key={index}>
                  {`${item.sampleSequenceCount} (${item.sampleLengthTotal}bp)`}
                </div>
              ))}
          </div>
        ),
      },
      {
        title: '长度',
        dataIndex: 'length',
        key: 'length',
        width: 130,
        ellipsis: true,
        render: (text, row) => (
          <div>
            {row.sampleProperties &&
              row.sampleProperties.length &&
              row.sampleProperties.map((item, index) => (
                <div className="project_manage_params_sample_choose_checkbox_style" key={index}>
                  {`${item.sampleLengthMin}-${item.sampleLengthMax} (avg ${item.sampleLengthAve})`}
                </div>
              ))}
          </div>
        ),
      },
    ];
    const { tableData, visible, loading } = this.state;
    return (
      <>
        <Modal
          width={871}
          bodyStyle={{ paddingTop: 10, height: 400, overflow: 'auto' }}
          title="选择样品"
          visible
          // onOk={() => this.props.handleOk(tableData)}
          onCancel={this.props.handleCancel}
          footer={
            !disabled && [
              <Button key="submit" type="primary" onClick={this.handleOk}>
                确认
              </Button>,
            ]
          }
        >
          {!disabled && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
              <Button type="primary" onClick={() => this.openUpload(true)}>
                <UploadOutlined /> 序列文件
              </Button>
            </div>
          )}
          <Table
            columns={columns}
            dataSource={tableData}
            pagination={false}
            loading={loading}
            size="small"
          />
          {visible && <FileUpload handleClose={this.handleFileUploadClose} />}
        </Modal>
      </>
    );
  }
}

export default SampleChoose;

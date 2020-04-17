import React from 'react';
import { Table, Popover, Button, Modal, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { SketchPicker } from 'react-color';
import { getrandomColor } from '@/utils/utils';

import SampleChoose from './components/SampleChoose';
import './index.less';

class SampleSelect extends React.Component {
  state = {
    visible: false,
    color: {
      r: '241',
      g: '112',
      b: '19',
      a: '1',
    },
    tableData: [],
  };

  componentDidMount() {
    this.getTableData();
  }

  getTableData = () => {
    let tableData = [
      {
        key: '1',
        name: 'John Brown',
        alia: '好的哈',
        sequence: 'New York No. 1 Lake Park',
        length: 3000 - 7000,
      },
      {
        key: '2',
        name: 'Jim Green',
        alia: '好的哈1',
        sequence: 'New York No. 1 Lake Park1',
        length: 3444 - 7000,
      },
      {
        key: '3',
        name: 'Joe Black',
        alia: '好的哈2',
        sequence: 'New York No. 1 Lake Park2',
        length: 5000 - 7000,
      },
    ];
    tableData = tableData.map(item => {
      item.color = getrandomColor();
      return item;
    });
    this.setState({
      tableData,
    });
  };

  handleDelete = () => {
    console.log(1111);
  };

  chooseSample = () => {
    this.setState({
      visible: true,
    });
  };

  handleClick = (record, index) => {
    const { tableData } = this.state;
    const row = { ...record };
    row.visible = !row.visible;
    const datas = [...tableData];
    datas[index] = row;
    this.setState({
      tableData: datas,
    });
  };

  handleChange = (color, record, index) => {
    const { tableData } = this.state;
    const row = { ...record };
    row.color = color.hex;
    row.visible = false;
    const datas = [...tableData];
    datas[index] = row;

    this.setState({
      tableData: datas,
    });
    // debugger;
  };

  handleOk = () => {
    this.toggleVis(false);
  };

  toggleVis = v => {
    this.setState({
      visible: v,
    });
  };

  handleCancel = () => {
    this.toggleVis(false);
  };

  saveData = (row, index) => {};

  // 查看已选择的
  viewSelected = () => {
    this.toggleVis(true);
  };

  render() {
    const { tableData, visible } = this.state;

    const columns = [
      {
        title: '样品',
        dataIndex: 'name',
        key: 'name',
        render: (text, record, index) => {
          return (
            <div style={{ display: 'flex' }}>
              <Popover
                overlayClassName="project_manage_sample_ui_select"
                overlayStyle={{ padding: 0 }}
                content={
                  <SketchPicker
                    color={record.color || this.state.color}
                    onChangeComplete={color => this.handleChange(color, record, index)}
                  />
                }
                trigger="click"
                placement="bottom"
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: record.color,
                    position: 'relative',
                  }}
                  onClick={() => {
                    this.handleClick(record, index);
                  }}
                />
              </Popover>
              {/* <div
                    style={{
                      position: 'absolute',
                      zIndex: '99999999999999999999999999999',
                      top: 24,
                    }}
                  >
                    {record.visible && (
                      
                    )}
                  </div> */}
              <div style={{ marginLeft: 10 }}>{text}</div>
            </div>
          );
        },
      },
      {
        title: '别名',
        dataIndex: 'alia',
        key: 'alia',
        render: (text, record, index) => {
          return (
            <div className="project_manage_sample_select_table_alia">
              <input
                type="text"
                defaultValue={text}
                onBlur={() => {
                  this.saveData(record, index);
                }}
              />
            </div>
          );
        },
      },
      {
        title: '序列',
        dataIndex: 'sequence',
        key: 'sequence',
      },
      {
        title: '长度',
        dataIndex: 'length',
        key: 'length',
      },
      {
        title: '文件',
        dataIndex: 'files',
        key: 'files',
        render: (text, record) => {
          return (
            <a
              onClick={() => {
                this.viewSelected(record);
              }}
            >
              已选{text || 0}个
            </a>
          );
        },
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <a
            onClick={() => {
              this.handleDelete(record);
            }}
          >
            删除
          </a>
          // <Popconfirm
          //   placement="topRight"
          //   title={text}
          //   onConfirm={() => this.handleDelete}
          //   okText="Yes"
          //   cancelText="No"
          // >

          // </Popconfirm>
        ),
      },
    ];

    return (
      <>
        <div className="project_manage_sample_select_table">
          <Table columns={columns} dataSource={tableData} pagination={false} />
        </div>
        <Button
          type="dashed"
          block
          onClick={this.chooseSample}
          style={{ marginTop: 20, position: 'static' }}
        >
          <PlusOutlined /> 选择样品
        </Button>
        {visible && <SampleChoose handleOk={this.handleOk} handleCancel={this.handleCancel} />}
      </>
    );
  }
}

export default SampleSelect;

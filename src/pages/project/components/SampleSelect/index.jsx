import React from 'react';
import { Table, Popconfirm, Button, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { SketchPicker } from 'react-color';
import { randomcolor } from '@/utils/utils';
import SampleChoose from './components/SampleChoose';

class SampleSelect extends React.Component {
  state = {
    visible: false,
    color: {
      r: '241',
      g: '112',
      b: '19',
      a: '1',
    },
    tableData: [
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
    ],
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
    row.color = color.rgb;
    row.visible = false;
    const datas = [...tableData];
    datas[index] = row;

    this.setState({
      tableData: datas,
    });
    // debugger;
  };

  handleOk = () => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
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
              <div
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: record.color
                    ? `rgb(${record.color.r},${record.color.g},${record.color.b}) `
                    : randomcolor(),
                  position: 'relative',
                }}
                onClick={() => {
                  this.handleClick(record, index);
                }}
              >
                <div style={{ position: 'absolute', zIndex: '9999999999999', top: 24 }}>
                  {record.visible && (
                    <SketchPicker
                      color={record.color || this.state.color}
                      onChangeComplete={color => this.handleChange(color, record, index)}
                    />
                  )}
                </div>
              </div>
              <div style={{ marginLeft: 10 }}>{text}</div>
            </div>
          );
        },
      },
      {
        title: '别名',
        dataIndex: 'alia',
        key: 'alia',
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
          return <a>已选{text || 0}个</a>;
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
        <Table columns={columns} dataSource={tableData} />
        <Button type="dashed" block onClick={this.chooseSample}>
          <PlusOutlined /> 选择样品
        </Button>
        <Modal
          title="选择样品"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={820}
        >
          <SampleChoose />
        </Modal>
      </>
    );
  }
}

export default SampleSelect;

import React from 'react';
import { Table, Popconfirm, Button, Modal, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { SketchPicker } from 'react-color';
import { randomcolor } from '@/utils/utils';
// import SampleChoose from './components/SampleChoose';
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

    columns: [
      {
        title: '样品',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '分组方案一',
        dataIndex: 'group1',
        key: 'group1',
        render: (text, record, index) => {
          return (
            <div style={{ display: 'flex' }}>
              <div>{text}</div>
              <div style={{ width: 20, height: 20, backgroundColor: '3' }} />
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
    ],
  };

  add = () => {
    const { columns } = this.state;
    const cls = [
      ...columns,
      { title: '分组方案', dataIndex: 'arr1', key: 'xx', render: () => <Input /> },
    ];
    this.setState({
      columns: cls,
    });
  };

  render() {
    const { tableData, visible, columns } = this.state;

    return (
      <>
        <Button onClick={this.add}>新增</Button>
        <Table columns={columns} dataSource={tableData} pagination={false} />
        <Button type="dashed" block onClick={this.chooseSample} style={{ marginTop: 20 }}>
          <PlusOutlined /> 选择样品
        </Button>
        <Modal
          title="选择样品"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={820}
        >
          {/* <SampleChoose /> */}
        </Modal>
      </>
    );
  }
}

export default SampleSelect;

import React from 'react';
import { Table, Popconfirm, Button, Modal, Input } from 'antd';
import { PlusOutlined, CloseOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { SketchPicker } from 'react-color';
import { randomcolor } from '@/utils/utils';

// import SampleChoose from './components/SampleChoose';
import './index.less';

class SampleSelect extends React.Component {
  state = {
    visible: false,

    tableData: [
      {
        key: '1',
        sample: '样品1',
        name: 'John Brown',
        age: '好的哈',
        address: 'New York No. 1 Lake Park',
        // length: 3000 - 7000,
      },
      {
        key: '2',
        sample: '样品2',
        name: 'Jim Green',
        age: '好的哈1',
        address: 'New York No. 1 Lake Park1',
        // length: 3444 - 7000,
      },
      {
        key: '3',
        sample: '样品3',
        name: 'Joe Black',
        age: '好的哈2',
        address: 'New York No. 1 Lake Park2',
        // length: 5000 - 7000,
      },
    ],

    headers: [],
    columns: [],
  };

  componentDidMount() {
    const headers = [
      {
        field: 'name',
        title: '姓名',
      },
      {
        field: 'age',
        title: '年龄',
      },
      {
        field: 'address',
        title: '地址',
      },
    ];
    this.setState({
      headers,
    });

    const firstColumn = {
      title: '样品',
      dataIndex: 'sample',
      key: 'sample',
    };
    const lastColumn = {
      title: () => {
        return <PlusSquareOutlined onClick={this.add} />;
      },
      dataIndex: 'add',
      key: 'add',
    };

    const columns = [firstColumn, ...this.formatHeader(headers), lastColumn];
    this.setState({
      columns,
    });
  }

  removeColumn = e => {
    const { headers } = this.state;
    console.log(e);
    console.log(headers);
    console.log(this.state.columns);
    const headerArr = headers.filter(item => {
      return item.field !== e.field;
    });

    this.setState(
      {
        headers: headerArr,
      },
      () => {
        const hds = this.state.headers;
        const firstColumn = {
          title: '样品',
          dataIndex: 'sample',
          key: 'sample',
        };
        const lastColumn = {
          title: () => {
            return <PlusSquareOutlined onClick={this.add} />;
          },
          dataIndex: 'add',
          key: 'add',
        };
        const columns = [firstColumn, ...this.formatHeader(hds), lastColumn];
        this.setState({
          columns,
        });
      },
    );
  };

  handleBlur = () => {
    // alert(111);
  };

  formatHeader = headers => {
    const groups = headers.map(e => {
      return {
        title: () => {
          return (
            <div className="project_manage_UI_sample_group_title">
              <input defaultValue={e.title} onBlur={this.handleBlur} />

              <CloseOutlined onClick={() => this.removeColumn(e)} />
            </div>
          );
        },
        dataIndex: `${e.field}`,
        key: `${e.field}`,
        render: (text, record, input) => {
          return <Input />;
        },
      };
    });

    return groups;
  };

  setTitle = () => {};

  add = () => {
    const { columns, headers } = this.state;
    const addheader = { field: Date.now(), title: '分组方案' };
    this.setState(
      {
        // columns: cls,
        headers: [...headers, addheader],
      },
      () => {
        const hds = this.state.headers;
        const firstColumn = {
          title: '样品',
          dataIndex: 'sample',
          key: 'sample',
        };
        const lastColumn = {
          title: () => {
            return <PlusSquareOutlined onClick={this.add} />;
          },
          dataIndex: 'add',
          key: 'add',
        };
        const cls = [firstColumn, ...this.formatHeader(hds), lastColumn];
        this.setState({
          columns: cls,
        });
      },
    );
  };

  render() {
    const { tableData, visible, headers, columns } = this.state;
    console.log(this.formatHeader(headers));
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

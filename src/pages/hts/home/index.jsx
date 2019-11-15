import React from 'react';
import { Form, Input, Card, Table, Button, Badge } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
// import * as d3 from 'd3';
// import echarts from 'echarts';

class TableTwo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data.list,
      columns: [],
    };
  }

  componentDidMount() {
    const columns = [
      { title: 'Date', dataIndex: 'date', key: 'date' },
      { title: 'Name', dataIndex: 'name', key: 'name' },
      {
        title: 'Status',
        key: 'state',
        render: () => (
          <span>
            <Badge status="success" />
            Finished
          </span>
        ),
      },
      { title: 'Upgrade Status', dataIndex: 'upgradeNum', key: 'upgradeNum' },
      {
        title: 'Action',
        dataIndex: 'operation',
        key: 'operation',
        render: () => (
          <span className="table-operation">
            <a>修改 </a>
          </span>
        ),
      },
    ];

    this.setState({
      columns,
    });
  }

  addRow = () => {
    console.log('addRow');
  }

  render() {
    const { data, columns } = this.state;
    return (
      <>
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
        />
        <div style={{ marginLeft: -16, marginRight: -16 }}>
          <Button
            style={{ width: '100%', marginTop: 32 }}
            type="dashed"
            onClick={this.addRow}
            icon="plus"
          >
            新增
          </Button>
        </div>
      </>
    );
  }
}

const EditableContext = React.createContext();

class EditableCell extends React.Component {
  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      editOptions,
      ...restProps
    } = this.props;

    let initialValue;
    if (editing) {
      initialValue = record[dataIndex];
    }

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item>
            {getFieldDecorator(dataIndex, {
              initialValue,
              ...editOptions,
            })(inputType)}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
  }
}

class TableOne extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      columns: [],
      editIndex: -1,
    };
  }

  componentDidMount() {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        editable: true,
        inputType: <Input />,
        editOptions: {
          rules: [
            { required: true },
          ],
        },
      },
      { title: 'Platform', dataIndex: 'platform', key: 'platform' },
      { title: 'Version', dataIndex: 'version', key: 'version' },
      { title: 'Upgraded', dataIndex: 'upgradeNum', key: 'upgradeNum' },
      { title: 'Creator', dataIndex: 'creator', key: 'creator' },
      { title: 'Date', dataIndex: 'createdAt', key: 'createdAt' },
      { title: 'Action', key: 'operation', render: () => <a>修改</a> },
    ];

    const data = [];
    for (let i = 0; i < 3; ++i) {
      const list = [];
      for (let x = 0; x < 3; ++x) {
        list.push({
          key: `${i}-${x}`,
          date: '2014-12-24 23:12:00',
          name: 'This is production name',
          upgradeNum: 'Upgraded: 56',
        });
      }

      data.push({
        key: i,
        name: 'Screem',
        platform: 'iOS',
        version: '10.3.4.5654',
        upgradeNum: 500,
        creator: 'Jack',
        createdAt: '2014-12-24 23:12:00',
        list,
      });
    }

    this.setState({
      data,
      columns,
    });
  }

  addRow = () => {
    const { data, editIndex } = this.state;
    if (editIndex !== -1) {
      // eslint-disable-next-line no-alert
      window.alert('请先保存正在编辑的数据');
      return;
    }
    const newData = [
      ...data,
      {
        key: Math.random(),
      },
    ];
    this.setState({
      editIndex: newData.length - 1,
      data: newData,
    });
  }

  tableTwoF = record => <TableTwo data={record} form={this.props.form}></TableTwo>

  render() {
    const { data } = this.state;
    const components = {
      body: {
        cell: EditableCell,
      },
    };

    const columns = this.state.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record, rowIndex) => ({
          record,
          editOptions: col.editOptions,
          inputType: col.inputType,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: rowIndex === this.state.editIndex,
        }),
      };
    });

    return (
      <PageHeaderWrapper>
        <Card>
          <EditableContext.Provider value={this.props.form}>
            <Table
              components={components}
              columns={columns}
              expandedRowRender={this.tableTwoF}
              dataSource={data}
              defaultExpandAllRows
              pagination={false}
            />
            <Button
              style={{ width: '100%', marginTop: 16 }}
              type="dashed"
              onClick={this.addRow}
              icon="plus"
            >
              新增
            </Button>
          </EditableContext.Provider>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(TableOne);

import {
  Button,
  Table,
  Input,
  Divider,
  Form,
} from 'antd';
import React from 'react';

import ChooseInvoiceParty from '@/components/choosse/InvoiceParty';

const { Search } = Input;
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

@Form.create()
class InvoiceParty extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editIndex: -1,
      id: 0,
    };
  }

  addRow = () => {
    const { tableData } = this.props;
    let { id } = this.state;
    const newId = --id;

    const newTableData = [...tableData, { id: newId }];

    this.setStore(newTableData);
    this.setState({ editIndex: newTableData.length - 1, id: newId });
  }

  deleteRow = index => {
    const { tableData } = this.props;
    const newTableData = tableData.filter((e, i) => i !== index);
    this.setStore(newTableData);
  }

  cancel = row => {
    if (row.id < 0) {
      const { tableData } = this.props;

      const newTableData = tableData.filter(e => e.id !== row.id);

      this.setStore(newTableData);
    }
    this.setState({ editIndex: -1 });
  };

  save = index => {
    this.props.form.validateFields((error, row) => {
      if (error) return;
      const { tableData } = this.props;

      const newTableData = tableData.map((e, i) => {
        if (i === index) return { ...e, ...row };
        return e;
      });

      this.setStore(newTableData);
      this.setState({ editIndex: -1 });
    });
  }

  setStore = newTableData => {
    const { tableKey, valueChange } = this.props;
    valueChange(tableKey, newTableData);
  }

  edit = index => {
    this.setState({ editIndex: index });
  }

  selectChooseModalData = row => {
    const { editIndex } = this.state;
    const { tableData } = this.props;

    const newTableData = tableData.map((e, i) => {
      if (i === editIndex) return { ...e, ...row };
      return e;
    });
    this.setStore(newTableData);
  }

  render() {
    const { tableData } = this.props;
    const components = {
      body: {
        cell: EditableCell,
      },
    };

    let columns = [
      {
        title: '名称',
        dataIndex: 'name',
        width: '40%',
        editable: true,
        inputType: <Search onSearch={() => this.ChooseInvoiceParty.changeVisible(true)} />,
        editOptions: {
          rules: [
            { required: true },
          ],
        },
      },
      {
        title: '售达方',
        dataIndex: 'soldToPartyName',
        width: '40%',
        editable: true,
        inputType: <Input />,
        editOptions: {
          rules: [
            { required: true },
          ],
        },
      },
      {
        title: '操作',
        dataIndex: 'actions',
        render: (text, record, index) => {
          const { editIndex } = this.state;
          const editable = editIndex === index;
          if (editable) {
            return (
              <>
                <a onClick={() => this.save(index)}>保存</a>
                <Divider type="vertical" />
                <a onClick={() => this.cancel(record)}>取消</a>
              </>
            );
          }

          return (
            <>
              <a onClick={() => this.deleteRow(index)}>删除</a>
              <Divider type="vertical" />
              <a onClick={() => this.edit(index)}>修改</a>
            </>
          );
        },
      },
    ];

    columns = columns.map(col => {
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
      <EditableContext.Provider value={this.props.form}>
        <Table
          rowKey="id"
          components={components}
          dataSource={tableData}
          columns={columns}
          rowClassName="editable-row"
          pagination={false}
        />
        <Button
          style={{
            width: '100%',
            marginTop: 16,
            marginBottom: 8,
          }}
          type="dashed"
          onClick={this.addRow}
          icon="plus"
        >
          新增
        </Button>
        <ChooseInvoiceParty
          ref={ref => { this.ChooseInvoiceParty = ref }}
          selectChooseModalData={this.selectChooseModalData}
        />
      </EditableContext.Provider>
    );
  }
}

export default InvoiceParty;

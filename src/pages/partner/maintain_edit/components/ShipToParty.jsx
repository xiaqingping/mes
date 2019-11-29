/**
 * 客户 销售范围 送达方
 */
import { Button, Table, Input, Divider, Form, message } from 'antd';
import React from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';

import ChooseShipToParty from '@/components/choosse/bp/ShipToParty';

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
class ShipToParty extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editIndex: -1,
      id: 0,
    };
  }

  addRow = () => {
    const { tableData } = this.props;
    const { id } = this.state;
    const newId = id - 1;

    const newTableData = [...tableData, { id: newId }];

    this.setStore(newTableData);
    this.setState({ editIndex: newTableData.length - 1, id: newId });
  };

  deleteRow = index => {
    const { tableData } = this.props;
    const newTableData = tableData.filter((e, i) => i !== index);
    this.setStore(newTableData);
  };

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
  };

  setStore = newTableData => {
    const { tableKey, valueChange } = this.props;
    valueChange(tableKey, newTableData);
  };

  edit = index => {
    this.setState({ editIndex: index });
  };

  selectChooseModalData = row => {
    const { editIndex } = this.state;
    const { tableData } = this.props;
    const has = tableData.some(e => e.id === row.id);

    if (has) {
      message.warning('送达方重复');
      return;
    }

    const newTableData = tableData.map((e, i) => {
      if (i === editIndex) return { ...e, ...row };
      return e;
    });
    this.setStore(newTableData);
  };

  searchShipToParty = () => {
    this.ChooseShipToParty.wrappedInstance.changeVisible(true);
  };

  render() {
    const { tableData } = this.props;
    const components = {
      body: {
        cell: EditableCell,
      },
    };
    let columns = [
      {
        title: formatMessage({ id: 'bp.maintain_details.name' }),
        dataIndex: 'name',
        width: '40%',
        editable: true,
        inputType: <Search readOnly onSearch={this.searchShipToParty} />,
        editOptions: {
          rules: [{ required: true }],
        },
      },
      {
        title: '状态',
        dataIndex: 'linkVerifyStatus',
        width: '40%',
      },
      {
        title: formatMessage({ id: 'bp.maintain_details.operation' }),
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
          <FormattedMessage id="bp.maintain_details.add" />
        </Button>
        <ChooseShipToParty
          ref={ref => {
            this.ChooseShipToParty = ref;
          }}
          selectChooseModalData={this.selectChooseModalData}
        />
      </EditableContext.Provider>
    );
  }
}

export default ShipToParty;

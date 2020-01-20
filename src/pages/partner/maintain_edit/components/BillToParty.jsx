/**
 * 客户 销售范围 收票方
 */
import { Button, Table, Input, Divider, Form, message } from 'antd';
import React from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { formatter } from '@/utils/utils';
import ChooseBillToParty from '@/components/choosse/bp/BillToParty';

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
@connect(({ bp, bpEdit }) => {
  const { details = {} } = bpEdit;
  return {
    basic: details.basic,
    VerifyRecordStatus: bp.VerifyRecordStatus,
  };
})
class BillToParty extends React.Component {
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
      message.warning('收票方重复');
      return;
    }
    // if (row.certificationStatus !== 4) {
    //   message.warning('只能选择已认证的数据');
    //   return;
    // }

    const newTableData = tableData.map((e, i) => {
      if (i === editIndex) return { ...e, ...row };
      return e;
    });
    this.setStore(newTableData);
  };

  // 根据row判断是否禁止选择此数据
  disabledChoose = row => row.certificationStatus !== 4;

  searchBillToParty = () => {
    this.ChooseBillToParty.wrappedInstance.changeVisible(true);
  };

  render() {
    const { tableData, VerifyRecordStatus, basic } = this.props;
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
        inputType: <Search readOnly onSearch={this.searchBillToParty} />,
        editOptions: {
          rules: [{ required: true }],
        },
      },
      {
        title: formatMessage({ id: 'bp.maintain_details.sales_distribution.sold_to_party' }),
        dataIndex: 'soldToPartyName',
        width: '30%',
      },
      {
        title: formatMessage({ id: 'bp.maintain_details.status' }),
        dataIndex: 'verifyStatus',
        width: '10%',
        render: text => formatMessage({ id: formatter(VerifyRecordStatus, text, 'value', 'i18n') }),
      },
      {
        title: formatMessage({ id: 'action.operation' }),
        dataIndex: 'actions',
        render: (text, record, index) => {
          const { editIndex } = this.state;
          const editable = editIndex === index;

          // 不能删除和修改自己
          if (basic.id && basic.id === record.id) return null;

          if (editable) {
            return (
              <>
                <a onClick={() => this.save(index)}>
                  <FormattedMessage id="action.save" />
                </a>
                <Divider type="vertical" />
                <a onClick={() => this.cancel(record)}>
                  <FormattedMessage id="action.cancel" />
                </a>
              </>
            );
          }

          return (
            <>
              <a onClick={() => this.deleteRow(index)}>
                <FormattedMessage id="action.delete" />
              </a>
              <Divider type="vertical" />
              <a onClick={() => this.edit(index)}>
                <FormattedMessage id="action.change" />
              </a>
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
          <FormattedMessage id="action.add" />
        </Button>
        <ChooseBillToParty
          ref={ref => {
            this.ChooseBillToParty = ref;
          }}
          selectChooseModalData={this.selectChooseModalData}
          disabledChoose={this.disabledChoose}
        />
      </EditableContext.Provider>
    );
  }
}

export default BillToParty;

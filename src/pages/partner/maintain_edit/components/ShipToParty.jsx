/**
 * 客户 销售范围 送达方
 */
import { Button, Table, Input, Divider, Form, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { formatter } from '@/utils/utils';

import ChooseShipToParty from '@/components/choosse/bp/ShipToParty';

const { Search } = Input;

const EditableCell = props => {
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
  } = props;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item name={dataIndex} {...editOptions}>
          {inputType}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

@connect(({ bp, bpEdit }) => {
  const { details = {} } = bpEdit;
  return {
    basic: details.basic,
    VerifyRecordStatus: bp.VerifyRecordStatus,
  };
})
class ShipToParty extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editIndex: -1,
      id: 0,
    };
    this.formRef = React.createRef();
    this.ChooseShipToParty = React.createRef();
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
    this.formRef.current
      .validateFields()
      .then(row => {
        const { tableData } = this.props;

        const newTableData = tableData.map((e, i) => {
          if (i === index) return { ...e, ...row };
          return e;
        });

        this.setStore(newTableData);
        this.setState({ editIndex: -1 });
      })
      .catch(err => {
        console.log(err);
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
    this.formRef.current.setFieldsValue(newTableData[editIndex]);
    this.setStore(newTableData);
  };

  searchShipToParty = () => {
    this.ChooseShipToParty.current.changeVisible(true);
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
        inputType: <Search readOnly onSearch={this.searchShipToParty} />,
        editOptions: {
          rules: [{ required: true }],
        },
      },
      {
        title: formatMessage({ id: 'bp.maintain_details.status' }),
        dataIndex: 'verifyStatus',
        width: '40%',
        render: text => formatter(VerifyRecordStatus, text, 'value', 'text'),
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
      <Form ref={this.formRef}>
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
          icon={<PlusOutlined />}
        >
          <FormattedMessage id="action.add" />
        </Button>
        <ChooseShipToParty
          ref={this.ChooseShipToParty}
          selectChooseModalData={this.selectChooseModalData}
        />
      </Form>
    );
  }
}

export default ShipToParty;

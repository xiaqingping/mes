/**
 * 客户 销售范围 销售员
 */
import { Button, Table, Input, Divider, Form, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';

import ChooseSalesPerson from '@/components/choosse/bp/SalesPerson';

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

class SalesPerson extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editIndex: -1,
      id: 0,
    };
    this.formRef = React.createRef();
    this.ChooseSalesPerson = React.createRef();
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
    const has = tableData.some(e => e.code === row.code);

    if (has) {
      message.warning('销售员重复');
      return;
    }

    const newTableData = tableData.map((e, i) => {
      if (i === editIndex) return { ...e, ...row };
      return e;
    });
    this.formRef.current.setFieldsValue(newTableData[editIndex]);
    this.setStore(newTableData);
  };

  searchSalesPerson = () => {
    this.ChooseSalesPerson.current.changeVisible(true);
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
        width: '80%',
        editable: true,
        inputType: <Search readOnly onSearch={this.searchSalesPerson} />,
        editOptions: {
          rules: [{ required: true }],
        },
      },
      {
        title: formatMessage({ id: 'action.operation' }),
        dataIndex: 'actions',
        render: (text, record, index) => {
          const { editIndex } = this.state;
          const editable = editIndex === index;
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
        <ChooseSalesPerson
          ref={this.ChooseSalesPerson}
          selectChooseModalData={this.selectChooseModalData}
        />
      </Form>
    );
  }
}

export default SalesPerson;

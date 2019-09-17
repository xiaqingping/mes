import {
  Button,
  Table,
  Input,
  InputNumber,
  Divider,
  Form,
} from 'antd';
import React from 'react';

import { MobileTelephoneInput } from '@/components/CustomizedFormControls'

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
      rules,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item>
            {getFieldDecorator(dataIndex, {
              rules,
              initialValue: record[dataIndex],
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

class EditableTable extends React.Component {
  static getDerivedStateFromProps(props) {
    if ('value' in props) {
      return {
        data: props.value.data || [],
        editIndex: typeof props.value.editIndex === 'number' ? props.value.editIndex : -1,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    const value = props.value || {};
    this.state = {
      data: value.data,
      editIndex: value.editIndex || -1,
    };
    this.columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        width: '15%',
        editable: true,
        inputType: <Input />,
        rules: [
          { required: true },
        ],
      },
      {
        title: '移动电话',
        dataIndex: 'telephone',
        width: '20%',
        editable: true,
        inputType: <MobileTelephoneInput />,
        rules: [
          { required: true },
        ],
      },
      {
        title: '邮编',
        dataIndex: 'postcode',
        width: '10%',
        editable: true,
        inputType: <InputNumber />,
        rules: [
          { required: true },
        ],
      },
      {
        title: '地址',
        dataIndex: 'address',
        width: '35%',
        editable: true,
        inputType: <Input />,
        rules: [
          { required: true },
        ],
      },
      {
        title: '操作',
        dataIndex: 'actions',
        width: '10%',
        render: (text, record, index) => {
          const { editIndex } = this.state;
          const editable = editIndex === index;
          if (editable) {
            return (
              <>
                <a onClick={() => this.save(index)}>保存</a>
                <Divider type="vertical" />
                <a onClick={() => this.cancel(index)}>取消</a>
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
  }

  valueChange = changedValue => {
    const { onChange } = this.props;
    if (onChange) {
      onChange({
        ...this.state,
        ...changedValue,
      });
    }
  };

  addRow = () => {
    const { data } = this.state;
    data.push({
      id: -1,
    });
    this.valueChange({ data, editIndex: data.length - 1 });
  }

  deleteRow = index => {
    const { data } = this.state;
    data.splice(index, 1);
    this.valueChange({ data });
  }

  cancel = () => {
    this.valueChange({ editIndex: -1 });
  };

  save = index => {
    this.props.form.validateFields((error, row) => {
      if (error) return;
      const data = [...this.state.data];
      const item = data[index];
      data.splice(index, 1, {
        ...item,
        ...row,
      });
      this.valueChange({
        data,
        editIndex: -1,
      });
    });
  }

  edit(index) {
    this.valueChange({ editIndex: index });
  }

  render() {
    const components = {
      body: {
        cell: EditableCell,
      },
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record, rowIndex) => ({
          record,
          rules: col.rules,
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
          dataSource={this.state.data}
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
      </EditableContext.Provider>
    );
  }
}

export default Form.create()(EditableTable);

import {
  Button,
  Table,
  Input,
  InputNumber,
  Popconfirm,
  Form,
} from 'antd';
import React from 'react';

import { MobileTelephoneInput } from '@/components/CustomizedFormControls'

const data = [];
for (let i = 0; i < 5; i++) {
  data.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    telephone: 18735818888,
    postcode: 123456,
    address: `London Park no. ${i}`,
  });
}
const EditableContext = React.createContext();

class EditableCell extends React.Component {
  getInput = () => {
    const { inputType } = this.props;
    if (inputType === 'number') {
      return <InputNumber />;
    }
    if (inputType === 'mobile') {
      return <MobileTelephoneInput onChange={ val => console.log('change', val) } />;
    }
    return <Input />;
  };

  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `${title}必填!`,
                },
              ],
              initialValue: record[dataIndex],
            })(this.getInput())}
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
  constructor(props) {
    super(props);
    this.state = { data, editingKey: '' };
    this.columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        width: '15%',
        editable: true,
        inputType: 'input',
      },
      {
        title: '移动电话',
        dataIndex: 'telephone',
        width: '20%',
        editable: true,
        inputType: 'mobile',
      },
      {
        title: '邮编',
        dataIndex: 'postcode',
        width: '10%',
        editable: true,
        inputType: 'input',
      },
      {
        title: '地址',
        dataIndex: 'address',
        width: '35%',
        editable: true,
        inputType: 'input',
      },
      {
        title: '操作',
        dataIndex: 'actions',
        width: '10%',
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {form => (
                  <a
                    onClick={() => this.save(form, record.key)}
                    style={{ marginRight: 8 }}
                  >
                    保存
                  </a>
                )}
              </EditableContext.Consumer>
              <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.key)}>
                <a>取消</a>
              </Popconfirm>
            </span>
          ) : (
            <a disabled={editingKey !== ''} onClick={() => this.edit(record.key)}>
              编辑
            </a>
          );
        },
      },
    ];
  }

  isEditing = record => record.key === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({ data: newData, editingKey: '' });
      } else {
        newData.push(row);
        this.setState({ data: newData, editingKey: '' });
      }
    });
  }

  edit(key) {
    this.setState({ editingKey: key });
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
        onCell: record => ({
          record,
          inputType: col.inputType,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    return (
      <EditableContext.Provider value={this.props.form}>
        <Table
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
          onClick={this.newAddress}
          icon="plus"
        >
          新增
        </Button>
      </EditableContext.Provider>
    );
  }
}

export default Form.create()(EditableTable);

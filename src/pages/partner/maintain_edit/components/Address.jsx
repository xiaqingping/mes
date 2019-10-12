import {
  Button,
  Table,
  Input,
  InputNumber,
  Divider,
  Form,
} from 'antd';
import React from 'react';
import { connect } from 'dva';

import { MobilePhoneInput } from '@/components/CustomizedFormControls'

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
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item>
            {getFieldDecorator(dataIndex, {
              initialValue: record[dataIndex],
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

@connect(({ partnerMaintainEdit }) => ({
  details: partnerMaintainEdit.details,
}))
class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editIndex: -1,
    }
    this.columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        width: '15%',
        editable: true,
        inputType: <Input />,
        editOptions: {
          rules: [
            { required: true },
          ],
        },
      },
      {
        title: '移动电话',
        dataIndex: 'phone',
        width: '20%',
        editable: true,
        inputType: <MobilePhoneInput />,
        editOptions: {
          rules: [
            { required: true },
          ],
        },
        render(text) {
          if (typeof text === 'object') {
            return text.mobilePhoneCountryCode + text.mobilePhone;
          }
          return text;
        },
      },
      {
        title: '邮编',
        dataIndex: 'postCode',
        width: '10%',
        editable: true,
        inputType: <InputNumber />,
        editOptions: {
          rules: [
            { required: true },
          ],
        },
      },
      {
        title: '地址',
        dataIndex: 'address',
        width: '35%',
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
        width: '10%',
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
  }

  addRow = () => {
    const { details } = this.props;
    const { addressList } = details;

    const data = [...addressList, { id: -1 }]
    this.props.dispatch({
      type: 'partnerMaintainEdit/setDetails',
      payload: { ...details, addressList: data },
    });
    this.setState({ editIndex: data.length - 1 });
  }

  deleteRow = index => {
    const { details } = this.props;
    const { addressList } = details;

    const data = addressList.filter((e, i) => i !== index);
    this.props.dispatch({
      type: 'partnerMaintainEdit/setDetails',
      payload: { ...details, addressList: data },
    });
  }

  cancel = row => {
    if (row.id < 0) {
      const { details } = this.props;
      const { addressList } = details;

      const data = addressList.filter(e => e.id !== row.id);
      this.props.dispatch({
        type: 'partnerMaintainEdit/setDetails',
        payload: { ...details, addressList: data },
      });
    }
    this.setState({ editIndex: -1 });
  };

  save = index => {
    this.props.form.validateFields((error, row) => {
      if (error) return;
      const { details } = this.props;
      const { addressList } = details;

      const data = addressList.map((e, i) => {
        if (i === index) return { ...e, ...row };
        return e;
      });
      this.props.dispatch({
        type: 'partnerMaintainEdit/setDetails',
        payload: { ...details, addressList: data },
      });
      console.log({ ...details, addressList: data });
      this.setState({ editIndex: -1 });
    });
  }

  edit(index) {
    this.setState({ editIndex: index });
  }

  render() {
    const { addressList } = this.props.details;
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
          dataSource={addressList}
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

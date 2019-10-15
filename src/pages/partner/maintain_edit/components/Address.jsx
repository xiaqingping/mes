import {
  Button,
  Table,
  Input,
  InputNumber,
  Divider,
  Form,
  Card,
} from 'antd';
import React from 'react';
import { connect } from 'dva';

import { MobilePhoneInput, AddressInput } from '@/components/CustomizedFormControls'

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
      if (dataIndex === 'mobilePhone') {
        initialValue = {
          mobilePhone: record.mobilePhone,
          mobilePhoneCountryCode: record.mobilePhoneCountryCode,
        }
      }
      if (dataIndex === 'address') {
        initialValue = {
          countryCode: record.countryCode,
          provinceCode: record.provinceCode,
          cityCode: record.cityCode,
          countyCode: record.countyCode,
          streetCode: record.streetCode,
          address: record.address,
        }
      }
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

@connect(({ partnerMaintainEdit }) => ({
  details: partnerMaintainEdit.details || {},
  addressList: (partnerMaintainEdit.details && partnerMaintainEdit.details.addressList) || [],
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
        dataIndex: 'mobilePhone',
        width: '20%',
        editable: true,
        inputType: <MobilePhoneInput />,
        editOptions: {
          rules: [
            { required: true },
          ],
        },
        render(text, record) {
          return record.mobilePhoneCountryCode + record.mobilePhone;
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
        inputType: <AddressInput onChange={value => this.valueChange('address', value)} />,
        editOptions: {
          rules: [
            { required: true },
          ],
        },
        render: (text, record) => {
          const addressList = [
            record.countryName,
            record.provinceName,
            record.cityName,
            record.countyName,
            record.streetName,
            record.address,
          ];
          return addressList.filter(e => e).join(' ');
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

  valueChange = (key, value) => {
    if (key === 'address') {
      this.props.form.setFieldsValue({
        address: value,
      });
    }
  }

  addRow = () => {
    const { details, addressList } = this.props;

    const data = [...addressList, { id: -1 }];
    this.props.dispatch({
      type: 'partnerMaintainEdit/setDetails',
      payload: { ...details, addressList: data },
    });
    this.setState({ editIndex: data.length - 1 });
  }

  deleteRow = index => {
    const { details, addressList } = this.props;

    const data = addressList.filter((e, i) => i !== index);
    this.props.dispatch({
      type: 'partnerMaintainEdit/setDetails',
      payload: { ...details, addressList: data },
    });
  }

  cancel = row => {
    if (row.id < 0) {
      const { details, addressList } = this.props;

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
      const { details, addressList } = this.props;

      const data = addressList.map((e, i) => {
        if (i === index) return { ...e, ...row, ...row.mobilePhone, ...row.address };
        return e;
      });
      this.props.dispatch({
        type: 'partnerMaintainEdit/setDetails',
        payload: { ...details, addressList: data },
      });
      this.setState({ editIndex: -1 });
    });
  }

  edit(index) {
    this.setState({ editIndex: index });
  }

  render() {
    const { addressList } = this.props;
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
      <Card title="收货地址" bordered={false}>
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
      </Card>
    );
  }
}

export default Form.create()(EditableTable);

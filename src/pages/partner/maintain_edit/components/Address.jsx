/**
 * 客户 收货地址
 */
import { Button, Table, Input, Divider, Form, Card } from 'antd';
import React from 'react';
import { connect } from 'dva';
import debounce from 'lodash/debounce';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { validateForm, formatter } from '@/utils/utils';

import { MobilePhoneInput, AddressInput } from '@/components/CustomizedFormControls';

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
        };
      }
      if (dataIndex === 'address') {
        initialValue = {
          countryCode: record.countryCode,
          provinceCode: record.provinceCode,
          cityCode: record.cityCode,
          countyCode: record.countyCode,
          streetCode: record.streetCode,
          address: record.address,
        };
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

@connect(({ basicCache, bpEdit }) => {
  const details = bpEdit.details || {};
  const customer = details.customer || {};
  const addressList = customer.addressList || [];

  // 基础数据
  // 国家拨号代码
  const { countryDiallingCodes } = basicCache;
  return { countryDiallingCodes, details, customer, addressList };
})
class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editIndex: -1,
      id: 0,
    };

    // 防抖
    this.checkAddress = debounce(this.checkAddress, 800);
  }

  checkAddress = (rule, value, callback) => {
    const { address, changedValue = {} } = value;
    const { option = [] } = changedValue;
    if (option.length > 0) {
      const last = option[option.length - 1];
      if (last.isMustLow === 1 && last.level !== 5) {
        callback('必须选择下一级');
        return;
      }
    }
    if (!address) {
      callback('详细地址必填');
      return;
    }
    callback();
  };

  valueChange = (key, value) => {
    if (key === 'address') {
      const { changedValue, ...excludeChangeValue } = value;
      this.props.form.setFieldsValue({
        address: excludeChangeValue,
      });
    }
  };

  addRow = async () => {
    const { id, editIndex } = this.state;
    const { addressList } = this.props;
    const newId = id - 1;

    if (editIndex !== -1) {
      const validateResult = await validateForm(this.props.form);
      if (!validateResult[0]) return false;
    }

    const newAddressList = [...addressList, { id: newId }];

    this.setStore(newAddressList);
    this.setState({ editIndex: newAddressList.length - 1, id: newId });
    return true;
  };

  deleteRow = index => {
    const { addressList } = this.props;
    const newAddressList = addressList.filter((e, i) => i !== index);
    this.setStore(newAddressList);
  };

  cancel = row => {
    if (row.id < 0) {
      const { addressList } = this.props;

      const newAddressList = addressList.filter(e => e.id !== row.id);

      this.setStore(newAddressList);
    }
    this.setState({ editIndex: -1 });
  };

  save = async index => {
    const validateResult = await validateForm(this.props.form);
    if (!validateResult[0]) return false;

    const row = validateResult[1];
    // address中排除掉changedValue，不要把此数据赋值给地址
    const { address } = row;
    const { changedValue, ...otherAddress } = address;
    const { addressList } = this.props;

    const newAddressList = addressList.map((e, i) => {
      if (i === index) {
        return { ...e, ...row, ...row.mobilePhone, ...otherAddress };
      }
      return e;
    });

    this.setStore(newAddressList);
    this.setState({ editIndex: -1 });
    return true;
  };

  setStore = newAddressList => {
    const { details, customer } = this.props;

    const newCustomer = { ...customer, ...{ addressList: newAddressList } };
    const newDetails = { ...details, ...{ customer: newCustomer } };

    this.props.dispatch({
      type: 'bpEdit/setState',
      payload: {
        type: 'details',
        data: newDetails,
      },
    });
  };

  edit = index => {
    this.setState({ editIndex: index });
  };

  getColumns = () => {
    const { countryDiallingCodes } = this.props;
    const columns = [
      {
        title: formatMessage({ id: 'bp.maintain_details.name' }),
        dataIndex: 'name',
        width: '15%',
        editable: true,
        inputType: <Input />,
        editOptions: {
          rules: [{ required: true }],
        },
      },
      {
        title: formatMessage({ id: 'bp.maintain_details.mobile_phone' }),
        dataIndex: 'mobilePhone',
        width: '20%',
        editable: true,
        inputType: <MobilePhoneInput />,
        editOptions: {
          rules: [{ required: true }],
        },
        render(text, record) {
          const diallingCode = formatter(
            countryDiallingCodes,
            record.mobilePhoneCountryCode,
            'countryCode',
            'diallingCode',
          );
          if (diallingCode) return `+${diallingCode} ${record.mobilePhone}`;
          return record.mobilePhone;
        },
      },
      {
        title: formatMessage({ id: 'bp.maintain_details.postal_code' }),
        dataIndex: 'postCode',
        width: '10%',
        editable: true,
        inputType: <Input />,
        editOptions: {
          rules: [{ pattern: /^\d+$/, message: '必须数字' }],
        },
      },
      {
        title: formatMessage({ id: 'bp.maintain_details.shipping_address.address' }),
        dataIndex: 'address',
        width: '35%',
        editable: true,
        inputType: <AddressInput onChange={value => this.valueChange('address', value)} />,
        editOptions: {
          rules: [{ validator: this.checkAddress }],
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
        title: formatMessage({ id: 'action.operation' }),
        dataIndex: 'actions',
        width: '15%',
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
    return columns;
  };

  render() {
    const { addressList } = this.props;
    const components = {
      body: {
        cell: EditableCell,
      },
    };

    const columns = this.getColumns().map(col => {
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
      <Card title={formatMessage({ id: 'bp.maintain_details.shipping_address' })} bordered={false}>
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
            <FormattedMessage id="action.add" />
          </Button>
        </EditableContext.Provider>
      </Card>
    );
  }
}

export default Form.create()(EditableTable);

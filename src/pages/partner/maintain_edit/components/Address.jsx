/**
 * 客户 收货地址
 */
import { Button, Table, Input, Divider, Form, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { MobilePhoneInput, AddressInput } from '@/components/CustomizedFormControls';
import ContactInformation from './ContactInformation';

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

@connect(
  ({ bpEdit }) => {
    const details = bpEdit.details || {};
    const customer = details.customer || {};
    const addressList = customer.addressList || [];

    return { details, customer, addressList };
  },
  null,
  null,
  { forwardRef: true },
)
class Address extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editIndex: -1,
      id: 0,
    };

    this.formRef = React.createRef();
  }

  checkAddress = (rule, value) => {
    const { address, countryCode, changedValue = {} } = value;
    const { option = [] } = changedValue;
    if (option.length > 0) {
      const last = option[option.length - 1];
      if (last.isMustLow === 1 && last.level !== 5) {
        return Promise.reject(new Error('必须选择下一级'));
      }
    }
    if (!address) {
      return Promise.reject(new Error('详细地址必填'));
    }
    if (!countryCode) {
      return Promise.reject(new Error('国家不能为空'));
    }
    return Promise.resolve();
  };

  checkMobilePhone = (rule, value) => {
    if (!value.mobilePhone) {
      return Promise.reject(new Error('手机号码不能为空'));
    }
    if (!value.mobilePhoneCountryCode) {
      return Promise.reject(new Error('国家编码不能为空'));
    }
    return Promise.resolve();
  };

  valueChange = (key, value) => {
    if (key === 'address') {
      const { changedValue, ...excludeChangeValue } = value;
      this.formRef.current.setFieldsValue({ address: excludeChangeValue });
    }
  };

  addRow = async () => {
    const { id, editIndex } = this.state;
    const { addressList } = this.props;
    const newId = id - 1;

    try {
      if (editIndex !== -1) {
        await this.formRef.current.validateFields();
      }
      const newAddressList = [
        ...addressList,
        {
          id: newId,
          name: '',
          mobilePhoneCountryCode: '',
          mobilePhone: '',
          postCode: '',
          countryCode: '',
          countryName: '',
          provinceCode: '',
          provinceName: '',
          cityCode: '',
          cityName: '',
          countyCode: '',
          countyName: '',
          streetCode: '',
          streetName: '',
          address: '',
        },
      ];

      this.formRef.current.setFieldsValue(newAddressList[newAddressList.length - 1]);
      this.setStore(newAddressList);
      this.setState({ editIndex: newAddressList.length - 1, id: newId });
    } catch (error) {
      console.log(error);
    }
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
    try {
      const row = await this.formRef.current.validateFields();
      // address中排除掉changedValue，不要把此数据赋值给地址
      const { address } = row;
      const { changedValue, sapCountryCode, provinceSapCode, ...otherAddress } = address;
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
    } catch (error) {
      return false;
    }
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
    const columns = [
      {
        title: formatMessage({ id: 'bp.maintain_details.shipping_address.name' }),
        dataIndex: 'name',
        width: '15%',
        editable: true,
        inputType: <Input />,
        editOptions: {
          rules: [{ required: true }],
        },
      },
      {
        title: formatMessage({ id: 'bp.mobilePhone' }),
        dataIndex: 'mobilePhone',
        width: '20%',
        editable: true,
        inputType: <MobilePhoneInput />,
        editOptions: {
          rules: [{ validator: this.checkMobilePhone }],
        },
        render(text, record) {
          const data = {
            countryCode: record.mobilePhoneCountryCode,
            code: record.mobilePhone,
          };

          return <ContactInformation data={data} />;
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
          // 线上地址不可修改、删除
          if (record.source === 1) return null;

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
        <Form ref={this.formRef}>
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
            icon={<PlusOutlined />}
          >
            <FormattedMessage id="action.add" />
          </Button>
        </Form>
      </Card>
    );
  }
}

export default Address;

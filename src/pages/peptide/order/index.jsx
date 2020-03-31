// 多肽订单
import { Button, Card, Col, DatePicker, Form, Input, Select, notification } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import { connect } from 'dva';
import { formatter } from '@/utils/utils';
import api from '@/api';
import OrderMask from '@/pages/peptide/components/order-mask';
import CustomerMask from '@/pages/peptide/components/customer-mask';
import SubCustomerMask from '@/pages/peptide/components/subCustomer-mask';
import ContactMask from '@/pages/peptide/components/contact-mask';
import SalerMask from '@/pages/peptide/components/saler-mask';
import TableSearchForm from '@/components/TableSearchForm';
import EditableCell from '@/components/EditableCell';
import { PlusOutlined } from '@ant-design/icons';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Search } = Input;

class Order extends Component {
  tableSearchFormRef = React.createRef();

  tableFormRef = React.createRef();

  state = {
    pagination: {},
    list: [],
    loading: false,
    selectedRows: [],
    editIndex: -1,
  };

  // 顶部表单默认值
  initialValues = {
    page: 1,
    rows: 10,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'peptide/getCache', // 销售大区
      payload: { type: 'regions' },
    });
    dispatch({
      type: 'peptide/getCache', // 销售网点
      payload: { type: 'offices' },
    });
    dispatch({
      type: 'peptide/getCache', // 开票方式
      payload: { type: 'taxInvoiceTypes' },
    });
    dispatch({
      type: 'peptide/getCache', // 付款方式
      payload: { type: 'salesPaymentMethods' },
    });
    dispatch({
      type: 'peptide/getCache', // 付款条件
      payload: { type: 'paymentTerms' },
    });
    dispatch({
      type: 'peptide/getCache', // 货币类型
      payload: { type: 'currencies' },
    });
    dispatch({
      type: 'peptide/getCache', // 销售范围
      payload: { type: 'salesRanges' },
    });
    this.getTableData(this.initialValues);
  }

  handleStandardTableChange = pagination => {
    this.getTableData({
      page: pagination.current,
      rows: pagination.pageSize,
    });
  };

  // 点击打印按钮
  showOrderPrint = () => {
    const { selectedRows } = this.state;
    if (selectedRows.length === 0) {
      notification.error({
        message: '消息',
        description: '请选择要打印的订单',
      });
    } else {
      sessionStorage.setItem('orderPrint', JSON.stringify(selectedRows));
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  // 获取表格数据
  getTableData = (options = {}) => {
    this.setState({ loading: true });

    const formData = this.tableSearchFormRef.current.getFieldsValue();
    const { pagination } = this.state;
    const { current: page, pageSize: rows } = pagination;
    const data = {
      page,
      rows,
      ...formData,
      ...options,
    };
    api.peptideorder.getOrder(data).then(res => {
      this.setState({
        list: res.rows,
        pagination: {
          current: data.page,
          pageSize: data.rows,
          total: res.total,
        },
        loading: false,
        editIndex: -1,
      });
    });
  };

  // 作废数据
  // deleteRow = row => {
  //   api.carrier.cancelCarrier(row.id).then(() => {
  //     this.getTableData();
  //   });
  // };

  getMaskData = (v, type) => {
    if (type === 'customer') {
      this.tableSearchFormRef.current.setFieldsValue({
        customerCode: v.code,
      });
    }
    if (type === 'subCustomer') {
      this.tableSearchFormRef.current.setFieldsValue({
        subCustomerCode: v.code,
      });
    }
    if (type === 'contact') {
      this.tableSearchFormRef.current.setFieldsValue({
        contactCode: v.code,
      });
    }
    if (type === 'saler') {
      this.tableSearchFormRef.current.setFieldsValue({
        salerCode: v.code,
      });
    }
  };

  // 顶部表单简单搜索
  simpleForm = () => (
    <>
      <Col lg={6} md={8} sm={12}>
        <FormItem label="订单编号" name="code">
          <Input />
        </FormItem>
      </Col>
      <Col lg={6} md={8} sm={12}>
        <FormItem label="客户" name="customerCode">
          <Search onSearch={() => this.showCustomer.visibleShow(true)} />
        </FormItem>
      </Col>
      <Col lg={6} md={8} sm={12}>
        <FormItem label="负责人" name="subCustomerCode">
          <Search onSearch={() => this.showSubCustomer.visibleShow(true)} />
        </FormItem>
      </Col>
      <Col lg={6} md={8} sm={12}>
        <FormItem label="订货人" name="contactCode">
          <Search onSearch={() => this.showContact.visibleShow(true)} />
        </FormItem>
      </Col>
      <Col lg={6} md={8} sm={12}>
        <FormItem label="销售员" name="salerCode">
          <Search onSearch={() => this.showSaler.visibleShow(true)} />
        </FormItem>
      </Col>
    </>
  );

  advancedForm = () => {
    const {
      peptide: { commonData },
      peptide,
      language,
    } = this.props;

    const regions = peptide.regions.filter(e => e.languageCode === language);

    const offices = peptide.offices.filter(e => e.languageCode === language);
    const currencies = peptide.currencies.filter(e => e.languageCode === language);

    return (
      <>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="币种" name="currency">
            <Select>
              <Option value="">全部</Option>
              {currencies.map(item => (
                <Option key={item.code} value={item.code}>
                  {`${item.code}-${item.shortText}`}
                </Option>
              ))}
            </Select>
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="销售网点" name="officeCode">
            <Select>
              <Option value="">全部</Option>
              {offices.map(item => (
                <Option key={item.code} value={item.code}>{`${item.code}-${item.name}`}</Option>
              ))}
            </Select>
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="销售大区" name="regionCode">
            <Select>
              <Option value="">全部</Option>
              {regions.map(item => (
                <Option key={item.code} value={item.code}>
                  {`${item.code}-${item.name}`}
                </Option>
              ))}
            </Select>
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="销售组织" name="rangeOrganization">
            <Select>
              {commonData.rangeOrganization.map(item => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="销售渠道" name="rangeChannel">
            <Select>
              {commonData.rangeChannel.map(item => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="创建日期" name="wanchengshijian">
            <RangePicker />
          </FormItem>
        </Col>
      </>
    );
  };

  render() {
    const { pagination, selectedRows, list, loading } = this.state;
    const {
      peptide: { commonData, taxInvoiceTypes, salesPaymentMethods, paymentTerms },
      peptide,
      language,
    } = this.props;

    const regions = peptide.regions.filter(e => e.languageCode === language);
    const offices = peptide.offices.filter(e => e.languageCode === language);
    const currencies = peptide.currencies.filter(e => e.languageCode === language);
    let tableWidth = 0;
    let columns = [
      {
        title: '编号',
        dataIndex: 'code',
        width: 100,
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 100,
        render(text) {
          return formatter(commonData.orderStatus, text);
        },
      },
      {
        title: '客户',
        dataIndex: 'customerName',
        width: 200,
      },
      {
        title: '负责人',
        dataIndex: 'subCustomerName',
        width: 200,
      },
      {
        title: '订货人',
        dataIndex: 'contactName',
        width: 100,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        width: 200,
      },
      {
        title: '订货人手机',
        dataIndex: 'contactMobile',
        width: 100,
      },
      {
        title: '订货人邮箱',
        dataIndex: 'contactEmail',
        width: 100,
      },
      {
        title: '销售组织',
        dataIndex: 'rangeOrganization',
        width: 100,
        render(text) {
          return formatter(commonData.rangeOrganization, text);
        },
      },
      {
        title: '分销渠道',
        dataIndex: 'rangeChannel',
        width: 100,
        render(text) {
          return formatter(commonData.rangeChannel, text);
        },
      },
      {
        title: '销售大区',
        dataIndex: 'regionCode',
        width: 150,
        render(text) {
          return `${text} - ${formatter(regions, text, 'code', 'name')}`;
        },
      },
      {
        title: '销售网点',
        dataIndex: 'officeCode',
        width: 150,
        render(text) {
          return `${text} - ${formatter(offices, text, 'code', 'name')}`;
        },
      },
      {
        title: '交货方式',
        dataIndex: 'deliveryType',
        width: 100,
        render(text) {
          return formatter(commonData.deliveryTypeStatus, text);
        },
      },
      {
        title: '开票方式',
        dataIndex: 'invoiceType',
        width: 150,
        render(text) {
          return formatter(taxInvoiceTypes, text, 'code', 'name');
        },
      },
      {
        title: '付款方式',
        dataIndex: 'paymentMethod',
        width: 100,
        render(text) {
          return formatter(salesPaymentMethods, text, 'code', 'name');
        },
      },
      {
        title: '付款条件',
        dataIndex: 'paymentTerm',
        width: 250,
        render(text) {
          return `${text} - ${formatter(paymentTerms, text, 'code', 'name')}`;
        },
      },
      {
        title: 'SAP销售订单号',
        dataIndex: 'sapOrderCode',
        width: 140,
      },
      {
        title: 'SAP交货单号',
        dataIndex: 'sapDeliveryCode',
        width: 140,
      },
      {
        title: '运费',
        dataIndex: 'freight',
        width: 100,
      },
      {
        title: '订单金额',
        dataIndex: 'amount',
        width: 100,
      },
      {
        title: '币种',
        dataIndex: 'currency',
        width: 100,
        render(text) {
          return formatter(currencies.code, text);
        },
      },
      {
        title: '随货开票',
        dataIndex: 'invoiceByGoods',
        width: 100,
        render(text) {
          return text ? '是' : '否';
        },
      },
      {
        title: '送货地址',
        dataIndex: 'address',
        width: 500,
      },
      {
        title: '创建人姓名',
        dataIndex: 'creatorName',
        width: 120,
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        width: 100,
      },
      {
        title: '修改人姓名',
        dataIndex: 'changerName',
        width: 120,
      },
      {
        title: '修改时间',
        dataIndex: 'changeDate',
        width: 100,
      },
      {
        title: '发货人姓名',
        dataIndex: 'sendName',
        width: 120,
      },
      {
        title: '发货时间',
        dataIndex: 'sendDate',
        width: 100,
      },
      {
        title: '作废人姓名',
        dataIndex: 'cancelName',
        width: 120,
      },
      {
        title: '作废时间',
        dataIndex: 'cancelDate',
        width: 100,
      },
      {
        title: '审核人姓名',
        dataIndex: 'checkName',
        width: 120,
      },
      {
        title: '审核时间',
        dataIndex: 'checkDate',
        width: 100,
      },
      {
        title: '完成人姓名',
        dataIndex: 'finishName',
        width: 120,
      },
      {
        title: '完成时间',
        dataIndex: 'finishDate',
        width: 100,
      },
      // {
      //   fixed: 'right',
      //   title: '操作',
      //   width: 100,
      //   render: (value, row, index) => {
      //     const { editIndex } = this.state;
      //     let actions;
      //     if (editIndex !== index) {
      //       if (row.status === 1) {
      //         actions = (
      //           <>
      //             <a>删除</a>
      //           </>
      //         );
      //       } else {
      //         actions = (
      //           <>
      //             <a>恢复</a>
      //           </>
      //         );
      //       }
      //     }
      //     if (editIndex === index) {
      //       actions = (
      //         <>
      //           <a>保存</a>
      //           <Divider type="vertical" />
      //           <a>退出</a>
      //         </>
      //       );
      //     }
      //     return actions;
      //   },
      // },
    ];

    columns = columns.map(col => {
      // eslint-disable-next-line no-param-reassign
      if (!col.width) col.width = 100;
      tableWidth += col.width;
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

    const components = {
      body: {
        cell: EditableCell,
      },
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className="tableList">
            <TableSearchForm
              ref={this.tableSearchFormRef}
              initialValues={this.initialValues}
              getTableData={this.getTableData}
              simpleForm={this.simpleForm}
              advancedForm={this.advancedForm}
            />
            <div className="tableListOperator">
              <Button
                type="primary"
                onClick={() => {
                  this.showOrder.visibleShow(true);
                }}
              >
                <PlusOutlined />
                新建
              </Button>
              <Button
                type="primary"
                href="/peptide/orderPrint"
                target="_blank"
                onClick={() => {
                  this.showOrderPrint();
                }}
              >
                打印
              </Button>
            </div>
            <Form ref={this.tableFormRef}>
              <StandardTable
                scroll={{ x: tableWidth }}
                rowClassName="editable-row"
                components={components}
                selectedRows={selectedRows}
                loading={loading}
                data={{ list, pagination }}
                columns={columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
              />
            </Form>
          </div>
        </Card>
        <CustomerMask
          onRef={ref => {
            this.showCustomer = ref;
          }}
          getData={v => this.getMaskData(v, 'customer')}
        />
        <SubCustomerMask
          onRef={ref => {
            this.showSubCustomer = ref;
          }}
          getData={v => this.getMaskData(v, 'subCustomer')}
        />
        <ContactMask
          onRef={ref => {
            this.showContact = ref;
          }}
          getData={v => this.getMaskData(v, 'contact')}
        />
        <SalerMask
          onRef={ref => {
            this.showSaler = ref;
          }}
          getData={v => this.getMaskData(v, 'saler')}
        />
        <OrderMask
          onRef={ref => {
            this.showOrder = ref;
          }}
        />
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ peptide, global }) => ({
  peptide,
  language: global.languageCode,
}))(Order);

import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Dropdown,
  Form,
  Icon,
  Input,
  InputNumber,
  Menu,
  Row,
  Select,
  message,
  Table,
} from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import api from '@/api'

const FormItem = Form.Item;
const { Option } = Select;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const { Search } = Input;

class Order extends Component {
  state = {
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
    list: [],
    loading: false,
    selectedRows: [],
    editIndex: -1,
  };

  columns = [
    {
      title: '编号',
      dataIndex: 'code',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
    },
    {
      title: '客户',
      dataIndex: 'customerName',
      width: 100,
    },
    {
      title: '负责人',
      dataIndex: 'subCustomerName',
      width: 100,
    },
    {
      title: '订货人',
      dataIndex: 'contactName',
      width: 100,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 100,
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
    },
    {
      title: '分销渠道',
      dataIndex: 'rangeChannel',
      width: 100,
    },
    {
      title: '销售大区',
      dataIndex: 'regionCode',
      width: 100,
    },
    {
      title: '销售网点',
      dataIndex: 'officeCode',
      width: 100,
    },
    {
      title: '交货方式',
      dataIndex: 'deliveryType',
      width: 100,
    },
    {
      title: '开票方式',
      dataIndex: 'invoiceType',
      width: 100,
    },
    {
      title: '付款方式',
      dataIndex: 'paymentMethod',
      width: 100,
    },
    {
      title: '付款条件',
      dataIndex: 'paymentTerm',
      width: 100,
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
    },
    {
      title: '随货开票',
      dataIndex: 'invoiceByGoods',
      width: 100,
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
    {
      fixed: 'right',
      title: '操作',
      width: 100,
      render: (value, row, index) => {
        const { status } = row;
        const { editIndex } = this.state;
        let actions;
        if (editIndex !== index) {
          if (row.status === 1) {
            actions = (
              <>
                <a>删除</a>
                </>
            );
          } else {
            actions = (
              <>
                <a>恢复</a>
                </>
            );
          }
        }
        if (editIndex === index) {
          actions = (
            <>
              <a>保存</a>
              <Divider type="vertical" />
              <a>退出</a>
            </>
          );
        }
        return actions;
      },
    },
  ];

  componentDidMount() {
    this.getTableData();
  }

  handleSearch = e => {
    e.preventDefault();
    this.getTableData({ page: 1 });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    this.getTableData({
      page: pagination.current,
      rows: pagination.pageSize,
    });
  }

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  // 获取表格数据
  getTableData = (options = {}) => {
    this.setState({
      loading: true,
    });
    const { form } = this.props;
    const { pagination: { current: page, pageSize: rows } } = this.state;
    const query = Object.assign(form.getFieldsValue(), { page, rows }, options);
    api.peptideorder.getOrder(query).then(data => {
      this.setState({
        loading: false,
        list: data.rows,
        pagination: {
          total: data.total,
          current: query.page,
          pageSize: query.rows,
        },
      });
    });
  }



  handleFormReset = () => {
    this.props.form.resetFields();
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  renderForm = () => {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  };

  handleAdd = () => {
    console.log('add');
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ lg: 24, md: 12, sm: 6 }}>
        <Col lg={6} md={8} sm={12}>
            <FormItem label="订单编号">
              {getFieldDecorator('code')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="客户">
              {getFieldDecorator('customerCode')(<Search  onSearch={value => console.log(value)} />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="负责人">
            {getFieldDecorator('subCustomerCode')(<Search  onSearch={value => console.log(value)} />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="订货人">
            {getFieldDecorator('contactCode')(<Search  onSearch={value => console.log(value)} />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="销售员">
            {getFieldDecorator('salerCode')(<Search  onSearch={value => console.log(value)} />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="币种">
              {getFieldDecorator('currency')(
                <Select>
                  <Option value="0">类型1</Option>
                  <Option value="1">类型2</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="销售网点">
              {getFieldDecorator('officeCode')(
                <Select>
                  <Option value="0">类型1</Option>
                  <Option value="1">类型2</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="销售大区">
              {getFieldDecorator('regionCode')(
                <Select>
                  <Option value="8000">类型1</Option>
                  <Option value="1">类型2</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="销售组织">
              {getFieldDecorator('rangeOrganization')(
                <Select>
                  <Option value="0">类型1</Option>
                  <Option value="1">类型2</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="销售渠道">
              {getFieldDecorator('rangeChannel')(
                <Select>
                  <Option value="0">类型1</Option>
                  <Option value="1">类型2</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="创建日期">
              {getFieldDecorator('wanchengshijian')(
                <RangePicker />,
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ lg: 24, md: 12, sm: 6 }}>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="订单编号">
              {getFieldDecorator('code')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="客户">
              {getFieldDecorator('customerCode')(<Search  onSearch={value => console.log(value)} />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="负责人">
            {getFieldDecorator('subCustomerCode')(<Search  onSearch={value => console.log(value)} />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="订货人">
            {getFieldDecorator('contactCode')(<Search  onSearch={value => console.log(value)} />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="销售员">
            {getFieldDecorator('salerCode')(<Search  onSearch={value => console.log(value)} />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <span className="submitButtons">
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }


  render() {
    const { list, pagination, loading, selectedRows } = this.state;
    const data = { list, pagination };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className="tableList">
            <div className="tableListForm">{this.renderForm()}</div>
            <div className="tableListOperator">
              <Button icon="plus" type="primary" onClick={() => this.handleAdd()}>
                新建
              </Button>
            </div>
            <StandardTable
              scroll={{ x: 4200 }}
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(Order);

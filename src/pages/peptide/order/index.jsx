// 多肽订单
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Icon,
  Input,
  Row,
  Select,
} from 'antd';
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

const EditableContext = React.createContext();
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Search } = Input;


@Form.create()
@connect(({ peptide, global }) => ({
  peptide,
  language: global.languageCode,
}))
class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
    }
  }

  componentDidMount() {
    this.submit();
  }

  submit = e => {
    if (e) e.preventDefault();
    const val = this.props.form.getFieldsValue();
    this.props.getTableData({ page: 1, ...val });
  }

  handleFormReset = () => {
    this.props.form.resetFields();
  }

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  getMaskData = (v, type) => {
    if (type === 'customer') {
      this.props.form.setFieldsValue({
        customerCode: v.code,
      });
    }
    if (type === 'subCustomer') {
      this.props.form.setFieldsValue({
        subCustomerCode: v.code,
      });
    }
    if (type === 'contact') {
      this.props.form.setFieldsValue({
        contactCode: v.code,
      });
    }
    if (type === 'saler') {
      this.props.form.setFieldsValue({
        salerCode: v.code,
      });
    }
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
      peptide: {
        commonData,
      },
      peptide,
      language,
    } = this.props;
    const regions = peptide.regions.filter(
      e => e.languageCode === language,
    )

    const offices = peptide.offices.filter(
      e => e.languageCode === language,
    )
    const currencies = peptide.currencies.filter(
      e => e.languageCode === language,
    )

    return (
      <Form onSubmit={this.submit} layout="inline">
        <Row gutter={{ lg: 24, md: 12, sm: 6 }}>
        <Col lg={6} md={8} sm={12}>
            <FormItem label="订单编号">
              {getFieldDecorator('code')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="客户">
              {getFieldDecorator('customerCode')(<Search onSearch={() => this.showCustomer.visibleShow(true)} />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="负责人">
            {getFieldDecorator('subCustomerCode')(<Search onSearch={() => this.showSubCustomer.visibleShow(true)} />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="订货人">
            {getFieldDecorator('contactCode')(<Search onSearch={() => this.showContact.visibleShow(true)} />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="销售员">
            {getFieldDecorator('salerCode')(<Search onSearch={() => this.showSaler.visibleShow(true)} />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="币种">
              {getFieldDecorator('currency', { initialValue: '' })(
                <Select>
                  <Option value="">全部</Option>
                  {currencies.map(item =>
                  <Option key={item.code} value={item.code}>{`${item.code}-${item.shortText}`}</Option>,
                )}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="销售网点">
              {getFieldDecorator('officeCode', { initialValue: '' })(
                <Select>
                <Option value="">全部</Option>
                {offices.map(item =>
                  <Option key={item.code} value={item.code}>{`${item.code}-${item.name}`}</Option>,
                )}
                </Select>)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="销售大区">
              {getFieldDecorator('regionCode', { initialValue: '' })(
                <Select>
                  <Option value="">全部</Option>
                  {regions.map(item =>
                    <Option key={item.code} value={item.code}>{`${item.code}-${item.name}`}</Option>,
                  )}
                  </Select>)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="销售组织">
              {getFieldDecorator('rangeOrganization', { initialValue: '' })(
                <Select>
                  {commonData.rangeOrganization.map(item =>
                    <Option key={item.id} value={item.id}>{item.name}</Option>,
                  )}
                  </Select>)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="销售渠道">
              {getFieldDecorator('rangeChannel', { initialValue: '' })(
                <Select>
                  {commonData.rangeChannel.map(item =>
                    <Option key={item.id} value={item.id}>{item.name}</Option>,
                  )}
                  </Select>)}
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
      <Form onSubmit={this.submit} layout="inline">
        <Row gutter={{ lg: 24, md: 12, sm: 6 }}>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="订单编号">
              {getFieldDecorator('code')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="客户">
              {getFieldDecorator('customerCode')(<Search onSearch={() => this.showCustomer.visibleShow(true)} />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="负责人">
            {getFieldDecorator('subCustomerCode')(<Search onSearch={() => this.showSubCustomer.visibleShow(true)} />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="订货人">
            {getFieldDecorator('contactCode')(<Search onSearch={() => this.showContact.visibleShow(true)} />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="销售员">
            {getFieldDecorator('salerCode')(<Search onSearch={() => this.showSaler.visibleShow(true)} />)}
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

  // 渲染表单
  renderForm = () => {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    return (
      <div className="tableListForm">
      {this.renderForm()}
      <CustomerMask
        onRef={ref => { this.showCustomer = ref }}
        getData={v => this.getMaskData(v, 'customer')}
        />
      <SubCustomerMask
        onRef={ref => { this.showSubCustomer = ref }}
        getData={v => this.getMaskData(v, 'subCustomer')}
      />
      <ContactMask
        onRef={ref => { this.showContact = ref }}
        getData={v => this.getMaskData(v, 'contact')}
      />
      <SalerMask
        onRef={ref => { this.showSaler = ref }}
        getData={v => this.getMaskData(v, 'saler')}
      />
      </div>
    );
  }
}

/**
 * 表格编辑组件
 */
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

@connect(({ peptide, global }) => ({
  peptide,
  language: global.languageCode,
}))
class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formValues: {
        page: 1,
        rows: 10,
      },
      list: [],
      total: 0,
      loading: false,
      selectedRows: [],
      editIndex: -1,
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'peptide/getCache', // 销售大区
      payload: { type: 'regions' },
    })
    dispatch({
      type: 'peptide/getCache', // 销售网点
      payload: { type: 'offices' },
    })
    dispatch({
      type: 'peptide/getCache', // 开票方式
      payload: { type: 'invtypes' },
    })
    dispatch({
      type: 'peptide/getCache', // 付款方式
      payload: { type: 'payMethods' },
    })
    dispatch({
      type: 'peptide/getCache', // 付款条件
      payload: { type: 'payTerms' },
    })
    dispatch({
      type: 'peptide/getCache', // 货币类型
      payload: { type: 'currencies' },
    })
    dispatch({
      type: 'peptide/getCache', // 销售范围
      payload: { type: 'SalesRanges' },
    })
  }

  handleStandardTableChange = pagination => {
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
    const { formValues } = this.state;
    const query = Object.assign(
      {},
      formValues,
      options,
      // {
      //   createDateBegin: options.wanchengshijian ? options.wanchengshijian[0].format('YYYY-MM-DD') : '',
      //   createDateEnd: options.wanchengshijian ? options.wanchengshijian[1].format('YYYY-MM-DD') : '',
      // },
    );
    this.setState({
      formValues: query,
      loading: true,
    });

    api.peptideorder.getOrder(query).then(res => {
      this.setState({
        list: res.rows,
        total: res.total,
        loading: false,
        editIndex: -1,
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

  // 作废数据
  // deleteRow = row => {
  //   api.carrier.cancelCarrier(row.id).then(() => {
  //     this.getTableData();
  //   });
  // };

  render() {
    const {
      formValues: { page: current, rows: pageSize },
      selectedRows,
      list,
      total,
      loading,
    } = this.state;

    const { peptide: { commonData, invtypes, payMethods, payTerms },
     peptide, language } = this.props

    const regions = peptide.regions.filter(
      e => e.languageCode === language,
    )
    const offices = peptide.offices.filter(
      e => e.languageCode === language,
    )
    const currencies = peptide.currencies.filter(
      e => e.languageCode === language,
    )
    const data = { list, pagination: { current, pageSize, total } };
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
          return formatter(invtypes, text, 'code', 'name');
        },
      },
      {
        title: '付款方式',
        dataIndex: 'paymentMethod',
        width: 100,
        render(text) {
          return formatter(payMethods, text, 'code', 'name');
        },
      },
      {
        title: '付款条件',
        dataIndex: 'paymentTerm',
        width: 250,
        render(text) {
          return `${text} - ${formatter(payTerms, text, 'code', 'name')}`;
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
        render(text) { return text ? '是' : '否' },
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
            <SearchPage getTableData={this.getTableData} />
            <div className="tableListOperator">
              <Button icon="plus" type="primary" onClick={ () => { this.showOrder.visibleShow(true) }}>
                新建
              </Button>
            </div>
            <EditableContext.Provider value={this.props.form}>
              <StandardTable
                scroll={{ x: tableWidth }}
                rowClassName="editable-row"
                components={components}
                selectedRows={selectedRows}
                loading={loading}
                data={data}
                columns={columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
              />
            </EditableContext.Provider>
          </div>
        </Card>
        <OrderMask
          onRef={ref => { this.showOrder = ref }}
        />
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(Order);

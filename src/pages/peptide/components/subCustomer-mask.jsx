// 负责人弹框
import { Col, Form, Input, Select, Table, Modal, notification } from 'antd';
import React, { Component } from 'react';

import api from '@/api';
import './style.less';
import { connect } from 'dva';
import TableSearchForm from '@/components/TableSearchForm';
import { formatter } from '@/utils/utils';

const FormItem = Form.Item;
const { Option } = Select;

class SubCustomer extends Component {
  tableSearchFormRef = React.createRef();

  tableFormRef = React.createRef();

  state = {
    pagination: {},
    list: [],
    loading: false,
    visible: false, // 遮罩层的判断
  };

  // 顶部表单默认值

  componentDidMount() {
    this.props.onRef(this);
  }

  visibleShow = visible => {
    this.setState({ visible });
    this.getTableData(this.initialValues());
  };

  initialValues = () => {
    const { customerCode } = this.props;
    return {
      regionCode: '',
      officeCode: '',
      currency: '',
      payMethodCode: '',
      payTermsCode: '',
      rangeOrganization: '3110-10',
      page: 1,
      rows: 10,
      customerCode,
    };
  };

  handleSelect = data => {
    const { customerCode } = this.props;
    if (customerCode) {
      if (!data.custType && data.code === customerCode) {
        notification.error({
          message: '消息',
          description: '院校客户和负责人不能一样',
        });
        return false;
      }
    }
    this.props.getData(data);
    this.handleCancel();
    return true;
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  // 分页
  handleStandardTableChange = pagination => {
    this.getTableData({
      page: pagination.current,
      rows: pagination.pageSize,
    });
  };

  // 获取表格数据
  getTableData = (options = {}) => {
    this.setState({ loading: true });
    const formData = this.tableSearchFormRef.current
      ? this.tableSearchFormRef.current.getFieldsValue()
      : '';
    const range = formData
      ? formData.rangeOrganization.split('-')
      : options.rangeOrganization.split('-');
    const rangeData = {
      rangeChannel: range[1],
      rangeGroup: '00',
      rangeOrganization: range[0],
    };
    const { pagination } = this.state;
    const { current: page, pageSize: rows } = pagination;
    const data = {
      page,
      rows,
      ...formData,
      ...options,
      ...rangeData,
    };
    api.basic.getSubcustomer(data).then(res => {
      this.setState({
        list: res,
        pagination: {
          current: data.page,
          pageSize: data.rows,
          total: res.length,
        },
        loading: false,
      });
    });
  };

  simpleForm = () => {
    const {
      peptide: { salesRanges },
      regions,
      offices,
      salesPaymentMethods,
      currencies,
      paymentTerms,
    } = this.props;

    return (
      <>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="编号" name="code">
            <Input style={{ width: '192px' }} />
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="名称" name="name">
            <Input style={{ width: '192px' }} />
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="电话" name="telNo">
            <Input style={{ width: '192px' }} />
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="手机" name="mobNo">
            <Input style={{ width: '192px' }} />
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="邮箱" name="email">
            <Input style={{ width: '192px' }} />
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="客户编号" name="customerCode">
            <Input style={{ width: '192px' }} />
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="客户名称" name="customerName">
            <Input style={{ width: '192px' }} />
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="大区" name="regionCode">
            <Select style={{ width: '192px' }}>
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
          <FormItem label="网点" name="officeCode">
            <Select style={{ width: '192px' }}>
              <Option value="">全部</Option>
              {offices.map(item => (
                <Option key={item.code} value={item.code}>
                  {`${item.code}-${item.name}`}
                </Option>
              ))}
            </Select>
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="币种" name="currency">
            <Select style={{ width: '192px' }}>
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
          <FormItem label="付款方式" name="payMethodCode">
            <Select style={{ width: '192px' }}>
              <Option value="">全部</Option>
              {salesPaymentMethods.map(item => (
                <Option key={item.code} value={item.code}>
                  {`${item.code}-${item.name}`}
                </Option>
              ))}
            </Select>
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="付款条件" name="payTermsCode">
            <Select style={{ width: '192px' }}>
              <Option value="">全部</Option>
              {paymentTerms.map(item => (
                <Option key={item.code} value={item.code}>
                  {`${item.code}-${item.name}`}
                </Option>
              ))}
            </Select>
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="销售员编号" className="fiveWord" name="salerCode">
            <Input style={{ width: '182px' }} />
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="销售员名称" className="fiveWord" name="salerName">
            <Input style={{ width: '182px' }} />
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="销售范围" name="rangeOrganization">
            <Select style={{ width: '192px' }}>
              {/* <Option value="">全部</Option> */}
              {salesRanges.map(item => (
                <Option
                  key={`${item.organization}${item.channel}`}
                  value={`${item.organization}-${item.channel}`}
                >
                  {`${item.channelName} - ${item.organizationName}`}
                </Option>
              ))}
            </Select>
          </FormItem>
        </Col>
      </>
    );
  };

  render() {
    const { pagination, list, loading, visible } = this.state;
    const { regions, offices, salesPaymentMethods, paymentTerms, currencies } = this.props;
    let tableWidth = 0;

    let columns = [
      {
        title: '编号',
        dataIndex: 'code',
        width: 120,
      },
      {
        title: '名称',
        dataIndex: 'name',
        width: 350,
      },
      {
        title: '电话',
        dataIndex: 'telNo',
        width: 200,
      },
      {
        title: '手机',
        dataIndex: 'mobNo',
        width: 200,
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        width: 200,
      },
      {
        title: '客户编号',
        dataIndex: 'customerCode',
        width: 120,
      },
      {
        title: '客户名称',
        dataIndex: 'customerName',
        width: 200,
      },
      {
        title: '客户分类',
        dataIndex: 'custType',
        width: 100,
      },
      {
        title: '大区',
        dataIndex: 'regionCode',
        width: 150,
        render: value => `${value} - ${formatter(regions, value, 'code', 'name')}`,
      },
      {
        title: '网点',
        dataIndex: 'officeCode',
        width: 150,
        render: value => `${value} - ${formatter(offices, value, 'code', 'name')}`,
      },
      {
        title: '币种',
        dataIndex: 'currency',
        width: 150,
        render: value => `${value} - ${formatter(currencies, value, 'code', 'shortText')}`,
      },
      {
        title: '付款方式',
        dataIndex: 'payMethodCode',
        width: 150,
        render: value => `${value} - ${formatter(salesPaymentMethods, value, 'code', 'name')}`,
      },
      {
        title: '付款条件',
        dataIndex: 'payTermsCode',
        width: 150,
        render: value => `${value} - ${formatter(paymentTerms, value, 'code', 'name')}`,
      },
      {
        title: '销售员',
        dataIndex: 'salerCode',
        width: 100,
      },
      {
        title: '销售员名称',
        dataIndex: 'salerName',
        width: 120,
      },
      {
        title: '增值税号',
        dataIndex: 'vatCode',
        width: 100,
      },
      {
        title: '信用额度',
        dataIndex: 'credit',
        width: 100,
      },
      {
        title: '余额',
        dataIndex: 'balance',
        width: 100,
      },
      {
        title: '销售冻结(当前渠道)',
        dataIndex: 'customerRangeFrozen',
        width: 200,
      },
      {
        title: '销售冻结(所有渠道)',
        dataIndex: 'customerFrozen',
        width: 200,
      },
      {
        title: '操作',
        dataIndex: 'actions',
        fixed: 'right',
        render: (text, record) => <a onClick={() => this.handleSelect(record)}>选择</a>,
      },
    ];

    columns = columns.map(col => {
      // eslint-disable-next-line no-param-reassign
      if (!col.width) col.width = 100;
      tableWidth += col.width;
      return col;
    });

    // const rowSelection = {
    //   type: 'radio',
    //   onChange: (selectedRowKeys, selectedRows) => {
    //       this.setState({
    //           data: selectedRows[0],
    //         })
    //     },
    // }

    return (
      <div>
        <Modal
          width="1200px"
          title="负责人列表"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
        >
          <TableSearchForm
            ref={this.tableSearchFormRef}
            initialValues={this.initialValues()}
            getTableData={this.getTableData}
            simpleForm={this.simpleForm}
          />
          <div className="tableListOperator" />
          <Table
            dataSource={list}
            columns={columns}
            scroll={{ x: tableWidth, y: 300 }}
            pagination={pagination}
            rowKey="code"
            // rowSelection={rowSelection}
            loading={loading}
            onChange={this.handleStandardTableChange}
          />
        </Modal>
      </div>
    );
  }
}

export default connect(({ peptide, global }) => {
  const regions = peptide.regions.filter(e => e.languageCode === global.languageCode);
  const offices = peptide.offices.filter(e => e.languageCode === global.languageCode);
  const currencies = peptide.currencies.filter(e => e.languageCode === global.languageCode);
  const salesPaymentMethods = peptide.salesPaymentMethods.filter(
    e => e.languageCode === global.languageCode,
  );
  const paymentTerms = peptide.paymentTerms.filter(e => e.languageCode === global.languageCode);
  return {
    peptide,
    language: global.languageCode || [],
    regions,
    offices,
    currencies,
    salesPaymentMethods,
    paymentTerms,
  };
})(SubCustomer);

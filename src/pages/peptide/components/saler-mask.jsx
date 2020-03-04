// 销售员弹框
import { Col, Form, Input, Select, Table, Modal } from 'antd';
import React, { Component } from 'react';

import api from '@/api';
import './style.less';
import { connect } from 'dva';
import TableSearchForm from '@/components/TableSearchForm';

const FormItem = Form.Item;
const { Option } = Select;

class Saler extends Component {
  tableSearchFormRef = React.createRef();

  tableFormRef = React.createRef();

  state = {
    pagination: {},
    list: [],
    loading: false,
    visible: false, // 遮罩层的判断
  };

  // 顶部表单默认值
  initialValues = {
    regionCode: '',
    officeCode: '',
    page: 1,
    rows: 10,
  };

  componentDidMount() {
    this.props.onRef(this);
  }

  visibleShow = visible => {
    this.setState({ visible });
    this.getTableData(this.initialValues);
  };

  handleSelect = data => {
    this.props.getData(data);
    this.handleCancel();
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
    const { pagination } = this.state;
    const { current: page, pageSize: rows } = pagination;
    const data = {
      page,
      rows,
      ...formData,
      ...options,
    };

    api.peptideBase.getModifications(data, true).then(res => {
      this.setState({
        list: res.rows,
        pagination: {
          current: data.page,
          pageSize: data.rows,
          total: res.total,
        },
        loading: false,
      });
    });
  };

  handleFormReset = () => {
    this.props.form.resetFields();
  };

  simpleForm = () => {
    const { peptide, language } = this.props;

    const regions = peptide.regions.filter(e => e.languageCode === language);
    const offices = peptide.offices.filter(e => e.languageCode === language);
    return (
      <>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="编号" name="code">
            <Input style={{ width: '192px' }} />
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="姓名" name="name">
            <Input style={{ width: '192px' }} />
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="销售组织" name="organizationName">
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
          <FormItem label="部门" name="department">
            <Input style={{ width: '192px' }} />
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="个人手机" name="personalMobNo">
            <Input style={{ width: '192px' }} />
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="工作手机" name="mobNo">
            <Input style={{ width: '192px' }} />
          </FormItem>
        </Col>
      </>
    );
  };

  render() {
    const { pagination, list, loading, visible } = this.state;
    let tableWidth = 0;

    let columns = [
      {
        title: '编号',
        dataIndex: 'code',
        width: 100,
      },
      {
        title: '姓名',
        dataIndex: 'name',
        width: 100,
      },
      {
        title: '个人手机',
        dataIndex: 'personalMobNo',
        width: 100,
      },
      {
        title: '工作手机',
        dataIndex: 'mobNo',
        width: 100,
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        width: 100,
      },
      {
        title: '部门',
        dataIndex: 'department',
        width: 100,
      },
      {
        title: '销售组织',
        dataIndex: 'organizationName',
        width: 100,
      },
      {
        title: '大区',
        dataIndex: 'regionCode',
        width: 100,
      },
      {
        title: '网点',
        dataIndex: 'officeCode',
        width: 100,
      },
      {
        title: '离职状态',
        dataIndex: 'leave',
        width: 100,
      },
      {
        title: '离职日期',
        dataIndex: 'leaveDate',
        width: 100,
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
          title="销售员列表"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
        >
          <TableSearchForm
            ref={this.tableSearchFormRef}
            initialValues={this.initialValues}
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

export default connect(({ peptide, global }) => ({
  peptide,
  language: global.languageCode || [],
}))(Saler);

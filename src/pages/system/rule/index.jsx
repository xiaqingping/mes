import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Divider,
} from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import api from '@/api';

const FormItem = Form.Item;
const { Option } = Select;
const { Search } = Input;

// Type
const typeList = [
  { value: 'GET', text: 'GET' },
  { value: 'POST', text: 'POST' },
  { value: 'DELETE', text: 'DELETE' },
  { value: 'PUT', text: 'PUT' },
];
// 参数类型
const paramType = {
  1: { value: 1, text: '参数' },
  2: { value: 2, text: '属性' },
  3: { value: 3, text: '接口' },
};
const paramTypeList = [
  { value: 1, text: '参数' },
  { value: 2, text: '属性' },
  { value: 3, text: '接口' },
];
// 状态
const status = {
  0: { value: 0, text: '有效' },
  1: { value: 1, text: '过期' },
};
const statusList = [
  { value: 0, text: '有效' },
  { value: 1, text: '过期' },
];

class Rule extends Component {
  state = {
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
    list: [],
    loading: false,
    selectedRows: [],
  }

  columns = [
    {
      title: '规则名称',
      dataIndex: 'name',
      width: 200,
    },
    {
      title: 'Client',
      dataIndex: 'sourceClient',
      width: 200,
    },
    {
      title: 'Type',
      dataIndex: 'sourceType',
      width: 100,
    },
    {
      title: '资源',
      dataIndex: 'sourcePath',
      width: 200,
    },
    {
      title: '资源描述',
      dataIndex: 'sourceDesc',
      width: 150,
    },
    {
      title: '参数类型',
      dataIndex: 'paramType',
      width: 100,
      render(val) {
        return <span>{paramType[val].text}</span>;
      },
    },
    {
      title: '参数',
      dataIndex: 'parameterField',
      width: 150,
    },
    {
      title: '参数描述',
      dataIndex: 'parameterDesc',
      width: 100,
    },
    {
      title: 'OP',
      dataIndex: 'op',
      width: 100,
    },
    {
      title: '值',
      dataIndex: 'value',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render(val) {
        return <span>{status[val].text}</span>;
      },
    },
    {
      fixed: 'right',
      title: '操作',
      width: 120,
      render: (value, row, index) => {
        // const { status } = row;
        const { editIndex } = this.state;
        let actions;
        if (editIndex !== index) {
          actions = (
            <>
              <a>删除</a>
              {/* <Divider type="vertical" />
              <a>修改</a> */}
            </>
          );
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
  }

  // 获取表格数据
  getTableData = (options = {}) => {
    this.setState({
      loading: true,
    });
    const { form } = this.props;
    const { pagination: { current: page, pageSize: rows } } = this.state;
    const query = Object.assign(form.getFieldsValue(), { page, rows }, options);
    if (query.name === '') {
      query.name = undefined;
    }
    if (query.sourceType === '') {
      query.sourceType = undefined;
    }

    api.system.getRules(query, true).then(data => {
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

  // 新增
  handleAdd = () => {
    console.log('add');
  }

  // 渲染表单
  renderForm = () => this.renderAdvancedForm()

  // 显示搜索
  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ lg: 24, md: 12, sm: 6 }}>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="规则名称">
              {getFieldDecorator('name')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="Client">
              {getFieldDecorator('client')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="参数">
              {getFieldDecorator('parameterField')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="Type">
              {getFieldDecorator('sourceType')(
                <Select placeholder="请选择">
                  <Option value="">全部</Option>
                  {typeList.map(item => <Option key={item.value} value={item.value}>{item.text}</Option>)}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="资源">
              {getFieldDecorator('sourcePath')(
                <Search onSearch={this.employeeListOpen} />,
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="参数类型">
              {getFieldDecorator('paramType', { initialValue: '' })(
                <Select placeholder="请选择">
                  <Option value="">全部</Option>
                  {paramTypeList.map(item => <Option key={item.value} value={item.value}>{item.text}</Option>)}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="状态">
              {getFieldDecorator('status', { initialValue: 0 })(
                <Select>
                  {statusList.map(item => <Option key={item.value} value={item.value}>{item.text}</Option>)}
                </Select>,
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
          </div>
        </div>
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
            <StandardTable
              scroll={{ x: 1500 }}
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

export default Form.create()(Rule);

import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
} from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import api from '@/api';

const FormItem = Form.Item;
const { Option } = Select;

// Type
const type = [
  { value: 'GET', text: 'GET' },
  { value: 'POST', text: 'POST' },
  { value: 'DELETE', text: 'DELETE' },
  { value: 'PUT', text: 'PUT' },
];

class User extends Component {
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
      title: 'client',
      dataIndex: 'client',
      width: 200,
    },
    {
      title: 'path',
      dataIndex: 'path',
      // width: 200,
    },
    {
      title: '描述',
      dataIndex: 'desc',
      // width: 200,
    },
    {
      title: 'type',
      dataIndex: 'type',
      width: 200,
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

    api.system.getSources(query, true).then(data => {
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

  // 显示搜索全部
  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ lg: 24, md: 12, sm: 6 }}>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="Client">
              {getFieldDecorator('client')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="Type">
              {getFieldDecorator('type', { initialValue: '' })(
                <Select>
                  <Option value="">全部</Option>
                  {type.map(item => <Option key={item.value} value={item.value}>{item.text}</Option>)}
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
              scroll={{ x: 1300 }}
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

export default Form.create()(User);

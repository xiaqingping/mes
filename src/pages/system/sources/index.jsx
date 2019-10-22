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


/**
 * 页面顶部筛选表单
 */
@Form.create()
class Searchs extends Component {
  componentDidMount() {
    this.submit();
  }

  submit = e => {
    if (e) e.preventDefault();
    const val = this.props.form.getFieldsValue();
    this.props.getTableData({ page: 1, ...val });
  }

  // 重置
  handleFormReset = () => {
    this.props.form.resetFields();
  }

  // 渲染表单
  renderForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Form onSubmit={this.submit} layout="inline">
        <Row gutter={{ lg: 24, md: 12, sm: 6 }}>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="Client">
              {getFieldDecorator('client')(<Input placeholder="请输入"/>)}
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
          <Col lg={6} md={8} sm={12}>
            <span className="submitButtons">
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    return (
      <div className="tableListForm">{this.renderForm()}</div>
    );
  }
}

/**
 * 页面根组件
 */
@Form.create()
class User extends Component {
  state = {
    formValues: {
      page: 1,
      rows: 10,
    },
    list: [],
    total: 0,
    loading: false,
    selectedRows: [],
  }

  // 设置列
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
  }

  // 分页
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    this.getTableData({
      page: pagination.current,
      rows: pagination.pageSize,
    });
  }

  // 选择行
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  }

  // 获取表格数据
  getTableData = (options = {}) => {
    const { formValues } = this.state;
    const query = Object.assign({}, formValues, options);

    this.setState({
      formValues: query,
      loading: true,
    });

    api.system.getSources(query, true).then(data => {
      this.setState({
        list: data.rows,
        total: data.total,
        loading: false,
      });
    });
  }

  // 重置
  handleFormReset = () => {
    this.props.form.resetFields();
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
    const {
      formValues: { page: current, rows: pageSize },
      selectedRows,
      list,
      total,
      loading,
    } = this.state;
    const data = { list, pagination: { current, pageSize, total } };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className="tableList">
            <Searchs getTableData={this.getTableData} />
            <StandardTable
              scroll={{ x: 1000 }}
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

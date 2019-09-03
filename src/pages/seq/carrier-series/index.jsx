import {
  Button,
  Card,
  Col,
  Divider,
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

class CarrierSeries extends Component {
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
  }

  columns = [
    {
      title: '编号',
      dataIndex: 'code',
      width: 100,
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: 180,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
    },
    {
      title: '创建人',
      dataIndex: 'creatorName',
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
      width: 200,
    },
    {
      title: '修改人',
      dataIndex: 'changerName',
      width: 100,
    },
    {
      title: '修改时间',
      dataIndex: 'changeDate',
      width: 200,
    },
    {
      title: '作废人',
      dataIndex: 'cancelName',
      width: 100,
    },
    {
      title: '作废时间',
      dataIndex: 'cancelDate',
      width: 200,
    },
    {
      fixed: 'right',
      title: '操作',
      width: 120,
      render: (value, row, index) => {
        const { status } = row;
        const { editIndex } = this.state;
        let actions;
        if (editIndex !== index && status === 1) {
          actions = (
            <>
              <a>删除</a>
              <Divider type="vertical" />
              <a>修改</a>
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

  // 获取表格数据
  getTableData = (options = {}) => {
    const { form } = this.props;
    const { pagination: { current: page, pageSize: rows } } = this.state;
    const query = Object.assign(form.getFieldsValue(), { page, rows }, options);

    api.series.getSeries(query, true).then(data => {
      this.setState({
        list: data.rows,
        pagination: {
          total: data.total,
          current: query.page,
          pageSize: query.rows,
        },
      });
    });
  }

  // 渲染表单
  renderForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ lg: 24, md: 12, sm: 6 }}>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="编号">
              {getFieldDecorator('code')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="名称">
              {getFieldDecorator('name')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="状态">
              {getFieldDecorator('status', { initialValue: '1' })(
                <Select>
                  <Option value="1">正常</Option>
                  <Option value="2">已删除</Option>
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

  // 新增
  handleAdd = () => {
    console.log('add');
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

export default Form.create()(CarrierSeries);

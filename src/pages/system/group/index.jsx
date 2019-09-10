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

// 参数类型
const paramType = {
  1: { value: 1, text: '参数' },
  2: { value: 2, text: '属性' },
  3: { value: 3, text: '接口' },
};
// 状态
const status = {
  0: { value: 0, text: '有效' },
  1: { value: 1, text: '过期' },
};

const gridStyle = {
  width: '33%',
  textAlign: 'center',
};

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
      title: '分组名称',
      dataIndex: 'name',
      width: 200,
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

    api.system.getGroups(query, true).then(data => {
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

  // 渲染表单 分组
  renderForm = () => this.renderAdvancedForm()

  // 渲染表单 规则分组
  // renderFormGroupRule = () => this.renderAdvancedFormGroupRule()

  // 显示搜索
  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ lg: 24, md: 12, sm: 6 }}>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="分组名称">
              {getFieldDecorator('name')(<Input />)}
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
        <Card title="Card Title">
          <Card>
          <div className="tableListForm">{this.renderForm()}</div>
          </Card>
          <Card.Grid style={gridStyle} bordered={false}>
            <div className="tableList">
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
          </Card.Grid>
          <Card.Grid style={gridStyle}>content</Card.Grid>
        </Card>,
        {/* <Row gutter={16}>
          <Col span={8}>
            <Card title="Card title" bordered={false}>
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
          </Col>
          <Col span={8}>
            <Card title="Card title" bordered={false}>
              Card content
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Card title" bordered={false}>
              Card content
            </Card>
          </Col>
        </Row> */}
        {/* <Card bordered={false}>
          <div className="groupRuleTableList">
            <div className="groupRuleTableListForm">{this.renderFormGroupRule()}</div>
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
        </Card> */}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(User);

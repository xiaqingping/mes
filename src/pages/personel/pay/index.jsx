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

class pay extends Component {
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
      title: '员工编号',
      dataIndex: 'employeeCode',
      width: 100,
    },
    {
      title: '员工名称',
      dataIndex: 'employeeName',
      width: 180,
    },
    {
      title: '总额',
      dataIndex: 'amount',
      width: 100,
    },
    {
      title: '时间',
      dataIndex: 'year',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
    },
    {
      title: '创建人',
      dataIndex: 'createName',
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
      width: 200,
    },
    {
      title: '删除人',
      dataIndex: 'cancelName',
      width: 100,
    },
    {
      title: '删除时间',
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
    // api.pay.getPay(query, true).then(data => {
    //   this.setState({
    //     loading: false,
    //     list: data.rows,
    //     pagination: {
    //       total: data.total,
    //       current: query.page,
    //       pageSize: query.rows,
    //     },
    //   });
    //   // console.log(data);
    // });
    api.series.getSeries(query, true).then(data => {
      this.setState({
        loading: false,
        list: data.rows,
        pagination: {
          total: data.total,
          current: query.page,
          pageSize: query.rows,
        },
      });
      console.log(data);
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
          <Col lg={4} md={8} sm={12}>
            <FormItem label="员工编号">
              {getFieldDecorator('code')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={4} md={8} sm={12}>
            <FormItem label="员工名称">
              {getFieldDecorator('staffName')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={4} md={8} sm={12}>
            <FormItem label="年">
              {getFieldDecorator('year')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={4} md={8} sm={12}>
            <FormItem label="月">
              {getFieldDecorator('month')(<Input />)}
            </FormItem>
          </Col>
          {/* <Col lg={6} md={8} sm={12}>
            <FormItem label="年">
              {getFieldDecorator('year', { initialValue: '0' })(
                <Select>
                <Option value="0"></Option>
                <Option value="1">2019</Option>
                <Option value="2">2018</Option>
                <Option value="3">2017</Option>
                <Option value="4">2016</Option>
                <Option value="4">2015</Option>
              </Select>,
              )} 
            </FormItem>
          </Col> */}
          {/* <Col lg={6} md={8} sm={12}>
            <FormItem label="月">
              {getFieldDecorator('month', { initialValue: '0' })(
                <Select>
                  <Option value="0"></Option>
                  <Option value="1">1</Option>
                  <Option value="2">2</Option>
                  <Option value="3">3</Option>
                  <Option value="4">4</Option>
                  <Option value="5">5</Option>
                  <Option value="6">6</Option>
                  <Option value="7">7</Option>
                  <Option value="8">8</Option>
                  <Option value="9">9</Option>
                  <Option value="10">10</Option>
                  <Option value="11">11</Option>
                  <Option value="12">12</Option>
              </Select>,
              )} 
            </FormItem>
          </Col> */}
          <Col lg={4} md={8} sm={12}>
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
              {/* <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button> */}
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
              <Button icon="delete" type="primary" onClick={() => this.handleAdd()}>
                作废
              </Button>
              <Button icon="file-excel" type="primary" onClick={() => this.handleAdd()}>
                excel上传
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

export default Form.create()(pay);


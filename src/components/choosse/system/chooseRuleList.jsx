import { Button, Col, Form, Input, Row, Select, Modal, Table } from 'antd';
import React, { Component } from 'react';
import api from '@/api';

const FormItem = Form.Item;
const { Option } = Select;

// Type
const typeList = [
  { value: 'GET', text: 'GET' },
  { value: 'POST', text: 'POST' },
  { value: 'DELETE', text: 'DELETE' },
  { value: 'PUT', text: 'PUT' },
];
// 参数类型
// const paramType = {
//   1: { value: 1, text: '参数' },
//   2: { value: 2, text: '属性' },
//   3: { value: 3, text: '接口' },
// };
const paramTypeList = [
  { value: 1, text: '参数' },
  { value: 2, text: '属性' },
  { value: 3, text: '接口' },
];
// 状态
// const statu = {
//   0: { value: 0, text: '有效' },
//   1: { value: 1, text: '过期' },
// };
const statuList = [
  { value: 0, text: '有效' },
  { value: 1, text: '过期' },
];

/**
 * 页面顶部筛选表单
 */
@Form.create()
class Search extends Component {
  componentDidMount() {
    this.submit();
  }

  submit = e => {
    if (e) e.preventDefault();
    const val = this.props.form.getFieldsValue();
    this.props.getTableData({ page: 1, ...val });
  };

  // 重置
  handleFormReset = () => {
    this.props.form.resetFields();
  };

  // 渲染表单
  renderForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Form onSubmit={this.submit} layout="inline">
        <Row gutter={{ lg: 24, md: 12, sm: 6 }}>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="规则名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="Client">
              {getFieldDecorator('client')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="参数">
              {getFieldDecorator('parameterField')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="Type">
              {getFieldDecorator('sourceType')(
                <Select placeholder="请选择">
                  <Option value="">全部</Option>
                  {typeList.map(item => (
                    <Option key={item.value} value={item.value}>
                      {item.text}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="参数类型">
              {getFieldDecorator('paramType')(
                <Select placeholder="请选择">
                  <Option value="">全部</Option>
                  {paramTypeList.map(item => (
                    <Option key={item.value} value={item.value}>
                      {item.text}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择">
                  {statuList.map(item => (
                    <Option key={item.value} value={item.value}>
                      {item.text}
                    </Option>
                  ))}
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
  };

  render() {
    return <div className="tableListForm">{this.renderForm()}</div>;
  }
}

/**
 * 页面根组件
 */
@Form.create()
class Rule extends Component {
  state = {
    formValues: {
      page: 1,
      rows: 10,
    },
    list: [],
    total: 0,
    loading: false,
    visible: false,
  };

  // 设置列
  columns = [
    {
      title: '规则名称',
      dataIndex: 'name',
      width: 200,
    },
    {
      title: '资源',
      dataIndex: 'sourcePath',
      // width: 200,
    },
    {
      title: '参数',
      dataIndex: 'parameterField',
      width: 200,
    },
    {
      title: 'OP',
      dataIndex: 'op',
      width: 100,
    },
    {
      title: '值',
      dataIndex: 'value',
      width: 150,
    },
  ];

  // 接收父页面传值
  componentWillReceiveProps(nextProps) {
    this.setState({
      visible: nextProps.visible,
    });
  }

  // 分页
  handleStandardTableChange = pagination => {
    this.getTableData({
      page: pagination.current,
      rows: pagination.pageSize,
    });
  };

  // 获取表格数据
  getTableData = (options = {}) => {
    const { formValues } = this.state;
    const query = Object.assign({}, formValues, options);

    this.setState({
      formValues: query,
      loading: true,
    });

    api.dataauth.getRules(query, true).then(data => {
      this.setState({
        list: data.rows,
        total: data.total,
        loading: false,
      });
    });
  };

  // 点击确定
  handleOk = () => {
    this.props.getData(this.state.data);
  };

  // 点击取消
  handleCancel = () => {
    this.props.closeMask(false);
    this.setState({
      visible: false,
    });
  };

  render() {
    const {
      formValues: { page: current, rows: pageSize },
      list,
      total,
      loading,
      visible,
    } = this.state;
    const data = { list, pagination: { current, pageSize, total } };

    const rowSelection = {
      type: 'radio',
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          data: selectedRows[0],
        });
      },
    };

    return (
      <div>
        <Modal
          width="1200px"
          title="规则列表"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Search getTableData={this.getTableData} />
          <Table
            scroll={{ x: 800, y: 400 }}
            loading={loading}
            dataSource={data.list}
            pagination={data.pagination}
            rowKey="id"
            rowSelection={rowSelection}
            columns={this.columns}
            onChange={this.handleStandardTableChange}
          />
        </Modal>
      </div>
    );
  }
}

export default Rule;

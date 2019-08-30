import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Dropdown,
  Form,
  Icon,
  Input,
  InputNumber,
  Menu,
  Row,
  Select,
  message,
} from 'antd';
import React, { Component, Fragment } from 'react';
import router from 'umi/router';
import Link from 'umi/link';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

import StandardTable from '@/components/StandardTable';

import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

// 认证
const renzhengMap = {
  0: {
    value: 'default',
    text: '未认证',
  },
  1: {
    value: 'processing',
    text: '审核中',
  },
  2: {
    value: 'success',
    text: '已认证',
  },
};

// 冻结
const dongjieMap = {
  0: {
    value: 'error',
    text: '冻结',
  },
  1: {
    value: 'success',
    text: '活跃',
  },
};

// 完整
const wanzhengMap = {
  0: {
    value: 'default',
    text: '不完整',
  },
  1: {
    value: 'success',
    text: '完整',
  },
};

class Maintain extends Component {
  state = {
    selectedRows: [],
    expandForm: true,
    data: {},
  };

  columns = [
    {
      title: '客户编号',
      dataIndex: 'code',
      width: 150,
      render(val: number) {
        return (
          <Link to={`/partner/maintain/details/${val}`}>{val}</Link>
        );
      },
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: 100,
    },
    {
      title: '认证',
      dataIndex: 'renzheng',
      width: 150,
      filters: [
        {
          value: 'default',
          text: '未认证',
        },
        {
          value: 'processing',
          text: '审核中',
        },
        {
          value: 'success',
          text: '已认证',
        },
      ],
      render(val: number) {
        return <Badge status={renzhengMap[val].value} text={renzhengMap[val].text} />;
      },
    },
    {
      title: '冻结',
      dataIndex: 'dongjie',
      width: 150,
      filters: [
        {
          value: 'error',
          text: '冻结',
        },
        {
          value: 'success',
          text: '活跃',
        },
      ],
      render(val: number) {
        return <Badge status={dongjieMap[val].value} text={dongjieMap[val].text} />;
      },
    },
    {
      title: '完整',
      dataIndex: 'wanzheng',
      width: 150,
      filters: [
        {
          value: 'default',
          text: '不完整',
        },
        {
          value: 'success',
          text: '完整',
        },
      ],
      render(val: number) {
        return <Badge status={wanzhengMap[val].value} text={wanzhengMap[val].text} />;
      },
    },
    {
      title: '移动电话',
      dataIndex: 'mobile',
      width: 100,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 100,
    },
    {
      title: '电话',
      dataIndex: 'phone',
      width: 100,
    },
    {
      title: '地址',
      dataIndex: 'address',
      width: 300,
    },
    {
      fixed: 'right',
      title: '操作',
      width: 150,
      render: (text, record: object) => {
        const { code } = record;
        const menu = (
          <Menu>
            <Menu.Item><a href="">认证</a></Menu.Item>
            <Menu.Item><a href="">冻结</a></Menu.Item>
          </Menu>
        );
        return (
          <Fragment>
            <Link to={`/partner/maintain/edit/${code}`}>修改</Link>
            <Divider type="vertical" />
            <Dropdown overlay={menu}>
              <a className="ant-dropdown-link" href="#">
                更多操作 <Icon type="down" />
              </a>
            </Dropdown>
          </Fragment>
        );
      },
    },
  ];

  componentDidMount() {
    this.getData();
  }

  handleSearch = e => {
    e.preventDefault();
    this.getData();
  };

  getData = () => {
    const data = [];
    for (let i = 0; i < 25; i++) {
      data.push({
        id: i + 1,
        code: i + 1,
        name: `name${i}`,
        renzheng: 1,
        dongjie: 0,
        wanzheng: 1,
        mobile: '18735818888',
        email: '123@qq.com',
        phone: '123456789',
        address: '上海市松江区',
      });
    }
    this.setState({
      data: {
        pagination: {
          pageSize: 10,
        },
        list: data,
      },
    });
  }

  handleModalVisible = () => {
    router.push('/partner/maintain/edit');
  };

  handleSelectRows = (rows: []) => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleStandardTableChange = () => {
    console.log(3);
  };

  handleFormReset = () => {
    console.log(3);
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

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={12}>
            <FormItem label="编号">
              {getFieldDecorator('code')(<Input />)}
            </FormItem>
          </Col>
          <Col md={6} sm={12}>
            <FormItem label="名称">
              {getFieldDecorator('name')(<Input />)}
            </FormItem>
          </Col>
          <Col md={6} sm={12}>
            <FormItem label="移动电话">
              {getFieldDecorator('mobile')(<Input />)}
            </FormItem>
          </Col>
          <Col md={6} sm={12}>
            <FormItem label="Email">
              {getFieldDecorator('email')(<Input />)}
            </FormItem>
          </Col>
          <Col md={6} sm={12}>
            <FormItem label="认证状态">
              {getFieldDecorator('renzheng')(
                <Select placeholder="请选择">
                  <Option value="0">未认证</Option>
                  <Option value="1">已认证</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={12}>
            <FormItem label="销售状态">
              {getFieldDecorator('xiaoshou')(
                <Select placeholder="请选择">
                  <Option value="0">未认证</Option>
                  <Option value="1">已认证</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={12}>
            <FormItem label="销售状态">
              {getFieldDecorator('xiaoshou')(
                <RangePicker />,
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={12}>
            <FormItem label="数据状态">
              {getFieldDecorator('shuju')(
                <Select placeholder="请选择">
                  <Option value="0">未认证</Option>
                  <Option value="1">已认证</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={12}>
            <FormItem label="区域归属">
              {getFieldDecorator('quyu')(
                <Input />,
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={12}>
            <FormItem label="销售归属">
              {getFieldDecorator('xiaoshouguishu')(
                <Input />,
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={12}>
            <FormItem label="开票方">
              {getFieldDecorator('kaipiao')(
                <Input />,
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
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={12}>
            <FormItem label="编号">
              {getFieldDecorator('code')(<Input />)}
            </FormItem>
          </Col>
          <Col md={6} sm={12}>
            <FormItem label="名称">
              {getFieldDecorator('name')(<Input />)}
            </FormItem>
          </Col>
          <Col md={6} sm={12}>
            <FormItem label="移动电话">
              {getFieldDecorator('mobile')(<Input />)}
            </FormItem>
          </Col>
          <Col md={6} sm={12}>
            <span className={styles.submitButtons}>
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

  render() {
    const { data, selectedRows } = this.state;
    const loading = false;

    const menu = (
      <Menu selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button>批量操作</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
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

export default Form.create()(Maintain);

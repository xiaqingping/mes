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
  Table,
} from 'antd';
import * as React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

class Operation extends React.Component {
  state = {
    selectedRows: [],
    expandForm: false,
    dataSource: [],
    pagination: {},
  };

  columns = [
    {
      title: '编号',
      dataIndex: 'code',
    },
    {
      title: '业务伙伴',
      dataIndex: 'huoban',
    },
    {
      title: '类型',
      dataIndex: 'type',
    },
    {
      title: '状态',
      dataIndex: 'status',
    },
    {
      title: '操作人',
      dataIndex: 'actionman',
    },
    {
      title: '操作',
      dataIndex: 'action',
    },
  ];

  componentDidMount() {
    this.handleSearch();
  }

  handleSearch = () => {
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
      pagination: {
        pageSize: 10,
      },
      dataSource: data,
    });
  };

  handleModalVisible = () => {
    // router.push('/partner/customer/edit');
  };

  handleSelectRows = rows => {
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
        <Row gutter={{ lg: 24, md: 12, sm: 6 }}>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="编号">
              {getFieldDecorator('code')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="业务伙伴">
              {getFieldDecorator('yewuhuoban')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="类型">
              {getFieldDecorator('type')(
                <Select mode="multiple">
                  <Option value="0">类型1</Option>
                  <Option value="1">类型2</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="状态">
              {getFieldDecorator('status')(
                <Select mode="multiple">
                  <Option value="0">状态1</Option>
                  <Option value="1">状态2</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="完成时间">
              {getFieldDecorator('wanchengshijian')(
                <RangePicker />,
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
        <Row gutter={{ lg: 24, md: 12, sm: 6 }}>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="编号">
              {getFieldDecorator('code')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="业务伙伴">
              {getFieldDecorator('yewuhuoban')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="类型">
              {getFieldDecorator('type')(
                <Select mode="multiple">
                  <Option value="0">类型1</Option>
                  <Option value="1">类型2</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
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
    const { dataSource, pagination, selectedRows } = this.state;
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
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible()}>
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
            {/* <StandardTable
              scroll={{ x: 1300 }}
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            /> */}
            <Table
              rowKey="id"
              dataSource={dataSource}
              columns={this.columns}
              pagination={pagination}
              scroll={{ x: 1300 }}
              loading={loading}
              rowSelection={{ onSelect: rows => this.handleSelectRows(rows) }}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(Operation);

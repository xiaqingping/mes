import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  // Dropdown,
  // Menu,
  // InputNumber,
  DatePicker,
  // Modal,
  // message,
  // Badge,
  // Divider,
  // Steps,
  // Radio,
  Table,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './User.less';
import { getUser } from '@/services/user';

const FormItem = Form.Item;
// const { Step } = Steps;
// const { TextArea } = Input;
const { Option } = Select;
// const RadioGroup = Radio.Group;

/* eslint react/no-multi-comp:0 */
@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    data: [],
    selectedRows: [],
    formValues: {},
    loading: false,
  };

  columns = [
    {
      title: '员工',
      dataIndex: 'employeeCode',
    },
    {
      title: '编号',
      dataIndex: 'loginCode',
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '角色',
      dataIndex: 'roleID',
    },
    {
      title: '大区',
      dataIndex: 'regionCode',
    },
    {
      title: '网点',
      dataIndex: 'officeCode',
    },
    {
      title: '客户',
      dataIndex: 'customerCode',
    },
    {
      title: '测序点',
      dataIndex: 'cxPointId',
    },
    {
      title: '仓库',
      dataIndex: 'storageCode',
    },
    {
      title: '状态',
      dataIndex: 'isdel',
      render(val) {
        return val === 0 ? '正常' : '作废';
      },
    },
    {
      title: '登录时间',
      dataIndex: 'loginDate',
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
    },
    {
      title: 'ID',
      dataIndex: 'code',
    },
  ];

  componentDidMount() {
    const params = {
      page: 1,
      rows: 10,
    };
    this.getUser(params);
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'rule/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  // 获取用户
  getUser = params => {
    this.setState({
      loading: true,
    });
    getUser(params).then(data => {
      this.setState({
        data: data.rows,
        total: data.total,
        loading: false,
      });
    });
  };

  // 新增用户
  addUser = () => {
    // console.log('addUser');
  };

  // 查询
  handleSearch = e => {
    e.preventDefault();

    const { form } = this.props;

    form.validateFields((err, fieldsValue) => {
      // console.log(fieldsValue);
      if (err) return;

      /* eslint-disable */
      // for (const key in fieldsValue) {
      //   if (fieldsValue[key] === '') {
      //     fieldsValue[key] = undefined;
      //   }
      // }

      const params = {
        page: 1,
        rows: 10,
        ...fieldsValue,
      };

      this.setState({
        formValues: params,
      });

      this.getUser(params);
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const params = {
      page: pagination.current,
      rows: pagination.pageSize,
      ...formValues,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    this.getUser(params);
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} type="flex">
          <Col xxl={4} md={6} sm={24}>
            <FormItem label="编号">
              {getFieldDecorator('loginCode')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col xxl={4} md={6} sm={24}>
            <FormItem label="姓名">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col xxl={4} md={6} sm={24}>
            <FormItem label="角色">
              {getFieldDecorator('roleID')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">全部</Option>
                  <Option value="1">BBI_基因</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xxl={4} md={6} sm={24}>
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

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} type="flex">
          <Col xxl={4} md={6} sm={24}>
            <FormItem label="编号">
              {getFieldDecorator('loginCode')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col xxl={4} md={6} sm={24}>
            <FormItem label="姓名">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col xxl={4} md={6} sm={24}>
            <FormItem label="角色">
              {getFieldDecorator('roleID')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">全部</Option>
                  <Option value="1">BBI_基因</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xxl={4} md={6} sm={24}>
            <FormItem label="大区">
              {getFieldDecorator('regionCode')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">全部</Option>
                  <Option value="1">华北大区</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xxl={4} md={6} sm={24}>
            <FormItem label="网点">
              {getFieldDecorator('officeCode')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">全部</Option>
                  <Option value="1">北京</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xxl={4} md={6} sm={24}>
            <FormItem label="员工">
              {getFieldDecorator('employeeCode')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col xxl={4} md={6} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('isdel')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">全部</Option>
                  <Option value="1">正常</Option>
                  <Option value="2">作废</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xxl={4} md={6} sm={24}>
            <FormItem label="登陆时间">
              {getFieldDecorator('beginLoginDate')(
                <DatePicker style={{ width: '100%' }} placeholder="请选择登陆日期" />
              )}
            </FormItem>
          </Col>
          <Col xxl={4} md={6} sm={24}>
            <FormItem label="-">
              {getFieldDecorator('endLoginDate')(
                <DatePicker style={{ width: '100%' }} placeholder="请选择登陆日期" />
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

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const { selectedRows, data, total, loading } = this.state;

    const toolbar = function() {
      return (
        <div className={styles.tableListOperator}>
          <Button icon="plus" type="primary" onClick={() => this.addUser()}>
            新增
          </Button>
          <Button icon="edit" type="primary" onClick={() => this.updateUser()}>
            修改
          </Button>
          <Button icon="save" type="primary" onClick={() => this.saveUser()}>
            保存
          </Button>
          <Button icon="edit" type="primary" onClick={() => this.resetPwd()}>
            重置密码
          </Button>
        </div>
      );
    };

    return (
      <PageHeaderWrapper title="查询表格">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <Table
              title={toolbar}
              size="small"
              rowSelection={{}}
              scroll={{ x: 1400 }}
              selectedRows={selectedRows}
              loading={loading}
              rowKey="id"
              dataSource={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              pagination={{ showSizeChanger: true, showQuickJumper: true, total }}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default TableList;

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
  AutoComplete,
} from 'antd';
import * as React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import api from '@/api'
import DetailsList from './components/details'

const FormItem = Form.Item;
const { Option } = Select;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

// 状态
const status = {
  1: {
    value: 'default',
    text: '未完成',
  },
  2: {
    value: 'success',
    text: '已完成',
  },
};

class Operation extends React.Component {
  state = {
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
    list: [],
    loading: false,
    selectedRows: [],
    detailsVisible: false,
    detailsValue: null,
    // editIndex: -1,
  };

  data = {
    huoban: [
      '13012345678 张三',
      '13112345678 张三',
      '13212345678 张三',
      '13312345678 张三',
      '13412345678 张三',
      '13512345678 张三',
      '13612345678 张三',
      '13712345678 张三',
      '13812345678 张三',
      '13912345678 张三',
      '17112345678 张三',
      '17212345678 张三',
      '17312345678 张三',
      '17412345678 张三',
      '17512345678 张三',
      '17612345678 张三',
      '17712345678 张三',
      '17812345678 张三',
    ],
  };

  columns = [
    {
      title: '编号',
      dataIndex: 'code',
    },
    {
      title: '业务伙伴',
      dataIndex: 'huoban',
      render(text, record) {
          return text ? <span><Icon type="user" /> {text}<br/><span>&nbsp;&nbsp;&nbsp;&nbsp;{record.phone}</span></span> : ''
      },
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 120,
      filters: [
        {
          value: '1',
          text: '新建',
        },
        {
          value: '2',
          text: '修改',
        },
      ],
      render(text) {
        return text === 1 ? '新建' : '修改'
    },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 300,
      align: 'center',
      filters: [
        {
          value: '1',
          text: '未完成',
        },
        {
          value: '2',
          text: '已完成',
        },
      ],
      render(val, record) {
        return <span><Badge status={status[val].value} text={status[val].text}/><br/><span style={{ marginLeft: 85 }}>{val === 2 ? record.actiontime : ''}</span></span>;
      },
    },
    {
      title: '操作人',
      dataIndex: 'actionman',
      align: 'center',
      width: 100,
    },
    {
      title: '操作时间',
      dataIndex: 'actiontime',
      align: 'center',
      width: 100,
    },
    {
      title: '业务伙伴编号',
      dataIndex: 'partnerCode',
      align: 'center',
      width: 150,
    },
    {
      fixed: 'right',
      title: '操作',
      width: 150,
      render: (text, record) => (
          <a onClick={ e => this.showDrawer(record, e)}>查看</a>
        ),
    },
  ];

  componentDidMount() {
    // this.getTableData();
    this.getData();
  }

  showDrawer = (record, e) => {
    e.preventDefault();
    this.setState({
      detailsVisible: true,
      detailsValue: record,
    })
  }

  getData = () => {
    const data = [];
    for (let i = 0; i < 30; i++) {
      data.push({
        id: i + 1,
        code: 100000 + (i + 1),
        huoban: `name${i}`,
        phone: `1${Math.ceil((Math.random() + 0.0001) * 10000000000)}`,
        type: Math.ceil((Math.random() + 0.0001) * 2),
        status: Math.ceil((Math.random() + 0.0001) * 2),
        actionman: `action${i + 10}`,
        actiontime: `2019-9-${Math.ceil((Math.random() + 0.0001) * 30)} 12:30:59`,
        partnerCode: Math.ceil((Math.random() + 0.0001) * 100000), // 1人，2组织
      });
    }
    this.setState({
        pagination: {
          pageSize: 10,
        },
        list: data,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    // this.getTableData({ page: 1 });
    this.getData({ page: 1 });
  }

  handleStandardTableChange = (pagination, filtersArg) => {
    // this.getTableData({
    //   page: pagination.current,
    //   rows: pagination.pageSize,
    //   ...filtersArg,
    // });
    this.getData({
      page: pagination.current,
      rows: pagination.pageSize,
      ...filtersArg,
    });
  }

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  // 获取表格数据
  // getTableData = (options = {}) => {
  //   this.setState({
  //     loading: true,
  //   });
  //   const { form } = this.props;
  //   const { pagination: { current: page, pageSize: rows } } = this.state;
  //   const query = Object.assign(form.getFieldsValue(), { page, rows }, options);

  //   api.series.getSeries(query, true).then(data => {
  //     this.setState({
  //       loading: false,
  //       list: data.rows,
  //       pagination: {
  //         total: data.total,
  //         current: query.page,
  //         pageSize: query.rows,
  //       },
  //     });
  //   });
  // }

  handleFormReset = () => {
    this.props.form.resetFields();
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

  selectValue = (value, option) => {
    console.log('onSelect', value);
  }

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
              {getFieldDecorator('yewuhuoban')(
              <AutoComplete dataSource={this.data.huoban} placeholder="请输入" filterOption={(inputValue, option) =>
                option.props.children.indexOf(inputValue) !== -1
              } />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="类型">
              {getFieldDecorator('type')(
                <Select mode="multiple">
                  <Option value="1">新建</Option>
                  <Option value="2">修改</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="状态">
              {getFieldDecorator('status')(
                <Select mode="multiple">
                  <Option value="1">未完成</Option>
                  <Option value="2">已完成</Option>
                  <Option value="3">部分完成</Option>
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
              {getFieldDecorator('yewuhuoban')(
              <AutoComplete
                onSelect={(value, option) => this.selectValue(value, option)}
                dataSource={this.data.huoban} placeholder="请输入"
                filterOption={(inputValue, option) =>
                  option.props.children.indexOf(inputValue) !== -1
              } />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="类型">
              {getFieldDecorator('type')(
                <Select mode="multiple">
                  <Option value="1">新建</Option>
                  <Option value="2">修改</Option>
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
    const { list, pagination, loading, selectedRows, detailsVisible, detailsValue } = this.state;
    const data = { list, pagination };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className="tableList">
            <div className="tableListForm">{this.renderForm()}</div>
            <div className="tableListOperator">
              {/* <Button icon="plus" type="primary" onClick={() => this.handleAdd()}>
                新建
              </Button> */}
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
        <DetailsList detailsVisible={detailsVisible} detailsValue={detailsValue}/>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(Operation);

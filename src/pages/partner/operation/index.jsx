import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Icon,
  Input,
  Row,
  Select,
  AutoComplete,
} from 'antd';
import * as React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import DetailsList from './components/details'

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

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

function renderOption(item) {
  return (
    <Option key={item.value} text={item.value}>
      <div style={{ display: 'flex' }}>
        <span><Icon type="user" /></span>&nbsp;&nbsp;
        <span>{item.code}</span>&nbsp;&nbsp;
        <span>{item.value}</span>
      </div>
    </Option>
  );
}

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
    typeValue: [],
    partnerVal: [],
  };

  data = {
    huoban: [
      {
      id: 1,
      code: '100',
      value: '张1',
    },
    {
      id: 2,
      code: '101',
      value: '张2',
    },
    {
      id: 3,
      code: '102',
      value: '张3',
    },
    {
      id: 4,
      code: '103',
      value: '张4',
    },
    {
      id: 5,
      code: '104',
      value: '张5',
    },
    {
      id: 6,
      code: '105',
      value: '张6',
    },
    {
      id: 7,
      code: '106',
      value: '张7',
    },
  ],
  };

  val = [];

  select = false;

  columns = [
    {
      title: '编号',
      dataIndex: 'code',
      width: 140,
    },
    {
      title: '业务伙伴',
      dataIndex: 'bpCode',
      render(text, record) {
          return text ? <span style={{ color: '#222222' }}><Icon type="user" /> {text}<br/><span style={{ color: '#999999' }}>{record.bpName}</span></span> : ''
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
        return <span><Badge status={status[val].value} text={status[val].text}/><br/><span style={{ marginLeft: 85 }}>{val === 2 ? record.finishDate : ''}</span></span>;
      },
    },
    {
      title: '操作人',
      dataIndex: 'operatorName',
      width: 300,
      className: 'marginLeft',
      render(val, record) {
        return <span style={{ color: '#222222' }}>{val}<br/><span style={{ color: '#666666' }}>{record.operatorDate}</span></span>;
      },
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
    this.setState({
      partnerVal: this.data.huoban,
    })
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
        bpCode: `name${i}`,
        bpName: `1${Math.ceil((Math.random() + 0.0001) * 10000000000)}`,
        type: Math.ceil((Math.random() + 0.0001) * 2),
        status: Math.ceil((Math.random() + 0.0001) * 2),
        finishDate: `2018-9-${Math.ceil((Math.random() + 0.0001) * 30)} 12:30:59`,
        operatorName: `action${i + 10}`,
        operatorDate: `2019-9-${Math.ceil((Math.random() + 0.0001) * 30)} 12:30:59`,
        // partnerCode: Math.ceil((Math.random() + 0.0001) * 100000), // 1人，2组织
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

  // 重置
  handleFormReset = () => {
    this.props.form.resetFields();
    this.setState({
      typeValue: [],
    })
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  detailsVisibleClose = v => {
    this.setState({
      detailsVisible: v,
    })
  }

  renderForm = () => {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  };

  // 业务伙伴筛选
  // eslint-disable-next-line consistent-return
  inputValue = value => {
    const arr = []
    if (!value) {
      return false
    }
    this.data.huoban.forEach(item => {
      if (item.value.indexOf(value) !== -1) {
        arr.push(item);
      }
      if (item.code.indexOf(value) !== -1 && arr.indexOf(item)) { arr.push(item); }
    })
    this.setState({
      partnerVal: arr,
      // allowClear: 'ture',
    });
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { typeValue, partnerVal } = this.state;
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
                onSearch={this.inputValue}
                dataSource={partnerVal.map(renderOption)}
                placeholder="请输入"
                optionLabelProp="text"
                />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="类型">
              {getFieldDecorator('type', typeValue ? { initialValue: typeValue } : 'type')(
                <Select mode="multiple" showArrow>
                  <Option value="1">新建</Option>
                  <Option value="2">修改</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="状态">
              {getFieldDecorator('status')(
                <Select mode="multiple" showArrow>
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
    const { typeValue, partnerVal } = this.state;
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
                allowClear
                onSearch={this.inputValue}
                dataSource={partnerVal.map(renderOption)}
                placeholder="请输入"
                optionLabelProp="value"
                />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="类型">
              {getFieldDecorator('type', typeValue ? { initialValue: typeValue } : 'type')(
                <Select mode="multiple" showArrow onSelect={() => { console.log(123) }}>
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
        <DetailsList detailsVisible={detailsVisible}
        detailsVisibleClose={v => { this.detailsVisibleClose(v) }}
        detailsValue={detailsValue}/>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(Operation);

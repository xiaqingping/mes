import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Popconfirm
} from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import api from '@/api';

const FormItem = Form.Item;
const { Option } = Select;
const gridStyle = {
  width: '50%',
  textAlign: 'center',
  // background:'pink'
};
// 年
// const year= [
//   { id: 2019, name: '2019' },
//   { id: 2018, name: '2018' },
//   { id: 2017, name: '2017' },
//   { id: 2016, name: '2016' },
//   { id: 2015, name: '2015' }
// ];
// 月
// const month = [
//   { id: 1, name: '1' },
//   { id: 2, name: '2' },
//   { id: 3, name: '3' },
//   { id: 4, name: '4' },
//   { id: 5, name: '5' },
//   { id: 6, name: '6' },
//   { id: 7, name: '7' },
//   { id: 8, name: '8' },
//   { id: 9, name: '9' },
//   { id: 10, name: '10' },
//   { id: 11, name: '11' },
//   { id: 12, name: '12' }
// ]
// 状态
const status = [
  { value: 0, name: '正常' },
  { value: 1, name: '已删除' },
];
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
  // 工资管理
  columns = [
    {
      title: '员工编号',
      dataIndex: 'employeeCode',
      width: 100,
    },
    {
      title: '员工名称',
      dataIndex: 'employeeName',
      // dataIndex: 'name',
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
    // {
    //   title: '状态',
    //   dataIndex: 'status',
    //   width: 100,
    //   render(val) {
    //     return <span>{status[val].name}</span>;
    //   },
    // },
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
        // if (editIndex !== index && status === 1) {
        //   actions = (
        //     <>
        //       <a>删除</a>
        //       <Divider type="vertical" />
        //       <a>修改</a>
        //       </>
        //   );
        // }
        // if (editIndex === index) {
        //   actions = (
        //     <>
        //       <a>保存</a>
        //       <Divider type="vertical" />
        //       <a>退出</a>
        //     </>
        //   );
        // }
        // return actions;
        if (editIndex !== index && status === 1) {
          actions = (
            <>
              <Popconfirm title="确定作废数据？" onConfirm={() => this.deleteRow(row)}>
                <a>删除</a>
              </Popconfirm>
              <Divider type="vertical" />
              <a onClick={() => this.editRow(index)}>修改</a>
            </>
          );
        }
        if (editIndex === index) {
          actions = (
            <>
              <a onClick={() => this.saveRow(index)}>保存</a>
              <Divider type="vertical" />
              <a onClick={() => this.cancelEdit(row, -1)}>退出</a>
            </>
          );
        }
        return actions;
      },
    },
  ];
// 工资明细
  columnss = [
    {
      title: '编号',
      dataIndex: 'typeCode',
      width: 100,
    },
    {
      title: '名称',
      dataIndex: 'typeName',
      width: 100,
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 100,
    },
    {
      title: '金额',
      dataIndex: 'amount',
      width: 100,
    }
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
          <Col lg={6} md={8} sm={12}>
            <FormItem label="员工编号">
              {getFieldDecorator('code')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="员工名称">
              {getFieldDecorator('staffName')(<Input />)}
            </FormItem>
          </Col>
          {/* <Col lg={4} md={8} sm={12}>
            <FormItem label="年">
              <Select>
                {getFieldDecorator('year', { initialValue: '1' })(
                  <Select>
                    {year.map(item => <Option key={item.value} value={item.value}>{item.text}</Option>)}
                  </Select>,
                )}
              </Select>,
            </FormItem>
          </Col> */}
          <Col lg={6} md={8} sm={12}>
            <FormItem label="年">
              {getFieldDecorator('year', { initialValue: '' })(
                <Select>
                  <Option value="1">1</Option>
                  <Option value="2">2</Option>
                  <Option value="3">3</Option>
                  <Option value="4">4</Option>
                  <Option value="5">5</Option>
                  <Option value="5">6</Option>
                  <Option value="5">7</Option>
                  <Option value="5">8</Option>
                  <Option value="5">9</Option>
                  <Option value="5">10</Option>
                  <Option value="5">11</Option>
                  <Option value="5">12</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="月">
              {getFieldDecorator('month', { initialValue: '' })(
                <Select>
                  <Option value="1">2019</Option>
                  <Option value="2">2018</Option>
                  <Option value="3">2017</Option>
                  <Option value="4">2016</Option>
                  <Option value="5">2015</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="状态">
              {getFieldDecorator('status', { initialValue: '1' })(
                <Select>
                  <Option value="1">正常</Option>
                  <Option value="2">已删除</Option>
                </Select>
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
  
  // 作废
  handleDelete = () => {
    console.log('delete');
  }
  // 上传excel文件
  handleUploading = () => {
    console.log('uploading');
  }
  render() {
    const { list, pagination, loading, selectedRows } = this.state;
    const data = { list, pagination };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Card.Grid  style={gridStyle} >
            <div className="tableList">
              <div className="tableListForm">{this.renderForm()}</div>
              <div className="tableListOperator">
                <Button icon="plus" type="primary" onClick={() => this.handleAdd()}>
                  新建
                </Button>
                <Button icon="delete" type="primary" onClick={() => this.handleDelete()}>
                  作废
                </Button>
                <Button icon="file-excel" type="primary" onClick={() => this.handleUploading()}>
                  excel上传
                </Button>
              </div>
              <StandardTable
                scroll={{ x: 800 }}
                selectedRows={selectedRows}
                loading={loading}
                data={data}
                columns={this.columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
              />
            </div>
          </Card.Grid>
          {/* 工资明细 */}
          <Card.Grid >
            <p>工资明细</p>
            <div className="tableList">
              <StandardTable
                scroll={{ x: 700 }}
                selectedRows={selectedRows}
                loading={loading}
                data={data}
                columns={this.columnss}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
              />
            </div>
          </Card.Grid>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(pay);


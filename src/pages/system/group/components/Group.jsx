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
import StandardTable from '@/components/StandardTable';
import api from '@/api';

const FormItem = Form.Item;
// const { Option } = Select;
// const { Search } = Input;

const gridStyle = {
  width: '35%',
  textAlign: 'center',
};
const onGridStyle = {
  width: '100%',
  textAlign: 'center',
};

class Group extends Component {
  state = {
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
    list: [],
    loading: false,
    selectedRows: [],
    // groupId: '',
  }

  // 设置列 分组
  columns = [
    {
      title: '分组名称',
      dataIndex: 'name',
      width: 300,
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

  constructor (props) {
    super(props);
    this.setstate = { groupId: 0 };
  }

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

  handleSearchGroupRules = data => {
    this.setState({
      groupId: data.id,
    })
  }

  // 获取表格数据 分组
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

  // 渲染表单
  renderForm = () => this.renderAdvancedForm()

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
    const { list, pagination, loading, selectedRows, groupId } = this.state;
    const data = { list, pagination };

    return (
      <>
        <Card.Grid style={onGridStyle} hoverable={false}>
        <div className="tableListForm">{this.renderForm()}</div>
        </Card.Grid>
        <Card.Grid style={gridStyle} bordered="false" hoverable={false}>
          <div className="tableList">
            <StandardTable
              scroll={{ x: 400 }}
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              onRowClick={
                record => {
                  this.handleSearchGroupRules(record);
                }
              }
            />
          </div>
        </Card.Grid>
      </>
    );
  }
}

export default Form.create()(Group);

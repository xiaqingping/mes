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

// const FormItem = Form.Item;
// const { Option } = Select;
// const { Search } = Input;

const gridStyle2 = {
  width: '65%',
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
  }

  // 设置列 分组
  columns = [
    {
      title: '名称',
      dataIndex: 'name',
      width: 300,
    },
    {
      title: 'Client',
      dataIndex: 'sourceClient',
      width: 200,
    },
    {
      title: 'Type',
      dataIndex: 'sourceType',
      width: 100,
    },
    {
      title: '资源',
      dataIndex: 'sourcePath',
      width: 150,
    },
    {
      title: '资源描述',
      dataIndex: 'sourceDesc',
      width: 200,
    },
    {
      title: '参数类型',
      dataIndex: 'paramType',
      width: 100,
    },
    {
      title: '参数描述',
      dataIndex: 'parameterDesc',
      width: 150,
    },
    {
      title: 'OP',
      dataIndex: 'op',
      width: 100,
    },
    {
      title: '值',
      dataIndex: 'value',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
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
  };

  // 获取表格数据
  getTableData = (options = {}) => {
    this.setState({
        loading: true,
    });
    // const { form } = this.props;
    const { pagination: { current: page, pageSize: rows } } = this.state;
    // const query = Object.assign(form.getFieldsValue(), { page, rows }, options);
    const groupId = 0;
    // const groupId = this.context.value;
    // console.log(this.context.value);
    // if (groupId === undefined) {
    //   this.groupId = 0;
    // }
    // console.log(groupId);

    api.system.getGroupRules(groupId).then(data => {
      this.setState({
        loading: false,
        list: data.rows,
        pagination: {
          total: data.total,
          current: page,
          pageSize: rows,
        },
      });
    });
  }

  // 新增
  handleAdd = () => {
    console.log('add');
  }

  render() {
    const { list, pagination, loading, selectedRows } = this.state;
    const data = { list, pagination };

    return (
      <Card.Grid style={gridStyle2} bordered="false" hoverable={false}>
        <div className="groupRuleTableList">
          <StandardTable
            scroll={{ x: 2000 }}
            selectedRows={selectedRows}
            loading={loading}
            data={data}
            columns={this.columns}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
          />
        </div>
      </Card.Grid>
    );
  }
}

export default Form.create()(Group);

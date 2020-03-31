// 流程列表
import { Form, Table, Divider } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';

// import StandardTable from '@/components/StandardTable';
// import EditableCell from '@/components/EditableCell';
// import { formatter } from '@/utils/utils';
// import api from '@/api';

class FiledList extends Component {
  tableSearchFormRef = React.createRef();

  tableFormRef = React.createRef();

  state = {
    // 分页参数
    // pagination: {},
    // 表格数据
    list: [],
    // 加载状态
    loading: true,
    // 选中行数据
    // selectedRows: [],
    // 编辑行
    // editIndex: -1,
    // 自减ID（新增数据时，提供负数id做为列表的key）
    // id: 0,
  };

  // 顶部表单默认值
  initialValues = {
    status: 1,
    page: 1,
    rows: 10,
  };

  // 组件挂载时
  componentDidMount() {
    this.getCacheData();
    this.getTableData(this.initialValues);
  }

  // 获取此页面需要用到的基础数据
  getCacheData = () => {};

  // 分页
  handleStandardTableChange = data => {
    this.getTableData({
      page: data.current,
      rows: data.pageSize,
    });
  };

  // 选择行
  // handleSelectRows = rows => {
  //   this.setState({
  //     selectedRows: rows,
  //   });
  // };

  // 获取表格数据
  getTableData = () => {
    const data = this.props.projectDetail.filedList;
    this.setState({
        list: data,
        // pagination: {
        //   current: options.page,
        //   pageSize: options.rows,
        //   total: data.total,
        // },
        loading: false,
        // editIndex: -1,
      });
  };

  render() {
    const {
      // pagination,
      // selectedRows,
      list, loading
    } = this.state;
    let tableWidth = 0;

    // const components = {
    //   body: {
    //     cell: EditableCell,
    //   },
    // };

    let columns = [
      {
        title: '文件名称',
        dataIndex: 'name',
        width: 150,
        render: (text, row) => (
          <>
            {text}
            <br />
            {row.processName}
          </>
        ),
      },
      {
        title: '描述',
        dataIndex: 'decs',
        width: 350,
      },
      {
        title: '修改时间',
        dataIndex: 'changerTime',
        width: 150,
      },
      {
        title: '大小',
        dataIndex: 'size',
        width: 100,
        render: text => `${text  }kb`
      },
      {
        title: '操作',
        width: 150,
        render: () => (
          <>
            <a onClick={() => console.log(111)}>删除</a>
            <Divider type="vertical" />
            <a onClick={() => console.log(222)}>修改</a>
          </>
        ),
      },
    ];

    columns = columns.map(col => {
      // if (!col.width) col.width = 100;
      tableWidth += col.width;
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record, rowIndex) => ({
          record,
          rules: col.rules,
          inputType: col.inputType,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: rowIndex === this.state.editIndex,
        }),
      };
    });

    return (
      <>
        <Form ref={this.tableFormRef}>
          <Table
            scroll={{ x: tableWidth, y: 400 }}
            rowKey="id"
            loading={loading}
            dataSource={list}
            // selectedRows={selectedRows}
            rowSelection="checkbox"
            // pagination={pagination}
            columns={columns}
            onChange={this.handleStandardTableChange}
          />
        </Form>
      </>
    );
  }
}

export default connect(({ projectDetail }) => ({
  projectDetail,
}))(FiledList);

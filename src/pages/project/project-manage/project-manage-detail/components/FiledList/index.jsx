// 流程列表
import { Form, Table, Col, Input, Button } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import { FileExclamationOutlined } from '@ant-design/icons';
import TableSearchForm from '@/components/TableSearchForm';

// import StandardTable from '@/components/StandardTable';
// import EditableCell from '@/components/EditableCell';
// import { formatter } from '@/utils/utils';
// import api from '@/api';
const FormItem = Form.Item;
const { Search } = Input;

class FiledList extends Component {
  tableSearchFormRef = React.createRef();

  tableFormRef = React.createRef();

  state = {
    list: [], // 表格数据
    loading: true, // 加载状态
    // pagination: {},
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
  // handleStandardTableChange = data => {
  //   this.getTableData({
  //     page: data.current,
  //     rows: data.pageSize,
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

  // 顶部表单简单搜索
  simpleForm = () => (
    <>
      <Col lg={6} md={8} sm={12}>
        <FormItem label="" name="fieldName">
          <Search />
        </FormItem>
      </Col>
      <Col className="classdownBtn" lg={3} md={8} sm={12}>
        <FormItem label="" name="">
          <Button>下载</Button>
        </FormItem>
      </Col>
    </>
  );

  render() {
    const {
      // pagination,
      // selectedRows,
      list,
      loading,
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
        render: value => (
          <>
            {
              // console.log(value)
            }
            <FileExclamationOutlined style={{ fontSize: 18 }} />
            <span style={{ marginLeft: 10 }}>{value}</span>
          </>
        ),
      },
      {
        title: '描述',
        dataIndex: 'decs',
        width: 350,
      },
      {
        title: '来源',
        dataIndex: 'processName',
        width: 150,
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
        render: text => `${text}kb`,
      },
      {
        title: '操作',
        width: 150,
        render: () => (
          <>
            <a onClick={() => console.log('删除')}>删除</a>
          </>
        ),
      },
    ];

    columns = columns.map(col => {
      // if (!col.width) col.width = 100;
      // console.log(col)
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
        <TableSearchForm
          ref={this.tableSearchFormRef}
          initialValues={this.initialValues}
          getTableData={this.getTableData}
          simpleForm={this.simpleForm}
        />
        {/* <Form ref={this.tableSearchFormRef}>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="" name="fieldName">
              <Search />
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
          <FormItem label="" name="">
              <Button>下载</Button>
            </FormItem>
          </Col>
        </Form> */}
        <Form ref={this.tableFormRef}>
          {console.log(list)}
          <Table
            className="scott"
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

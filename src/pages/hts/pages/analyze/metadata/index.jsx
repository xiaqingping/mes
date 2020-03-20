/**
 * 元数据分析
 */
import { Card, Col, Divider, Form, Input } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import TableSearchForm from '@/components/TableSearchForm';
import EditableCell from '@/components/EditableCell';
import api from '@/api';

const FormItem = Form.Item;

class Metadata extends Component {
  tableSearchFormRef = React.createRef();

  tableFormRef = React.createRef();

  state = {
    // 分页参数
    pagination: {
      // current: 1,
      // pageSize: 10,
      // total: 0,
    },
    // 表格数据
    list: [],
    // 加载状态
    loading: true,
    // 选中行数据
    selectedRows: [],
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

  // 顶部表单简单搜索
  simpleForm = () => (
    <>
      <Col lg={6} md={8} sm={12}>
        <FormItem label="编号" name="code">
          <Input />
        </FormItem>
      </Col>
      <Col lg={6} md={8} sm={12}>
        <FormItem label="名称" name="name">
          <Input />
        </FormItem>
      </Col>
      <Col lg={6} md={8} sm={12}>
        <FormItem label="移动电话" name="mobile">
          <Input />
        </FormItem>
      </Col>
    </>
  );

  // 顶部表单复杂搜索
  advancedForm = () => <></>;

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
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  // 获取表格数据
  getTableData = (options = {}) => {
    this.setState({ loading: true });

    const formData = this.tableSearchFormRef.current.getFieldsValue();
    const { pagination } = this.state;
    const { current: page, pageSize: rows } = pagination;
    const data = {
      page,
      rows,
      ...formData,
      ...options,
    };

    const list = Object.keys(Array.from({ length: 10 })).map(() => ({
      code: '123',
      projectCode: '456',
      taskCode: '789',
      operator: '老王',
      startTime: '2020/3/19',
      endTime: '2020/3/20',
      status: 1,
    }));
    const res = {
      total: 10,
      rows: list,
    };
    this.setState({
      list: res.rows,
      pagination: {
        current: data.page,
        pageSize: data.rows,
        total: res.total,
      },
      loading: false,
    });
  };

  // 保存和修改之后的保存
  saveRow = async index => {
    const { storages } = this.props;
    try {
      const row = await this.tableFormRef.current.validateFields();
      const storageName = storages.filter(e => e.code === row.storageCode)[0].name;
      const { list } = this.state;
      const newData = { ...list[index], ...row, storageName };
      if (newData.id < 0) {
        api.seqfactory.addSeqfactory(newData).then(() => this.getTableData());
      } else {
        api.seqfactory.updateSeqfactory(newData).then(() => this.getTableData());
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { pagination, selectedRows, list, loading } = this.state;
    let tableWidth = 0;

    const components = {
      body: {
        cell: EditableCell,
      },
    };

    let columns = [
      {
        title: '编号',
        dataIndex: 'code',
      },
      {
        title: '项目编号',
        dataIndex: 'projectCode',
      },
      {
        title: '任务编号',
        dataIndex: 'taskCode',
      },
      {
        title: '操作人',
        dataIndex: 'operator',
      },
      {
        title: '开始/结束时间',
        dataIndex: 'time',
        render: (text, row) => (
          <>
            {row.startTime}
            <br />
            {row.endTime}
          </>
        ),
      },
      {
        title: '状态',
        dataIndex: 'status',
      },
      {
        fixed: 'right',
        title: '操作',
        width: 130,
        render: () => (
          <>
            <a>终止</a>
            <Divider type="vertical" />
            <a>挂起</a>
            <Divider type="vertical" />
            <a>参数</a>
          </>
        ),
      },
    ];

    columns = columns.map(col => {
      const colWidth = col.width || 100;
      tableWidth += colWidth;
      return {
        ...col,
        width: colWidth,
      };
    });

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className="tableList">
            <TableSearchForm
              ref={this.tableSearchFormRef}
              initialValues={this.initialValues}
              getTableData={this.getTableData}
              simpleForm={this.simpleForm}
            />
            <Form ref={this.tableFormRef}>
              <StandardTable
                scroll={{ x: tableWidth }}
                rowClassName="editable-row"
                selectedRows={selectedRows}
                components={components}
                loading={loading}
                data={{ list, pagination }}
                columns={columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
              />
            </Form>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect()(Metadata);

/**
 * 资源列表
 */
import { Card, Col, Form, Input, Select } from 'antd';
import React, { Component } from 'react';
// import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import TableSearchForm from '@/components/TableSearchForm';
import EditableCell from '@/components/EditableCell';
// import { formatter } from '@/utils/utils';
import api from '@/api';

const FormItem = Form.Item;
const { Option } = Select;

class Sources extends Component {
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
    // 编辑行
    editIndex: -1,
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

  // 顶部表单简单搜索
  simpleForm = () => (
    <>
      <Col lg={6} md={8} sm={12}>
        <FormItem label="Client" name="client">
          <Input />
        </FormItem>
      </Col>
      <Col lg={6} md={8} sm={12}>
        <FormItem label="Type" name="type">
          <Select allowClear>
            {/* {commonData.type.map(item =>
                <Option value={item.id} key={item.id}>{item.name}</Option>,
              )} */}
            <Option value={1} key={1}>
              {1}
            </Option>
            ,
          </Select>
        </FormItem>
      </Col>
    </>
  );

  // 顶部表单复杂搜索
  advancedForm = () => <></>;

  // 获取此页面需要用到的基础数据
  getCacheData = () => {
    const { system } = this.props;
    console.log(system);
  };

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

    api.dataauth.getSources(data, true).then(res => {
      this.setState({
        list: res.rows,
        pagination: {
          current: data.page,
          pageSize: data.rows,
          total: res.total,
        },
        loading: false,
        editIndex: -1,
      });
    });
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
        title: 'client',
        dataIndex: 'client',
        width: 100,
      },
      {
        title: 'path',
        dataIndex: 'path',
        width: 180,
      },
      {
        title: '描述',
        dataIndex: 'desc',
        width: 200,
      },
      {
        title: 'type',
        dataIndex: 'type',
        width: 200,
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
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className="tableList">
            <TableSearchForm
              ref={this.tableSearchFormRef}
              initialValues={this.initialValues}
              getTableData={this.getTableData}
              simpleForm={this.simpleForm}
            />
            <div className="tableListOperator">
              {/* <Button type="primary" onClick={() => this.handleAdd()}>
                <PlusOutlined />新建
              </Button> */}
            </div>
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

export default Sources;

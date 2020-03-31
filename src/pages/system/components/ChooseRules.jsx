/**
 * 规则列表模态框
 */
import {
  // Card,
  Col,
  Form,
  Input,
  Select,
  Modal,
  Table,
} from 'antd';
import React, { Component } from 'react';
import TableSearchForm from '@/components/TableSearchForm';
// import { formatter } from '@/utils/utils';
import api from '@/api';

const FormItem = Form.Item;
const { Option } = Select;

class ChooseRules extends Component {
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
    // selectedRows: [],
    // 编辑行
    // editIndex: -1,
    // 自减ID（新增数据时，提供负数id做为列表的key）
    // id: 0,
    visible: false, // 遮罩层的判断
  };

  // 顶部表单默认值
  initialValues = {
    status: 1,
    page: 1,
    rows: 10,
  };

  // 组件挂载时
  componentDidMount() {
    this.props.onRef(this);
    this.getTableData(this.initialValues);
  }

  // 是否显示窗口
  visibleShow = visible => {
    this.setState({ visible });
    this.getTableData(this.initialValues);
  };

  // 回传数据
  handleSelect = rows => {
    this.props.getData(rows);
    this.handleCancel();
  };

  // 关闭窗口
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  // 分页
  handleStandardTableChange = data => {
    this.getTableData({
      page: data.current,
      rows: data.pageSize,
    });
  };

  // 获取表格数据
  getTableData = (options = {}) => {
    this.setState({ loading: true });

    const formData = this.tableSearchFormRef.current
      ? this.tableSearchFormRef.current.getFieldsValue()
      : '';
    // const formData = this.tableSearchFormRef.current.getFieldsValue();
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
        // editIndex: -1,
      });
    });
  };

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
            {/* {this.props.basicStatus.map(e =>
              <Option value={e.id} key={e.id}>{e.name}</Option>,
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

  render() {
    const { pagination, list, loading, visible } = this.state;
    let tableWidth = 0;

    let columns = [
      {
        title: 'client',
        dataIndex: 'client',
        width: 100,
      },
      {
        title: 'path',
        dataIndex: 'path',
        width: 200,
      },
      {
        title: '描述',
        dataIndex: 'desc',
        width: 150,
      },
      {
        title: 'type',
        dataIndex: 'type',
        width: 100,
      },
      {
        title: '操作',
        dataIndex: 'actions',
        fixed: 'right',
        width: 100,
        render: (text, record) => <a onClick={() => this.handleSelect(record)}>选择</a>,
      },
    ];

    columns = columns.map(col => {
      if (!col.width) col.width = 100;
      tableWidth += col.width;
      return col;
    });

    return (
      <div>
        <Modal
          width="1200px"
          title="客户列表"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
        >
          <TableSearchForm
            ref={this.tableSearchFormRef}
            initialValues={this.initialValues}
            getTableData={this.getTableData}
            simpleForm={this.simpleForm}
          />
          <div className="tableListOperator" />
          <Table
            scroll={{ x: tableWidth, y: 400 }}
            rowKey="id"
            loading={loading}
            dataSource={list}
            pagination={pagination}
            columns={columns}
            onChange={this.handleStandardTableChange}
          />
        </Modal>
      </div>
    );
  }
}

export default ChooseRules;

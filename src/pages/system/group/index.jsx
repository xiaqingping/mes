/**
 * 分组列表
 */
import {
  Button,
  Card,
  Col,
  Row,
  Divider,
  Form,
  Input,
  // Select,
  message,
  Popconfirm,
  Table,
  // DatePicker
} from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { PlusOutlined } from '@ant-design/icons';
import StandardTable from '@/components/StandardTable';
import TableSearchForm from '@/components/TableSearchForm';
import EditableCell from '@/components/EditableCell';
import { formatter } from '@/utils/utils';
// import Search from 'antd/lib/input/Search';
import api from '@/api';

const FormItem = Form.Item;
// const { Option } = Select;
// const { RangePicker } = DatePicker;

class Group extends Component {
  tableSearchFormRef = React.createRef();

  tableFormRef = React.createRef();

  state = {
    // 分页参数
    pagination: {},
    // id: 0,   // 自减ID（新增数据时，提供负数id做为列表的key）

    // 父表格
    list: [], // 表格数据
    loading: true, // 加载状态
    selectedRows: [], // 选中行数据
    editIndex: -1, // 编辑行

    // 子表格
    dataGR: [],
    editIndexGR: -1,
    loadingGR: false,
    paginationGR: {},
  };

  // 顶部表单默认值
  initialValues = {
    // status: 1,
    page: 1,
    rows: 10,
  };

  // 组件挂载时
  componentDidMount() {
    this.getCacheData();
    this.getTableData(this.initialValues);
    console.log(this.tableSearchFormRef);
    console.log(this.tableFormRef);
  }

  // 获取此页面需要用到的基础数据
  getCacheData = () => {};

  // 选择行
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  // 分页
  handleStandardTableChange = data => {
    this.getTableData({
      page: data.current,
      rows: data.pageSize,
    });
  };

  // 分页  子表格
  handleStandardTableChangeGR = data => {
    console.log(data);
    this.getTableDataGR({
      page: data.current,
      rows: data.pageSize,
    });
  };

  // 获取表格数据
  getTableData = (options = {}) => {
    console.log(options);
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

    api.dataauth.getGroups(data, true).then(res => {
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

  // 获取表格数据  子表格
  getTableDataGR = v => {
    // 编辑状态不获取子列表数据
    const { editIndex } = this.state;
    if (editIndex !== -1) return;

    this.setState({ loadingGR: true });

    const options = this.initialValues;
    const { paginationGR } = this.state;
    const { current: page, pageSize: rows } = paginationGR;
    const data = {
      page,
      rows,
      ...options,
    };
    api.dataauth.getGroupRules(v.id).then(res => {
      this.setState({
        dataGR: res.rows,
        paginationGR: {
          current: data.page,
          pageSize: data.rows,
          total: res.total,
        },
        loadingGR: false,
        editIndexGR: -1,
      });
    });
  };

  // 修改,开启编辑
  editRow = (row, index) => {
    if (this.state.editIndex !== -1) {
      message.warning('请先保存或退出正在编辑的数据');
      return;
    }
    this.tableFormRef.current.setFieldsValue({ ...row });
    this.setState({
      editIndex: index,
    });
  };

  // 修改,开启编辑
  editRowGR = (row, index) => {
    if (this.state.editIndexGR !== -1) {
      message.warning('请先保存或退出正在编辑的数据');
      return;
    }
    this.tableFormRef.current.setFieldsValue({ ...row });
    this.setState({
      editIndexGR: index,
    });
  };

  // 退出编辑
  cancelEdit = (row, index) => {
    if (row.id > 0) {
      this.setState({ editIndex: index });
    } else {
      const { list } = this.state;
      this.setState({
        list: list.filter(e => e.id > 0),
        editIndex: index,
      });
    }
  };

  // 删除数据
  deleteRow = row => {
    api.seqfactory.cancelSeqfactory(row.id).then(() => {
      this.getTableData();
    });
  };

  // 保存和修改之后的保存
  saveRow = async index => {
    try {
      const row = await this.tableFormRef.current.validateFields();
      console.log(row);
      console.log(index);
      const { list } = this.state;
      const newData = { ...list[index], ...row };
      console.log(newData);
      // if (newData.id < 0) {
      //   api.seqfactory.addSeqfactory(newData).then(() => this.getTableData());
      // } else {
      //   api.seqfactory.updateSeqfactory(newData).then(() => this.getTableData());
      // }
    } catch (error) {
      console.log(error);
    }
  };

  // 新增
  handleAdd = () => {
    const { editIndex, id, list } = this.state;
    if (editIndex !== -1) {
      message.warning('请先保存或退出正在编辑的数据');
      return;
    }

    const newId = id - 1;
    this.tableFormRef.current.resetFields();
    this.setState({
      id: newId,
      editIndex: 0,
      list: [
        {
          id: newId,
        },
        ...list,
      ],
    });
  };

  // 顶部表单简单搜索
  simpleForm = () => (
    <>
      <Col lg={6} md={8} sm={12}>
        <FormItem label="分组名称" name="name">
          <Input />
        </FormItem>
      </Col>
    </>
  );

  render() {
    const { pagination, selectedRows, list, loading, paginationGR, dataGR, loadingGR } = this.state;
    const {
      system: { commonData },
    } = this.props;

    let tableWidth = 0;
    let tableWidthGR = 0;

    const components = {
      body: {
        cell: EditableCell,
      },
    };

    let columns = [
      {
        title: '分组名称',
        dataIndex: 'name',
        width: 200,
        editable: true,
        inputType: <Input style={{ width: '90%' }} />,
        rules: [{ required: true, message: '必填' }],
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
                <Popconfirm title="确定作废数据？" onConfirm={() => this.deleteRow(row)}>
                  <a>删除</a>
                </Popconfirm>
                {/* <Divider type="vertical" /> */}
                {/* <a onClick={() => this.editRow(row, index)}>修改</a> */}
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

    let columnGR = [
      {
        title: '名称',
        dataIndex: 'name',
        width: 250,
      },
      // {
      //   title: '规则',
      //   dataIndex: 'ruleId',
      //   width: 400,
      // },
      {
        title: 'Client',
        dataIndex: 'sourceClient',
        width: 200,
      },
      {
        title: '资源',
        dataIndex: 'sourceType',
        width: 200,
      },
      {
        title: '资源描述',
        dataIndex: 'sourceDesc',
        width: 200,
      },
      {
        title: '参数类型',
        dataIndex: 'paramType',
        width: 200,
        render: text => formatter(commonData.paramType, text),
      },
      {
        title: '参数',
        dataIndex: 'parameterField',
        width: 200,
      },
      {
        title: '参数描述',
        dataIndex: 'parameterField',
        width: 200,
      },
      {
        title: 'OP',
        dataIndex: 'op',
        width: 200,
      },
      {
        title: '值',
        dataIndex: 'value',
        width: 200,
      },
      // {
      //   title: 'groupId',
      //   dataIndex: 'groupId',
      //   width: 200,
      // },
      {
        title: '状态',
        dataIndex: 'status',
        width: 200,
        render: text => formatter(commonData.status, text),
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

    columnGR = columnGR.map(col => {
      // if (!col.width) col.width = 100;
      tableWidthGR += col.width;
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
          editing: rowIndex === this.state.editIndexGR,
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
              <Button type="primary" onClick={() => this.handleAdd()}>
                <PlusOutlined />
                新建
              </Button>
            </div>
            <Row>
              <Col span={5}>
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
                    onRow={record => ({ onClick: e => this.getTableDataGR(record, e) })}
                  />
                </Form>
              </Col>
              <Col span={1} />
              <Col span={18}>
                <Button type="primary" onClick={() => this.handleAddGR()}>
                  <PlusOutlined />
                  新建
                </Button>
                <Form ref={this.tableFormRef1}>
                  <Table
                    scroll={{ x: tableWidthGR }}
                    loading={loadingGR}
                    dataSource={dataGR}
                    columns={columnGR}
                    rowKey="id"
                    rowClassName="editable-row"
                    components={components}
                    onChange={this.handleStandardTableChangeGR}
                    pagination={paginationGR}
                  />
                </Form>
              </Col>
            </Row>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ system }) => ({
  system,
}))(Group);

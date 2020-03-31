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
  Select,
  message,
  Popconfirm,
  Table,
  // DatePicker
} from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { formatter } from '@/utils/utils';
import { connect } from 'dva';

import StandardTable from '@/components/StandardTable';
import TableSearchForm from '@/components/TableSearchForm';
import EditableCell from '@/components/EditableCell';
import Search from 'antd/lib/input/Search';
import api from '@/api';

import ChooseRules from '../components/ChooseRules';

const FormItem = Form.Item;
const { Option } = Select;
// const { RangePicker } = DatePicker;

class Group extends Component {
  tableSearchFormRef = React.createRef();

  tableFormRef = React.createRef();

  tableFormRefGR = React.createRef();

  state = {
    // id: 0,   // 自减ID（新增数据时，提供负数id做为列表的key）

    // 分组     父表格
    list: [],           // 表格数据
    loading: true,      // 加载状态
    selectedRows: [],   // 选中行数据
    editIndex: -1,      // 编辑行
    pagination: {},     // 分页参数
    saveStatus: '',     // 编辑状态 新增、修改
    groupId: 0,         // 父级列表选中ID

    // 规则分组  子表格
    listGR: [],         // 表格数据
    loadingGR: false,   // 加载状态
    editIndexGR: -1,    // 编辑行
    paginationGR: {},   // 分页参数
    saveStatusGR: '',   // 编辑状态 新增、修改
    groupRuleList: [],  // 模态框选中数据
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
  }

  // 获取此页面需要用到的基础数据
  getCacheData = () => {};


  /**
   * 分组
   */

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
        groupId: 0,
      });
    });
    this.getTableDataGR();
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
      saveStatus: 'add',
      list: [
        {
          id: newId,
        },
        ...list,
      ],
    });
  };

  // 保存（新增/修改）
  saveRow = async (row, index) => {
    const { saveStatus, list } = this.state;
    try {
      let data;
      let rowData;
      if (saveStatus === 'add') {
        rowData = await this.tableFormRef.current.validateFields();
        data = { id: '', mark: 'I' };
      } else {
        rowData = row;
        data = { mark: 'U' };
      }
      const dataList = { ...list[index], ...rowData, ...data };
      const newData = [];
      newData.push(dataList);
      api.dataauth.saveRules(newData).then(() => {
          this.setState({ saveStatus: '' });
          this.getTableData();
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

   // 删除数据
  deleteRow = row => {
    console.log(row);
    // api.seqfactory.cancelSeqfactory(row.id).then(() => {
    //   this.getTableData();
    // });
  };

  // 修改,开启编辑
  editRow = (row, index) => {
    console.log(row);
    if (this.state.editIndex !== -1) {
      message.warning('请先保存或退出正在编辑的数据');
      return;
    }
    this.tableFormRef.current.setFieldsValue({ ...row });
    this.setState({
      editIndex: index,
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
        saveStatus: '',
      });
    }
  };

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


  /**
   * 规则分组 子表格
   */

  // 获取表格数据
  getTableDataGR = v => {
    if (v === undefined || v === '') {
      this.setState({ listGR: [] });
      return;
    }
    const { editIndex } = this.state;
    if (editIndex !== -1) return;

    this.setState({ loadingGR: true, });

    const options = this.initialValues;
    const { paginationGR } = this.state;
    const { current: page, pageSize: rows } = paginationGR;
    const data = { page, rows, ...options };
    api.dataauth.getGroupRules(v.id).then(res => {
      this.setState({
        listGR: res.rows,
        paginationGR: {
          current: data.page,
          pageSize: data.rows,
          total: res.total,
        },
        loadingGR: false,
        editIndexGR: -1,
        groupId: v.id,
      });
    });
  };

  // 新增 子表格
  handleAddGR = () => {
    const { editIndexGR, id, listGR, groupId } = this.state;
    if (editIndexGR !== -1) {
      message.warning('请先保存或退出正在编辑的数据');
      return;
    }
    console.log(groupId);

    if (groupId === 0) {
      message.warning('请先选中左侧的一条数据');
      return;
    }

    const newId = id - 1;
    this.tableFormRefGR.current.resetFields();
    this.setState({
      id: newId,
      editIndexGR: 0,
      saveStatusGR: 'add',
      listGR: [
        {
          id: newId,
        },
        ...listGR,
      ],
    });
  };

  // 保存（新增/修改）
  saveRowGR = async (row, index) => {
    const { saveStatusGR, groupId, groupRuleList, listGR } = this.state;
    try {
      console.log(row);
      let data;
      let rowData;
      if (saveStatusGR === 'add') {
        rowData = await this.tableFormRefGR.current.validateFields();
        data = {
          id: '',
          mark: 'I',
          groupId,
          parameterDesc: groupRuleList.parameterDesc,
          ruleId: groupRuleList.id,
          ruleName: groupRuleList.name,
        };
      } else {
        rowData = row;
        data = {
          mark: 'D',
          groupId,

        };
      }
      const dataLiat = { ...listGR[index], ...rowData, ...data };
      const newData = [];
      newData.push(dataLiat);
      // api.dataauth.saveGroupRules(newData).then(() => {
      //     this.getTableDataGR({ id: groupId });
      //     this.setState({
      //       saveStatusGR: '',
      //       groupRuleList: [],
      //     });
      //   }
      // );
    } catch (error) {
      console.log(error);
    }
  };

  // 删除数据
  deleteRowGR = row => {
    console.log(row);
    // api.seqfactory.cancelSeqfactory(row.id).then(() => {
    //   this.getTableData();
    // });
  };

  // 刷新
  handleRefresh = () => {
    const { groupId } = this.state;
    if (groupId === 0) {
      message.warning('请选中右侧分组');
      return;
    }
    this.getTableDataGR({ id: groupId });
  }

  // 修改,开启编辑
  editRowGR = (row, index) => {
    console.log(row);
    if (this.state.editIndexGR !== -1) {
      message.warning('请先保存或退出正在编辑的数据');
      return;
    }
    this.tableFormRefGR.current.setFieldsValue({ ...row });
    this.setState({
      editIndexGR: index,
      groupRuleList: row,
    });
  };

  // 退出编辑
  cancelEditGR = (row, index) => {
    if (row.id > 0) {
      this.setState({ editIndexGR: index });
    } else {
      const { listGR } = this.state;
      this.setState({
        listGR: listGR.filter(e => e.id > 0),
        editIndexGR: index,
        saveStatusGR: '',
      });
    }
  };

  // 分页
  handleStandardTableChangeGR = data => {
    this.getTableDataGR({
      page: data.current,
      rows: data.pageSize,
    });
  };

  // 获取模态框回传数据
  getMaskData = row => {
    this.tableFormRefGR.current.setFieldsValue({
      name: row.name,
      sourceClient: row.sourceClient,
      sourceType: row.sourceType,
      sourcePath: row.sourcePath,
      sourceDesc: row.sourceDesc,
      paramType: row.paramType,
      parameterField: row.parameterField,
      parameterDesc: row.parameterDesc,
      op: row.op,
      value: row.value,
      status: row.status,
    });
    this.setState({ groupRuleList: row });
  };


  /**
   * 顶部表单简单搜索
   */
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
    const { pagination, selectedRows, list, loading, paginationGR, listGR, loadingGR } = this.state;
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
                <Divider type="vertical" />
                <a onClick={() => this.editRow(row, index)}>修改</a>
              </>
            );
          }
          if (editIndex === index) {
            actions = (
              <>
                <a onClick={() => this.saveRow(row, index)}>保存</a>
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
        width: 300,
        editable: true,
        inputType: (
          <Search
            style={{ width: '90%' }}
            onSearch={() => this.showChooseRules.visibleShow(true)}
            readOnly
          />
        ),
        rules: [{ required: true, message: '必填' }],
      },
      // {
      //   title: '规则',
      //   dataIndex: 'ruleId',
      //   width: 400,
      //   editable: true,
      //   inputType: <Input style={{ width: '90%' }} readOnly/>,
      // },
      {
        title: 'Client',
        dataIndex: 'sourceClient',
        width: 150,
        editable: true,
        inputType: <Input style={{ width: '90%' }} readOnly/>,
      },
      {
        title: 'Type',
        dataIndex: 'sourceType',
        width: 100,
        editable: true,
        inputType: <Input style={{ width: '90%' }} readOnly/>,
      },
      {
        title: '资源',
        dataIndex: 'sourcePath',
        width: 300,
        editable: true,
        inputType: <Input style={{ width: '90%' }} readOnly/>,
      },
      {
        title: '资源描述',
        dataIndex: 'sourceDesc',
        width: 300,
        editable: true,
        inputType: <Input style={{ width: '90%' }} readOnly/>,
      },
      {
        title: '参数类型',
        dataIndex: 'paramType',
        width: 100,
        editable: true,
        inputType: (
          <Select style={{ width: 90 }}>
            {commonData.paramType.map(item => (
              <Option value={item.id} key={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        ),
        render: text => formatter(commonData.paramType, text),
      },
      {
        title: '参数',
        dataIndex: 'parameterField',
        width: 150,
        editable: true,
        inputType: <Input style={{ width: '90%' }} readOnly/>,
      },
      {
        title: '参数描述',
        dataIndex: 'parameterField',
        width: 150,
        editable: true,
        inputType: <Input style={{ width: '90%' }} readOnly/>,
      },
      {
        title: 'OP',
        dataIndex: 'op',
        width: 100,
        editable: true,
        inputType: <Input style={{ width: '90%' }} readOnly/>,
      },
      {
        title: '值',
        dataIndex: 'value',
        width: 100,
        editable: true,
        inputType: <Input style={{ width: '90%' }} readOnly/>,
      },
      // {
      //   title: 'groupId',
      //   dataIndex: 'groupId',
      //   width: 200,
      // },
      {
        title: '状态',
        dataIndex: 'status',
        width: 100,
        editable: true,
        inputType: (
          <Select style={{ width: 100 }} readOnly>
            {commonData.status.map(item => (
              <Option value={item.id} key={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        ),
        render: text => formatter(commonData.status, text),
      },
      {
        fixed: 'right',
        title: '操作',
        width: 120,
        render: (value, row, index) => {
          // const { status } = row;
          const { editIndexGR } = this.state;
          let actions;
          if (editIndexGR !== index) {
            actions = (
              <>
                <Popconfirm title="确定作废数据？" onConfirm={() => this.deleteRow(row)}>
                  <a>删除</a>
                </Popconfirm>
                <Divider type="vertical" />
                <a onClick={() => this.editRowGR(row, index)}>修改</a>
              </>
            );
          }
          if (editIndexGR === index) {
            actions = (
              <>
                <a onClick={() => this.saveRowGR(row, index)}>保存</a>
                <Divider type="vertical" />
                <a onClick={() => this.cancelEditGR(row, -1)}>退出</a>
              </>
            );
          }
          return actions;
        },
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
                <Button onClick={() => this.handleRefresh()}>
                  <ReloadOutlined />
                  刷新
                </Button>
                <Button type="primary" onClick={() => this.handleAddGR()}>
                  <PlusOutlined />
                  新建
                </Button>
                <Form ref={this.tableFormRefGR}>
                  <Table
                    scroll={{ x: tableWidthGR }}
                    loading={loadingGR}
                    dataSource={listGR}
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
        <ChooseRules
          onRef={ref => {
            this.showChooseRules = ref;
          }}
          getData={v => {
            this.getMaskData(v);
          }}
        />
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ system }) => ({
  system,
}))(Group);

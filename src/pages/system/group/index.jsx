import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  // Select,
  Divider,
  Popconfirm,
  message,
  Table,
} from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import api from '@/api';
import ChooseRuleList from '@/components/choosse/system/chooseRuleList'


const EditableContext = React.createContext();
const FormItem = Form.Item;
// const { Option } = Select;
const { Search } = Input;

// 参数类型
const paramType = {
  1: { value: 1, text: '参数' },
  2: { value: 2, text: '属性' },
  3: { value: 3, text: '接口' },
};
// 状态
const status = {
  0: { value: 0, text: '有效' },
  1: { value: 1, text: '过期' },
};

/**
 * 页面顶部筛选表单
 */
@Form.create()
class Searchs extends Component {
  componentDidMount() {
    this.submit();
  }

  submit = e => {
    if (e) e.preventDefault();
    const val = this.props.form.getFieldsValue();
    this.props.getTableData({ page: 1, ...val });
  }

  handleFormReset = () => {
    this.props.form.resetFields();
  }

  // 渲染表单
  renderForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.submit} layout="inline">
        <Row gutter={{ lg: 24, md: 12, sm: 6 }}>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="分组名称">
              {getFieldDecorator('name')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <span className="submitButtons">
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    return (
      <div className="tableListForm">{this.renderForm()}</div>
    );
  }
}

/**
 * 表格编辑组件
 */
class EditableCell extends React.Component {
  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      rules,
      ...restProps
    } = this.props;
    if (editing) {
      return (
        <td {...restProps} style={{ padding: 0 }}>
          {editing ? (
            <Form.Item>
              {getFieldDecorator(dataIndex, {
                rules,
                initialValue: record[dataIndex],
              })(inputType)}
            </Form.Item>
          ) : (
            children
          )}
        </td>
      );
    }
    return (<td {...restProps}>{children}</td>);
  };

  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
  }
}

/**
 * 页面根组件
 */
@Form.create()
class Group extends Component {
  state = {
    formValues: {
      page: 1,
      rows: 10,
    },
    list: [],
    total: 0,
    loading: false,
    selectedRows: [],
    editIndex: -1,
    id: 0, // 新增数据时，提供负数id
    groupId: 0,
    dataGR: [],
    loadingGR: false,
    selectParantData: false,
    editIndexGR: -1,
    visible: false, // 遮罩层的判断
    ruleList: [], // 规则弹窗数据
    parantData: [], // 父列表数据
    saveStatus: false, // 保存状态 (添加/修改)
    updateGR: [], // 子列表修改前数据
  }

  /**
   * 设置列
   */
  // 分组
  columns = [
    {
      title: '分组名称',
      dataIndex: 'name',
      // width: 220,
      editable: true,
      inputType: <Input style={{ width: '90%' }} />,
      rules: [
        { required: true, message: '必填' },
      ],
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
              <Popconfirm title="确定作废数据？" onConfirm={() => this.deleteRow(row, '')}>
                <a>删除</a>
              </Popconfirm>
              <Divider type="vertical" />
              <a onClick={() => this.editRow(index)} className="operate">修改</a>
            </>
          );
        }
        if (editIndex === index) {
          actions = (
            <>
              <a onClick={() => this.saveRow(index)}>保存</a>
              <Divider type="vertical" />
              <a onClick={() => this.cancelEdit(row, -1)} className="operate">退出</a>
            </>
          );
        }
        return actions;
      },
    },
  ];

  // 规则分组
  columnGR = [
    {
      title: '名称',
      dataIndex: 'name',
      width: 200,
      editable: true,
      inputType: <Search style={{ width: '90%' }} onSearch={() => this.openMask()} readOnly/>,
      rules: [
        { required: true, message: '必填' },
      ],
    },
    {
      title: 'Client',
      dataIndex: 'sourceClient',
      width: 150,
      editable: true,
      inputType: <Input style={{ width: '90%' }} readOnly/>,
      rules: [
        { required: true, message: '必填' },
      ],
    },
    {
      title: 'Type',
      dataIndex: 'sourceType',
      width: 100,
      editable: true,
      inputType: <Input style={{ width: '90%' }} readOnly/>,
      rules: [
        { required: true, message: '必填' },
      ],
    },
    {
      title: '资源',
      dataIndex: 'sourcePath',
      width: 300,
      editable: true,
      inputType: <Input style={{ width: '90%' }} readOnly/>,
      rules: [
        { required: true, message: '必填' },
      ],
    },
    {
      title: '资源描述',
      dataIndex: 'sourceDesc',
      width: 150,
      editable: true,
      inputType: <Input style={{ width: '90%' }} readOnly/>,
      rules: [
        { required: true, message: '必填' },
      ],
    },
    {
      title: '参数类型',
      dataIndex: 'paramType',
      width: 100,
      editable: true,
      inputType: <Input style={{ width: '90%' }} readOnly/>,
      rules: [
        { required: true, message: '必填' },
      ],
      render(val) {
        if (val === undefined) {
          return '';
        }
        return <span>{paramType[val].text}</span>;
      },
    },
    {
      title: '参数',
      dataIndex: 'parameterField',
      width: 200,
      editable: true,
      inputType: <Input style={{ width: '90%' }} readOnly/>,
    },
    {
      title: '参数描述',
      dataIndex: 'parameterDesc',
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
      rules: [
        { required: true, message: '必填' },
      ],
    },
    {
      title: '值',
      dataIndex: 'value',
      width: 100,
      editable: true,
      inputType: <Input style={{ width: '90%' }} readOnly/>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      editable: true,
      inputType: <Input style={{ width: '90%' }} readOnly/>,
      rules: [
        { required: true, message: '必填' },
      ],
      render(val) {
        if (val === undefined) {
          return '';
        }
        return <span>{status[val].text}</span>;
      },
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
              <Popconfirm title="确定作废数据？" onConfirm={() => this.deleteRow(row, 'GR')}>
                <a>删除</a>
              </Popconfirm>
              <Divider type="vertical" />
              <a onClick={() => this.editRow(row, index, 'GR', 'updateGR')}>修改</a>
            </>
          );
        }
        if (editIndexGR === index) {
          actions = (
            <>
              <a onClick={() => this.saveRow(index, 'GR')}>保存</a>
              <Divider type="vertical" />
              <a onClick={() => this.cancelEdit(row, -1, 'GR')}>退出</a>
            </>
          );
        }
        return actions;
      },
    },
  ];

  componentDidMount() {
  }

  // 分页
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    this.getTableData({
      page: pagination.current,
      rows: pagination.pageSize,
    });
  }

  // 选择行数据
  handleSelectRows = rows => {
    this.setState({
        selectedRows: rows,
    });
  }

  // 获取父表格数据
  getTableData = (options = {}) => {
    const { formValues } = this.state;
    const query = Object.assign({}, formValues, options);

    this.setState({
      formValues: query,
      loading: true,
    });

    api.system.getGroups(query, true).then(data => {
      this.setState({
        list: data.rows,
        total: data.total,
        loading: false,
        editIndex: -1,
      });
    });
  }

  // 新增
  handleAdd = son => {
    const { editIndex, id, list, dataGR, selectParantData } = this.state;
    if (editIndex !== -1) {
      message.warning('请先保存或退出正在编辑的数据');
      return;
    }
    const newId = id - 1;

    if (son === 'GR') {
      if (!selectParantData) {
        message.warning('请先选择左侧列表的一行');
        return;
      }
      this.setState({
        id: newId,
        editIndexGR: 0,
        ruleList: [],
        dataGR: [
          {
            id: newId,
          },
          ...dataGR,
        ],
      });
    } else {
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
    }
  }

  // 保存
  saveRow = (index, son) => {
    const { saveStatus } = this.state;
    if (son === 'GR') {
      this.props.form.validateFields((error, row) => {
        if (error) return;
        const { parantData, ruleList, updateGR } = this.state;
        this.setState({
          editIndexGR: -1,
        });
        console.log(row);
        console.log(ruleList);
        console.log(parantData);
        console.log(updateGR);
        row.groupId = parantData.id;
        row.parameterField = ruleList.parameterField;
        row.ruleId = ruleList.id;
        row.ruleName = ruleList.name;
        row.paramType = row.paramType;
        row.status = row.status;
        const rows = { ...ruleList[index], ...row };
        const newData = [];

        if (saveStatus) {
          const nowRow = rows;
          const beforRow = updateGR;

          nowRow.mark = 'I';
          nowRow.id = '';
          nowRow.key = ruleList.key;
          nowRow.parameterId = ruleList.parameterId;
          nowRow.sourceId = updateGR.sourceId;

          beforRow.groupId = parantData.id;
          beforRow.mark = 'D';
          beforRow.ruleId = updateGR.id;
          beforRow.ruleName = updateGR.name;

          newData[0] = nowRow;
          newData[1] = beforRow;
        } else {
          row.mark = 'I';
          row.id = '';
          newData[0] = rows;
        }

        console.log(newData);
        api.system.saveGroupRules(newData).then(() => {
          this.handleSearchGroupRules();
        });
      });
    } else {
      this.props.form.validateFields((error, row) => {
      if (error) return;
      if (saveStatus) {
        row.mark = 'U';
      } else {
        row.mark = 'I';
      }
      const { list } = this.state;
      const rows = { ...list[index], ...row };
      const newData = [];
      newData[0] = rows;
      api.system.saveGroups(newData).then(() => this.getTableData());
    });
    }
  }

  // 删除
  deleteRow = (row, son) => {
    row.mark = 'D';
    row.groupId = this.state.groupId;
    row.ruleId = row.id;
    row.ruleName = row.name;
    const rows = [];
    rows[0] = row;
    if (son === 'GR') {
      api.system.saveGroupRules(rows).then(() => this.handleSearchGroupRules());
    } else {
      api.system.saveGroups(rows).then(() => this.getTableData());
    }
  };

  // 点击 获取子表格数据
  handleSearchGroupRules = (v, e) => {
    this.setState({
      editIndexGR: -1,
    })
    if (v && e) {
      if (e.target.className === 'operate' || e.target.className.indexOf('ant-btn-sm') !== -1 || v.id < 1) return
      this.setState({
        groupId: v.id,
        loadingGR: true,
      });
      api.system.getGroupRules(v.id, true).then(res => {
        this.setState({
          dataGR: res.rows,
          loadingGR: false,
          editIndex: -1,
          parantData: v,
          selectParantData: true,
        });
      });
    } else {
      const { groupId, selectParantData } = this.state;
      if (groupId === 0) {
        if (!selectParantData) {
          message.warning('请先选择左侧列表的一行');
          return;
        }
      }
      this.setState({
        loadingGR: true,
      });
      api.system.getGroupRules(groupId).then(res => {
        this.setState({
          dataGR: res.rows,
          loadingGR: false,
          editIndex: -1,
        });
      });
    }
  }

  /**
   * 搜索弹窗
   */
  // 打开搜索
  openMask = () => {
    this.setState({
      visible: true,
    })
  }

  // 关闭搜索
  closeMask = v => {
    this.setState({
      visible: v,
    })
  }

  // 得到搜索的值
  getRuleList = data => {
    console.log(data);
    this.setState({
      ruleList: data,
      visible: false,
    })
    this.props.form.setFieldsValue({
      name: data.name,
      sourceClient: data.sourceClient,
      sourceType: data.sourceType,
      sourcePath: data.sourcePath,
      sourceDesc: data.sourceDesc,
      paramType: data.paramType,
      parameterField: data.parameterField,
      parameterDesc: data.parameterDesc,
      op: data.op,
      value: data.value,
      status: data.status,
    })
  }

  /**
   * 编辑行
   */
    // 开启编辑
  editRow = (row, index, son, type) => {
    if (son === 'GR') {
      if (this.state.editIndexGR !== -1) {
        message.warning('请先保存或退出正在编辑的数据');
        return;
      }
      if (type === 'updateGR') {
        this.setState({
          saveStatus: true,
          editIndexGR: index,
          updateGR: row,
        });
      } else {
        this.setState({
          saveStatus: true,
          editIndexGR: index,
        });
      }
    } else {
      if (this.state.editIndex !== -1) {
        message.warning('请先保存或退出正在编辑的数据');
        return;
      }
      this.setState({
        saveStatus: true,
        editIndex: index,
      });
    }
  }

  // 退出编辑
  cancelEdit = (row, index, son) => {
    if (son === 'GR') {
      if (row.id > 0) {
        this.setState({ editIndexGR: index });
      } else {
        const { dataGR } = this.state;
        this.setState({
          dataGR: dataGR.filter(e => e.id > 0),
          editIndexGR: index,
        });
      }
    } else if (row.id > 0) {
      this.setState({ editIndex: index });
    } else {
      const { list } = this.state;
      this.setState({
        list: list.filter(e => e.id > 0),
        editIndex: index,
      });
    }
  }

  render() {
    const {
      formValues: { page: current, rows: pageSize },
      selectedRows,
      list,
      total,
      loading,
      groupId,
      dataGR,
      loadingGR,
      selectParantData,
      parantData,
      visible,
      ruleList,
      saveStatus,
      updateGR,
    } = this.state;
    const data = { list, pagination: { current, pageSize, total } };

    const components = {
      body: {
        cell: EditableCell,
      },
    };

    const columns = this.columns.map(col => {
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

    const columnGR = this.columnGR.map(col => {
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

    // 子列表分页设置
    const paginationProps = {
      total: list.length,
      showSizeChanger: true,
      showQuickJumper: true,
    };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className="tableList">
            <Searchs getTableData={this.getTableData} />
            <div className="tableListOperator">
              <Button icon="plus" type="primary" onClick={() => this.handleAdd()}>
                新建
              </Button>
            </div>
            <Col span={6}>
              <EditableContext.Provider value={this.props.form}>
                <StandardTable
                  scroll={{ x: 300 }}
                  rowClassName="editable-row"
                  components={components}
                  selectedRows={selectedRows}
                  loading={loading}
                  data={data}
                  columns={columns}
                  onSelectRow={this.handleSelectRows}
                  onChange={this.handleStandardTableChange}
                  onRow={record => ({ onClick: e => this.handleSearchGroupRules(record, e) })}
                />
              </EditableContext.Provider>
            </Col>
            <Col span={1}>
            </Col>
            <Col span={17}>
              <Button icon="plus" type="primary" onClick={() => this.handleAdd('GR')}>
                新建
              </Button>
              <Button icon="redo" type="primary" onClick={() => this.handleSearchGroupRules()}>
                刷新
              </Button>
              <EditableContext.Provider value={this.props.form}>
                <Table
                  scroll={{ x: 2000, y: 600 }}
                  loading={loadingGR}
                  dataSource={dataGR}
                  columns={columnGR}
                  pagination={paginationProps}
                  rowKey="id"
                  components={components}
                />
              </EditableContext.Provider>
            </Col>
          </div>
        </Card>
        <ChooseRuleList getData={v => { this.getRuleList(v) }} visible={visible}
        closeMask={ v => { this.closeMask(v) }}/>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(Group);

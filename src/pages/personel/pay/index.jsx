import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Popconfirm
} from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import api from '@/api';

const EditableContext = React.createContext();
const FormItem = Form.Item;
const { Option } = Select;

/**
 * 页面顶部筛选表单
 */
@Form.create()
class Search extends Component {

  componentDidMount() {
    this.submit();
  }

  // // 查询
  submit = e => {
    if (e) e.preventDefault();
    const val = this.props.form.getFieldsValue();
    this.props.getTableData({ page: 1,...val});
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
            <FormItem label="员工编号">
              {getFieldDecorator('code')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="员工名称">
              {getFieldDecorator('staffName')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="年">
              {getFieldDecorator('year', { initialValue: '' })(
                <Select>
                  <Option value="1">1</Option>
                  <Option value="2">2</Option>
                  <Option value="3">3</Option>
                  <Option value="4">4</Option>
                  <Option value="5">5</Option>
                  <Option value="5">6</Option>
                  <Option value="5">7</Option>
                  <Option value="5">8</Option>
                  <Option value="5">9</Option>
                  <Option value="5">10</Option>
                  <Option value="5">11</Option>
                  <Option value="5">12</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="月">
              {getFieldDecorator('month', { initialValue: '' })(
                <Select>
                  <Option value="1">2019</Option>
                  <Option value="2">2018</Option>
                  <Option value="3">2017</Option>
                  <Option value="4">2016</Option>
                  <Option value="5">2015</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="状态">
              {getFieldDecorator('status', { initialValue: '1' })(
                <Select>
                  <Option value="1">正常</Option>
                  <Option value="2">已删除</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <span className="submitButtons">
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              {/* <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button> */}
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
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
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
  };


  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
  }
}

/**
 * 页面根组件
 */
@Form.create()
class Modifications extends Component {
  state = {
    formValues: {
      page: 1,
      rows: 10,
    },
    list: [],
    total: 0,
    loading: false,
    loadingSon: false,
    selectedRows: [],
    editIndex: -1,
    id: 0, // 新增数据时，提供负数id 
    modificationType: [],
    dataSon: [],
  }
  // state = {
  //   pagination: {
  //     current: 1,
  //     pageSize: 10,
  //     total: 0,
  //   },
  //   list: [],
  //   loading: false,
  //   selectedRows: [],
  //   editIndex: -1,
  // }

  // 工资管理
  columns = [
    {
      title: '员工编号',
      dataIndex: 'employeeCode',
      width: 100,
    },
    {
      title: '员工名称',
      dataIndex: 'employeeName',
      // dataIndex: 'name',
      width: 180,
    },
    {
      title: '总额',
      dataIndex: 'amount',
      width: 100,
    },
    {
      title: '时间',
      dataIndex: 'year',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
    },
    {
      title: '创建人',
      dataIndex: 'createName',
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
      width: 200,
    },
    {
      title: '删除人',
      dataIndex: 'cancelName',
      width: 100,
    },
    {
      title: '删除时间',
      dataIndex: 'cancelDate',
      width: 200,
    },
    {
      fixed: 'right',
      title: '操作',
      width: 120,
      render: (value, row, index) => {
        const { status } = row;
        const { editIndex } = this.state;
        let actions;
        if (editIndex !== index && status === 1) {
          actions = (
            <>
              <Popconfirm title="确定作废数据？" onConfirm={() => this.deleteRow(row)}>
                <a>删除</a>
              </Popconfirm>
              <Divider type="vertical" />
              <a onClick={() => this.editRow(index)}>修改</a>
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

  // 工资明细
  columnSon= [
    {
      title: '编号',
      dataIndex: 'typeCode',
      width: 100,
    },
    {
      title: '名称',
      dataIndex: 'typeName',
      width: 100,
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 100,
    },
    {
      title: '金额',
      dataIndex: 'amount',
      width: 100,
    }
  ];

  componentDidMount() {
    api.series.getSeries().then(res => {
      this.setState({
        modificationType: res,
      })
    })
  }

  // 设置子值
  dataSon = (v, e) => {
    if (e.target.className === 'operate' || e.target.className.indexOf('ant-btn-sm') !== -1) {
      return
    }
    this.setState({
      loadingSon: true,
    })
    setTimeout(() => {
        this.setState({
          dataSon: v.details,
          loadingSon: false,
        })
      }, 500)
  }
  // 分页
  handleStandardTableChange = pagination => {
    this.getTableData({
      page: pagination.current,
      rows: pagination.pageSize,
    });
  }

  // 选择行
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };
  // 获取表格数据
  getTableData = (options = {}) => {
    const { formValues } = this.state;
    const query = Object.assign({}, formValues, options);

    this.setState({
      formValues: query,
      loading: true,
    });

    // api.series.getSeries(query, true).then(data => {
    //   this.setState({
    //     loading: false,
    //     list: data.rows,
    //     pagination: {
    //       total: data.total,
    //       current: query.page,
    //       pageSize: query.rows,
    //     },
    //   });
    //   // console.log(data);
    // });
    api.peptideBase.getModifications(query).then(res => {
      this.setState({
        list: res.rows,
        total: res.total,
        loading: false,
        editIndex: -1,
      });
    });
  }

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
  }

  // 删除数据
  deleteRow = row => {
   console.log(1);
  };

  // 恢复数据
  resumeRow = row => {
    console.log(2);
  };

  // 保存
  saveRow = index => {
    console.log(3);
  }

  // 开启编辑，修改
  editRow = index => {
    if (this.state.editIndex !== -1) {
      message.warning('请先保存或退出正在编辑的数据');
      return;
    }
    this.setState({
      editIndex: index,
    });
  }

  // 新增
  handleAdd = () => {
    const { editIndex, id, list } = this.state;
    if (editIndex !== -1) {
      message.warning('请先保存或退出正在编辑的数据');
      return;
    }

    const newId = id - 1;
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

  render() {
    const {
      formValues: { page: current, rows: pageSize },
      selectedRows,
      list,
      total,
      loading,
      dataSon,
      loadingSon,
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

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className="tableList">
            <Search getTableData={this.getTableData} />
            <div className="tableListOperator">
              <Button icon="plus" type="primary" onClick={() => this.handleAdd()}>
                新建
              </Button>
            </div>
            <Col span={14}>
              <EditableContext.Provider value={this.props.form}>
                <StandardTable
                  scroll={{ x: 1800 }}
                  rowClassName="editable-row"
                  components={components}
                  selectedRows={selectedRows}
                  loading={loading}
                  data={data}
                  columns={columns}
                  onRow={record => ({ onClick: e => this.dataSon(record, e) }) }
                  onSelectRow={this.handleSelectRows}
                  onChange={this.handleStandardTableChange}
                />
              </EditableContext.Provider>
              </Col>
              <Col span={1}>
              </Col>
              <Col span={9}>
                <EditableContext.Provider value={this.props.form}>
                  {/* <Table
                    scroll={{ x: 700 }}
                    loading={loadingSon}
                    dataSource={dataSon}
                    columns={this.columnSon}
                    pagination={false}
                    rowKey="id"
                  /> */}
                  <StandardTable
                    scroll={{ x: 800 }}
                    selectedRows={selectedRows}
                    loading={loading}
                    data={data}
                    columns={this.columns}
                    onSelectRow={this.handleSelectRows}
                    onChange={this.handleStandardTableChange}
                  />
                </EditableContext.Provider>
              </Col>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default Modifications;


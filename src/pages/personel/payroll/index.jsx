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
@connect(({ personel }) => ({
  carrierSeries: personel.carrierSeries,
}))
class payroll extends Component {
  state = {
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
    list: [],
    loading: false,
    selectedRows: [],
    editIndex: -1,
  }
  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
    }
  }

  componentDidMount() {
    this.submit();
  }

  submit = e => {
    console.log(e);
    if (e) e.preventDefault();
    const val = this.props.form.getFieldsValue();
    this.props.getTableData({ page: 1, ...val });
  }

  renderAdvancedForm() {
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
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  // 渲染表单
  renderForm = () => {
    const { expandForm } = this.state;
    return expandForm;
  }

  render() {
    return (
      <div className="tableListForm">{this.renderForm()}</div>
    );
  }


  
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
    const { form } = this.props;
    const { pagination: { current: page, pageSize: rows } } = this.state;
    const query = Object.assign(form.getFieldsValue(), { page, rows }, options);
    // api.pay.getPay(query, true).then(data => {
    //   this.setState({
    //     loading: false,
    //     list: data.rows,
    //     pagination: {
    //       total: data.total,
    //       current: query.page,
    //       pageSize: query.rows,
    //     },
    //   });
    //   console.log(data);
      
    // });
    api.series.getSeries(query, true).then(data => {
      this.setState({
        loading: false,
        list: data.rows,
        pagination: {
          total: data.total,
          current: query.page,
          pageSize: query.rows,
        },
      });
      console.log(data);
    });
  }
  // 渲染表单
  renderForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ lg: 24, md: 12, sm: 6 }}>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="编号">
              {getFieldDecorator('code')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="名称">
              {getFieldDecorator('name')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="类型">
              {getFieldDecorator('type', { initialValue: '0' })(
                <Select>
                <Option value="0">全部</Option>
                <Option value="1">工资项目</Option>
                <Option value="2">扣款项目</Option>
                <Option value="3">代发项目</Option>
                <Option value="4">代缴项目</Option>
              </Select>,
              )} 
            </FormItem>
          </Col>
          
          <Col lg={6} md={8} sm={12}>
            <FormItem label="状态">
              {getFieldDecorator('status', { initialValue: '0' })(
                <Select>
                  <Option value="0">全部</Option>
                  <Option value="1">正常</Option>
                  <Option value="2">已删除</Option>
                </Select>,
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
// 修改,开启编辑
editRow = index => {
  if (this.state.editIndex !== -1) {
    message.warning('请先保存或退出正在编辑的数据');
    return;
  }
  this.setState({
    editIndex: index,
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
// 保存
saveRow = index => {
  const { carrierSeries } = this.props
  this.props.form.validateFields((error, row) => {
    if (error) return;
    const series = carrierSeries.filter(e => e.id === row.seriesId)[0];

    const { list } = this.state;
    const newData = {
      ...list[index],
      ...row,
      ...{ seriesName: series.name, seriesCode: series.code },
    };

    if (newData.id > 0) {
      api.carrier.updateCarrier(newData).then(() => this.getTableData());
    } else {
      api.carrier.addCarrier(newData).then(() => this.getTableData());
    }
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
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className="tableList">
            <div className="tableListForm">{this.renderForm()}</div>
            <div className="tableListOperator">
              <Button icon="plus" type="primary" onClick={() => this.handleAdd()}>
                新增
              </Button>
              <Button icon="delete" type="primary" onClick={() => this.handleAdd()}>
                作废
              </Button>
              <Button icon="plus" type="primary" onClick={() => this.handleAdd()}>
                保存
              </Button>
            </div>
            <StandardTable
              scroll={{ x: 1300 }}
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
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
  };

  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
  }
}


/**
 * 页面根组件
 */
@connect(({ global, seq }) => ({
  commonStatus: global.commonStatus,
  carrierSeries: seq.carrierSeries,
}))
@Form.create()
class Carrier extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'personel/getCarrierSeries',
    });
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
    const { formValues } = this.state;
    const query = Object.assign({}, formValues, options);

    this.setState({
      formValues: query,
      loading: true,
    });

    api.series.getSeries(query, true).then(data => {
      this.setState({
        loading: false,
        list: data.rows,
        pagination: {
          total: data.total,
          current: query.page,
          pageSize: query.rows,
        },
      });
      // console.log(data);
    });
  }

  // 取消编辑
  cancel = () => {
    this.setState({ editIndex: -1 });
  };

  // 作废数据
  deleteRow = row => {
    api.carrier.cancelCarrier(row.id).then(() => {
      this.getTableData();
    });
  };

  // 保存
  saveRow = index => {
    const { carrierSeries } = this.props
    this.props.form.validateFields((error, row) => {
      if (error) return;
      const series = carrierSeries.filter(e => e.id === row.seriesId)[0];

      const { list } = this.state;
      const newData = {
        ...list[index],
        ...row,
        ...{ seriesName: series.name, seriesCode: series.code },
      };

      if (newData.id > 0) {
        api.carrier.updateCarrier(newData).then(() => this.getTableData());
      } else {
        api.carrier.addCarrier(newData).then(() => this.getTableData());
      }
    });
  }

  // 开启编辑
  editRow = index => {
    if (this.state.editIndex !== -1) {
      message.warning('请先保存或退出正在编辑的数据');
      return;
    }
    this.setState({
      editIndex: index,
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
    } = this.state;
    const { commonStatus, carrierSeries } = this.props;
    const data = { list, pagination: { current, pageSize, total } };
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
        title: '名称',
        dataIndex: 'name',
        width: 150,
        editable: true,
        inputType: <Input />,
        rules: [
          { required: true, message: '必填' },
        ],
      },
      {
        title: '别名',
        dataIndex: 'alias',
        width: 150,
        editable: true,
        inputType: <Input />,
      },
      {
        title: '系列',
        dataIndex: 'seriesId',
        width: 150,
        editable: true,
        inputType: (
          <Select style={{ width: 100 }}>
            {carrierSeries.map(e =>
              <Option value={e.id} key={e.id}>{e.name}</Option>,
            )}
          </Select>
        ),
        rules: [
          { required: true, message: '必填' },
        ],
        render(text) {
          return formatter(carrierSeries, text);
        },
      },
      {
        title: '状态',
        dataIndex: 'status',
        render(text) {
          return formatter(commonStatus, text);
        },
      },
      {
        title: '创建人',
        dataIndex: 'creatorName',
        width: 100,
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        width: 200,
      },
      {
        title: '修改人',
        dataIndex: 'changerName',
        width: 100,
      },
      {
        title: '修改时间',
        dataIndex: 'changeDate',
        width: 200,
      },
      {
        title: '作废人',
        dataIndex: 'cancelName',
        width: 100,
      },
      {
        title: '作废时间',
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

    columns = columns.map(col => {
      if (!col.width) col.width = 100;
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
            <Search getTableData={this.getTableData} />
            <div className="tableListOperator">
              <Button icon="plus" type="primary" onClick={() => this.handleAdd()}>
                新建
              </Button>
            </div>
            <EditableContext.Provider value={this.props.form}>
              <StandardTable
                scroll={{ x: tableWidth }}
                rowClassName="editable-row"
                components={components}
                selectedRows={selectedRows}
                loading={loading}
                data={data}
                columns={columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
              />
            </EditableContext.Provider>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default payroll;


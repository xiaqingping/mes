import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Select,
  message,
  Popconfirm,
} from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import api from '@/api';

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
            <FormItem label="状态">
              {getFieldDecorator('status', { initialValue: '1' })(
                <Select>
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


const EditableContext = React.createContext();
/**
 * 表格编辑组件
 */
class EditableCell extends React.Component {
  getInput = () => {
    const { inputType } = this.props;
    if (inputType === 'input') {
      return <Input />;
    }
    return <Input />;
  };

  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `${title}必填!`,
                },
              ],
              initialValue: record[dataIndex],
            })(this.getInput())}
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
class CarrierSeries extends Component {
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
  }

  columns = [
    {
      title: '编号',
      dataIndex: 'code',
      width: 100,
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: 180,
      editable: true,
      inputType: 'input',
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
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

  componentDidMount() {
    //
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

    api.series.getSeries(query, true).then(res => {
      this.setState({
        list: res.rows,
        total: res.total,
        loading: false,
        editIndex: -1,
      });
    });
  }

  // 取消编辑
  cancel = () => {
    this.setState({ editIndex: -1 });
  };

  // 作废数据
  deleteRow = row => {
    api.series.cancelSeries(row.id).then(() => {
      this.getTableData();
    });
  };

  // 保存
  saveRow = index => {
    this.props.form.validateFields((error, row) => {
      if (error) return;
      console.log(row);
      console.log(index);
      const { list } = this.state;
      const newData = { ...list[index], ...row };
      console.log(newData);
      if (newData.id > 0) {
        api.series.updateSeries(newData).then(() => this.getTableData());
      } else {
        api.series.addSeries(newData).then(() => this.getTableData());
      }
      // const newData = [...this.state.data];
      // const index = newData.findIndex(item => key === item.key);
      // if (index > -1) {
      //   const item = newData[index];
      //   newData.splice(index, 1, {
      //     ...item,
      //     ...row,
      //   });
      //   this.setState({ data: newData, editIndex: '' });
      // } else {
      //   newData.push(row);
      //   this.setState({ data: newData, editIndex: '' });
      // }
    });
  }

  // 开启编辑
  editRow = index => {
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
    if (editIndex !== -1) return message.warning('请先保存或退出正在编辑的数据');

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
                scroll={{ x: 1300 }}
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

export default CarrierSeries;

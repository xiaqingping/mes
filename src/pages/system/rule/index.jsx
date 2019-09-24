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
  Modal,
} from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import api from '@/api';

const EditableContext = React.createContext();
const FormItem = Form.Item;
const { Option } = Select;
const { Search } = Input;

// Type
const typeList = [
  { value: 'GET', text: 'GET' },
  { value: 'POST', text: 'POST' },
  { value: 'DELETE', text: 'DELETE' },
  { value: 'PUT', text: 'PUT' },
];
// 参数类型
const paramType = {
  1: { value: 1, text: '参数' },
  2: { value: 2, text: '属性' },
  3: { value: 3, text: '接口' },
};
const paramTypeList = [
  { value: 1, text: '参数' },
  { value: 2, text: '属性' },
  { value: 3, text: '接口' },
];
// 状态
const statu = {
  0: { value: 0, text: '有效' },
  1: { value: 1, text: '过期' },
};
const statuList = [
  { value: 0, text: '有效' },
  { value: 1, text: '过期' },
];

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
            <FormItem label="规则名称">
              {getFieldDecorator('name')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="Client">
              {getFieldDecorator('client')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="参数">
              {getFieldDecorator('parameterField')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="Type">
              {getFieldDecorator('sourceType')(
                <Select placeholder="请选择">
                  <Option value="">全部</Option>
                  {typeList.map(item => <Option key={item.value} value={item.value}>{item.text}</Option>)}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="资源">
              {getFieldDecorator('sourcePath')(
                <Search
                  placeholder="请选择"
                  onSearch={value => this.showModal(value)} />,
              )}
            </FormItem>
          </Col><Col lg={6} md={8} sm={12}>
            <FormItem label="参数类型">
              {getFieldDecorator('paramType')(
                <Select placeholder="请选择">
                  <Option value="">全部</Option>
                  {paramTypeList.map(item => <Option key={item.value} value={item.value}>{item.text}</Option>)}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择">
                  {statuList.map(item => <Option key={item.value} value={item.value}>{item.text}</Option>)}
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
class Rule extends Component {
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
    visible: false,
  }

  columns = [
    {
      title: '规则名称',
      dataIndex: 'name',
      width: 200,
      editable: true,
      inputType: <Input />,
      rules: [
        { required: true, message: '必填' },
      ],
    },
    {
      title: 'Client',
      dataIndex: 'sourceClient',
      width: 200,
    },
    {
      title: 'Type',
      dataIndex: 'sourceType',
      width: 100,
    },
    {
      title: '资源',
      dataIndex: 'sourcePath',
      width: 200,
      editable: true,
      inputType: <Search />,
      // inputType: <Search onClick={e => { console.log(this) }}/>,
    },
    {
      title: '资源描述',
      dataIndex: 'sourceDesc',
      width: 200,
    },
    {
      title: '参数类型',
      dataIndex: 'paramType',
      width: 100,
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
      width: 150,
    },
    {
      title: '参数描述',
      dataIndex: 'parameterDesc',
      width: 100,
    },
    {
      title: 'OP',
      dataIndex: 'op',
      width: 100,
    },
    {
      title: '值',
      dataIndex: 'value',
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render(val) {
        if (val === undefined) {
          return '';
        }
        return <span>{statu[val].text}</span>;
      },
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
              {/* <Divider type="vertical" />
              <a onClick={() => this.editRow(index)}>修改</a> */}
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

  componentDidMount() {}

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

    api.system.getRules(query, true).then(res => {
      this.setState({
        list: res.rows,
        total: res.total,
        loading: false,
        editIndex: -1,
      });
    });
  }

  // 删除
  deleteRow = row => {
    console.log(row);
    // api.series.cancelSeries(row.id).then(() => {
    //   this.getTableData();
    // });
  };

  // 保存
  saveRow = index => {
    console.log(index);
    // this.props.form.validateFields((error, row) => {
    //   if (error) return;
    //   const { list } = this.state;
    //   const newData = { ...list[index], ...row };
    //   if (newData.id > 0) {
    //     api.series.updateSeries(newData).then(() => this.getTableData());
    //   } else {
    //     api.series.addSeries(newData).then(() => this.getTableData());
    //   }
    // });
  }

  // 开启编辑
  editRow = index => {
    this.setState({
      editIndex: index,
    });
  }

  // 取消编辑
  cancel = () => {
    this.setState({ editIndex: -1 });
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

  // 显示model弹窗
  showModal = () => {
    console.log(123);
    this.setState({
      visible: true,
    });
  };

  // 确定
  handleOk = () => {
    console.log(1);
    this.setState({
      visible: false,
    });
  };

  // 取消
  handleCancel = () => {
    console.log(2);
    this.setState({
      visible: false,
    });
  };

  render() {
    const {
      formValues: { page: current, rows: pageSize },
      selectedRows,
      list,
      total,
      loading,
      visible,
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
            <Searchs getTableData={this.getTableData} />
            <div className="tableListOperator">
              <Button icon="plus" type="primary" onClick={() => this.handleAdd()}>
                新建
              </Button>
            </div>
            <EditableContext.Provider value={this.props.form}>
              <StandardTable
                scroll={{ x: 2000 }}
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
          <Modal
            title="Basic Modal"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
          </Modal>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Rule;

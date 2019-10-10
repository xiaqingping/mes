// 多肽合成产品
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
  Checkbox,
} from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import api from '@/api';
import { connect } from 'dva';

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
      purityValue,
      status,
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
          <FormItem label="纯度">
            {getFieldDecorator('purity')(<Select
                  >
                    {purityValue.map(item =>
                      // eslint-disable-next-line no-unused-expressions
                      <Option key={item.id} value={item.id}>{item.purity}</Option>,
                    )}
                  </Select>)}
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="类型">
          {getFieldDecorator('aminoAcidType', { initialValue: '' })(
              <Select>
                <Option value="">全部</Option>
                <Option value="L">L</Option>
                <Option value="D">D</Option>
              </Select>)}
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="状态">
          {getFieldDecorator('status', { initialValue: 1 })(
              <Select>
                    {status.map(item =>
                      <Option key={item.id} value={item.id}>{item.name}</Option>,
                    )}
                  </Select>)}
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
            <Form.Item>
              {getFieldDecorator(dataIndex, {
                rules,
                valuePropName: 'checked',
                initialValue: record[dataIndex],
              })(inputType)}
            </Form.Item>
        </td>
      );
    }
    return (<td {...restProps}>{children}</td>);
  };


  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
  }
}

@connect(({ peptide }) => ({
  peptide,
}))
class Product extends Component {
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
    purityValue: [],
  }

  componentDidMount() {
    api.peptideBase.getPurityAll().then(res => {
      this.setState({
        purityValue: res,
      })
    })
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

    api.peptideBase.getProduct(query).then(res => {
      this.setState({
        list: res.rows,
        total: res.total,
        loading: false,
        editIndex: -1,
      });
    });
  }

  handleFormReset = () => {
    this.props.form.resetFields();
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

  // 删除数据
  deleteRow = row => {
    api.peptideBase.deleteProduct(row.id).then(() => {
      this.getTableData();
    });
  };

  // 恢复数据
  resumeRow = row => {
    api.peptideBase.resumeProduct(row.id).then(() => {
      this.getTableData();
    });
  };

  // 保存
  saveRow = index => {
    this.props.form.validateFields((error, row) => {
      if (error) return;
      const { list } = this.state;
      const newData = { ...list[index], ...row };
      if (newData.id > 0) {
        // api.peptideBase.updateSeries(newData).then(() => this.getTableData());
      } else {
        api.peptideBase.insertProduct(newData).then(() => this.getTableData());
      }
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
      purityValue,
    } = this.state;
    const data = { list, pagination: { current, pageSize, total } };
    let tableWidth = 0;
    const { peptide: { commonData } } = this.props

    let columns = [
      {
        title: '编号',
        dataIndex: 'code',
        width: 100,
      },
      {
        title: '提供总量从',
        dataIndex: 'providerTotalAmountBegin',
        width: 150,
        editable: true,
        inputType: <Input style={{ width: '90%' }}/>,
        rules: [
          { required: true, message: '必填' },
        ],
      },
      {
        title: '提供总量至',
        dataIndex: 'providerTotalAmountEnd',
        width: 150,
        editable: true,
        inputType: <Input style={{ width: '90%' }}/>,
        rules: [
          { required: true, message: '必填' },
        ],
      },
      {
        title: '纯度',
        dataIndex: 'purityID',
        width: 150,
        editable: true,
        inputType: (
          <Select style={{ width: '90%' }}>
          {purityValue.map(item =>
            <Option value={item.id} key={item.id}>{item.purity}</Option>,
          )}
          </Select>),
        rules: [
          { required: true, message: '必填' },
        ],
        render: text => {
          let val = null;
          purityValue.forEach(item => {
            if (item.id === text) {
              val = item.purity
            }
          })
          return val;
        },
      },
      {
        title: '长度从',
        dataIndex: 'aminoAcidLengthBegin',
        width: 100,
        editable: true,
        inputType: <Input style={{ width: '90%' }}/>,
        rules: [
          { required: true, message: '必填' },
        ],
      },
      {
        title: '长度至',
        dataIndex: 'aminoAcidLengthEnd',
        width: 100,
        editable: true,
        inputType: <Input style={{ width: '90%' }}/>,
        rules: [
          { required: true, message: '必填' },
        ],
      },
      {
        title: '是否脱盐',
        align: 'center',
        dataIndex: 'isNeedDesalting',
        width: 100,
        render: text => (text === 1 ? '√' : ''),
        editable: true,
        inputType: <Checkbox style={{ textAlign: 'center', display: 'block' }}/>,
      },
      {
        title: '氨基酸类型',
        dataIndex: 'aminoAcidType',
        width: 120,
        editable: true,
        inputType: (
          <Select style={{ width: '90%' }}>
              <Option value="L">L</Option>
              <Option value="D">D</Option>
          </Select>),
      },
      {
        title: '产品编号',
        dataIndex: 'sapProductCode',
        width: 150,
      },
      {
        title: '产品名称',
        dataIndex: 'sapProductName',
        width: 300,
      },
      {
        title: '操作',
        width: 150,
        render: (value, row, index) => {
          const { editIndex } = this.state;
          let actions;
          if (editIndex !== index) {
            if (row.status === 1) {
              actions = (
                <Popconfirm title="确定删除数据？" onConfirm={() => this.deleteRow(row)}>
                  <a>删除</a>
                </Popconfirm>
              );
            } else {
              actions = (
                <Popconfirm title="确定恢复数据？" onConfirm={() => this.resumeRow(row)}>
                  <a>恢复</a>
                </Popconfirm>
              );
            }
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

    const components = {
      body: {
        cell: EditableCell,
      },
    };

    columns = columns.map(col => {
      // eslint-disable-next-line no-param-reassign
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
            <Search getTableData={this.getTableData}
            purityValue={purityValue.map(item => item)} status={commonData.status}/>
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

export default Form.create()(Product);

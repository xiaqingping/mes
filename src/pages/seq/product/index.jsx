import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Checkbox,
  message,
  Popconfirm,
  Icon,
} from 'antd';
import React from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';

import api from '@/api';
import { formatter } from '@/utils/utils';
import ChooseProduct from '@/components/common/basic/ChooseProduct';

const EditableContext = React.createContext();
const FormItem = Form.Item;
const { Option } = Select;

/**
 * 页面顶部筛选表单
 */
@connect(({ seq }) => ({
  sampleType: seq.sampleType,
  seqType: seq.seqType,
}))
@Form.create()
class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
      showChooseProduct: true,
    }
  }

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

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
      sampleType,
      seqType,
    } = this.props;

    return (
      <Form onSubmit={this.submit} layout="inline">
        <Row gutter={{ xxl: 100, lg: 80 }}>
          <Col xxl={6} lg={8}>
            <FormItem label="状态">
              {getFieldDecorator('status', { initialValue: '1' })(
                <Select>
                  <Option value="1">正常</Option>
                  <Option value="2">已删除</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col xxl={6} lg={8}>
            <FormItem label="SAP编号">
              {getFieldDecorator('code')(<Input.Search onSearch={value => console.log(value)} />)}
            </FormItem>
          </Col>
          <Col xxl={6} lg={8}>
            <FormItem label="样品类型">
              {getFieldDecorator('sampleTypeId')(
                <Select>
                  {sampleType.map(e =>
                    <Option value={e.id} key={e.id}>{e.name}</Option>,
                  )}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col xxl={6} lg={8}>
            <FormItem label="测序类型">
              {getFieldDecorator('seqTypeId')(
                <Select>
                  {seqType.map(e =>
                    <Option value={e.id} key={e.id}>{e.name}</Option>,
                  )}
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.submit} layout="inline">
        <Row gutter={{ xxl: 100, lg: 80 }}>
          <Col xxl={6} lg={8}>
            <FormItem label="状态">
              {getFieldDecorator('status', { initialValue: '1' })(
                <Select>
                  <Option value="1">正常</Option>
                  <Option value="2">已删除</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col xxl={6} lg={8}>
            <FormItem label="SAP编号">
              {getFieldDecorator('code')(<Input.Search onSearch={value => console.log(value)} />)}
            </FormItem>
          </Col>
          <Col xxl={6} lg={0}>
            <FormItem label="样品类型">
              {getFieldDecorator('sampleTypeId', { initialValue: '' })(
                <Select>
                  <Option value="1">PCR产物(已纯化)</Option>
                  <Option value="2">PCR产物(未纯化)</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col xxl={6} lg={8}>
            <span className="submitButtons">
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  // 渲染表单
  renderForm = () => {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    return (
      <div className="tableListForm">
        {this.renderForm()}
        <ChooseProduct />
      </div>
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
      editOptions,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item>
            {getFieldDecorator(dataIndex, {
              initialValue: record[dataIndex],
              ...editOptions,
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
  sampleType: seq.sampleType,
  seqType: seq.seqType,
}))
@Form.create()
class Product extends React.Component {
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
      type: 'seq/getSampleType',
    });

    dispatch({
      type: 'seq/getSeqType',
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

    api.sampletype.getSeqProduct(query, true).then(res => {
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
    api.sampletype.cancelSeqProduct(row.id).then(() => {
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
        // 没有修改
      } else {
        api.sampletype.addSeqProduct(newData).then(() => this.getTableData());
      }
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
    const {
      commonStatus,
      sampleType,
      seqType,
    } = this.props;
    const data = { list, pagination: { current, pageSize, total } };
    let tableWidth = 0;

    const components = {
      body: {
        cell: EditableCell,
      },
    };

    let columns = [
      {
        title: 'SAP产品编号',
        dataIndex: 'productCode',
        width: 140,
      },
      {
        title: 'SAP产品名称',
        dataIndex: 'productName',
        width: 180,
        editable: true,
        inputType: <Input />,
        editOptions: {
          rules: [
            { required: true, message: '必填' },
          ],
        },
      },
      {
        title: '样品类型',
        dataIndex: 'sampleTypeName',
        width: 180,
        editable: true,
        inputType: (
          <Select style={{ width: '100%' }}>
            {sampleType.map(e =>
              <Option value={e.id} key={e.id}>{e.name}</Option>,
            )}
          </Select>
        ),
        editOptions: {
          rules: [
            { required: true, message: '必填' },
          ],
        },
      },
      {
        title: '测序类型',
        dataIndex: 'seqTypeName',
        width: 180,
        editable: true,
        inputType: (
          <Select style={{ width: '100%' }}>
            {seqType.map(e =>
              <Option value={e.id} key={e.id}>{e.name}</Option>,
            )}
          </Select>
        ),
        editOptions: {
          rules: [
            { required: true, message: '必填' },
          ],
        },
      },
      {
        title: '统一附加费',
        dataIndex: 'surcharge',
        width: 120,
        editable: true,
        inputType: (
          <Checkbox />
        ),
        editOptions: {
          valuePropName: 'checked',
        },
        render(text) {
          return text === 1 ? '√' : '';
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
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        width: 200,
      },
      {
        title: '作废人',
        dataIndex: 'cancelName',
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
          editOptions: col.editOptions,
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

export default Product;

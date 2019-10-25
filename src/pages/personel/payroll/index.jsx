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
  Popconfirm
} from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import api from '@/api';
// import { formatter } from '@/utils/utils';

const EditableContext = React.createContext();
const FormItem = Form.Item;
const { Option } = Select;


/**
 * 页面顶部筛选表单
 */

@connect(({ personel }) => ({
  type: personel.type,
}))
@Form.create()
class Search extends Component {
  componentDidMount() {
    this.submit();
  }

  // 查询
  submit = e => {
    if (e) e.preventDefault();
    const val = this.props.form.getFieldsValue();
    this.props.getTableData({ page: 1,...val});
  }

  // 渲染头部表单
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
            <FormItem label="类型">
              {getFieldDecorator('type')(
                <Select allowClear={true}>
                  {this.props.type.map(e =>
                    <Option value={e.id} key={e.id}>{e.name}</Option>,
                  )}
                </Select>,
              )}
            </FormItem>
          </Col>
          
          <Col lg={6} md={8} sm={12}>
            <FormItem label="状态">
              {getFieldDecorator('status')(
                <Select allowClear={true}>
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
@connect(({ personel }) => ({
  type: personel.type,
}))
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
    selectedRows: [],
    editIndex: -1,
    id: 0, // 新增数据时，提供负数id 
  }

  // 获取表格数据
  getTableData = (options = {}) => {
    const { formValues } = this.state;
    const query = Object.assign({}, formValues, options);

    this.setState({
      formValues: query,
      loading: true,
    });
    
    api.pay.getTypepay(query).then(res => {
      this.setState({
        list: res,
        total: res.total,
        loading: false,
        editIndex: -1,
      });
      // console.log(res);
    });
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
  // 删除数据
  deleteRow = row => {
    api.pay.deleteTypepays(row.id).then(() => {
      this.getTableData();
    });
  }
  // 保存和修改之后的保存
  saveRow = index => {
    // console.log(1);
    this.props.form.validateFields((error, row) => {
      if (error) return;
      const { list } = this.state;
      const newData = { ...list[index], ...row };
      console.log(newData);

      if (newData.id < 0) {
        api.pay.increaseTypepay(newData).then(() => this.getTableData());
      } else {
        api.pay.increaseTypepay(newData).then(() => this.getTableData());
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
      
    },
    // console.log(list)
    );
    // console.log(newId);

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
        width: 100,
      },
      {
        title: '名称',
        dataIndex: 'name',
        width: 180,
        editable: true,
        inputType: <Input style={{ width: '90%' }}/>,
        rules: [
          { required: true, message: '必填' },
        ],
      },
      {
        title: '类型',
        dataIndex: 'type',
        width: 180,
        editable: true,
        // inputType: <Input style={{ width: '90%' }} readOnly/>,
        inputType: (
          <Select style={{ width: 100 }}>
            {this.props.type.map(e =>
              <Option value={e.id} key={e.id}>{e.name}</Option>,
            )}
          </Select>
        ),
        rules: [
          { required: true, message: '必填' },
        ],
      },
      // {
      //   title: '排序',
      //   dataIndex: 'serial',
      //   width: 180,
      //   editable: true,
      //   inputType: <Input style={{ width: '90%' }} readOnly/>,
      //   rules: [
      //     { required: true, message: '必填' },
      //   ],
      // },
      {
        title: '排序',
        dataIndex: 'serial',
        width: 180,
        editable: true,
        inputType: <Input style={{ width: '90%' }}/>,
        rules: [
          { required: true, message: '必填' },
        ],
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
        title: '修改人',
        dataIndex: 'updateName',
        width: 100,
      },
      {
        title: '修改时间',
        dataIndex: 'updateDate',
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
      // tableWidth += col.width;
      // if (!col.editable) {
      //   return col;
      // }
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
            <Search  getTableData={this.getTableData}/>
            <div className="tableListOperator">
              <Button icon="plus" type="primary" onClick={() => this.handleAdd()}>
                新建
              </Button>
            </div>
            <EditableContext.Provider value={this.props.form}>
              <StandardTable
                scroll={{ x: tableWidth }}
                rowClassName="editable-row"
                selectedRows={selectedRows}
                components={components}
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
export default Modifications;


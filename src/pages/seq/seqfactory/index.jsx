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
import TableSearchForm from '@/components/TableSearchForm';
import api from '@/api';
import { formatter } from '@/utils/utils';

const EditableContext = React.createContext();
const FormItem = Form.Item;
const { Option } = Select;

/**
 * 表格编辑组件
 */
class EditableCell extends React.Component {
  renderCell = () => {
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
          <Form.Item name={dataIndex} rules={rules}>
            {inputType}
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
@connect(({ basicCache, seq }) => ({
  storages: basicCache.storages,
  factory: seq.factory,
}))
class SeqFactory extends Component {

  state = {
    formValues: {
      page: 1,
      rows: 10,
    },
    list: [],
    total: 0,
    loading: true,
    selectedRows: [],
    editIndex: -1,
    id: 0, // 新增数据时，提供负数id
  }

  // 顶部表单默认值
  initialValues = {
    status: 1
  }

  // 组件挂载时
  componentDidMount() {
    this.getCacheData();
    this.getTableData(this.initialValues);
  }

  // 顶部表单简单搜索
  simpleForm = () => (
    <>
      <Col span={6}>
        <FormItem label="编号" name="code">
          <Input />
        </FormItem>
      </Col>
      <Col span={6}>
        <FormItem label="名称" name="name">
          <Input />
        </FormItem>
      </Col>
      <Col lg={6}>
        <FormItem label="状态" name="status">
          <Select allowClear>
            <Option value={1}>正常</Option>
            <Option value={2}>已删除</Option>
          </Select>
        </FormItem>
      </Col>
      <Col lg={6}>
        <FormItem label="工厂" name="factory">
          <Select allowClear>
            {this.props.factory.map(e =>
              <Option value={e.id} key={e.id}>{e.name}</Option>,
            )}
          </Select>
        </FormItem>
      </Col>
    </>
  )

  // 顶部表单复杂搜索
  advancedForm = () => (
    <></>
  )

  // 获取此页面需要用到的基础数据
  getCacheData = () => {
    const basicCacheList = [
      { type: 'storages' }, // 仓库
    ];
    basicCacheList.forEach(item => {
      this.props.dispatch({
        type: 'basicCache/getCache',
        payload: item,
      });
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

  // 获取表格数据
  getTableData = (options = {}) => {
    const { formValues } = this.state;
    const query = Object.assign({}, formValues, options);

    this.setState({
      formValues: query,
      loading: true,
    });

    api.seqfactory.getSeqfactory(query,true).then(res => {
      this.setState({
        list: res.rows,
        total: res.total,
        loading: false,
        editIndex: -1,
      });
    });
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

  // 删除数据
  deleteRow = row => {
    api.seqfactory.cancelSeqfactory(row.id).then(() => {
      this.getTableData();
    });
  }

  // 保存和修改之后的保存
  saveRow = index => {
    this.props.form.validateFields((error, row) => {
      if (error) return;
      const { list } = this.state;
      const newData = { ...list[index], ...row };

      if (newData.id < 0) {
        api.seqfactory.addSeqfactory(newData).then(() => this.getTableData());
      } else {
        api.seqfactory.addSeqfactory(newData).then(() => this.getTableData());
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
        width: 150,
        editable: true,
        inputType: <Input style={{ width: '90%' }}/>,
        rules: [
          { required: true, message: '必填' },
        ],
      },
      {
        title: 'SAP工厂',
        dataIndex: 'factory',
        width: 200,
        editable: true,
        render: text => {
          if (text === 3100) return '3100-生工上海工厂';
          if (text === 3101) return '3101-生工北京工厂';
          if (text === 3102) return '3102-生工广州工厂';
          if (text === 3103) return '3103-生工武汉工厂';
          if (text === 3105) return '3105-生工成都工厂';
          if (text === 3106) return '3106-生工青岛工厂';
          if (text === 3107) return '3104-生工南京工厂';
          if (text === 3108) return '3108-生工郑州工厂';
          if (text === 3109) return '3108-生工长春工厂';
          return ''
        },
        inputType: (
          <Select style={{ width: 100 }}>
            {this.props.factory.map(e =>
              <Option value={e.id} key={e.id}>{e.name}</Option>,
            )}
          </Select>
        ),
        rules: [
          { required: true, message: '必填' },
        ],
      },
      {
        title: '仓库',
        dataIndex: 'storageCode',
        width: 180,
        inputType: (
          <Select style={{ width: 100 }}>
            {this.props.storages.map(e =>
              <Option value={e.code} key={e.code}>{e.name}</Option>,
            )}
          </Select>
        ),
        render: text => `${text  }-${ formatter(this.props.storages, text, 'code', 'name')}`,
        rules: [
          { required: true, message: '必填' },
        ],
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 100,
        render: text => {
          if (text === 1) return '正常';
          if (text === 2) return '已删除';
          return ''
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
        width: 180,
      },
      {
        title: '修改人',
        dataIndex: 'changeName',
        width: 100,
      },
      {
        title: '修改时间',
        dataIndex: 'changeDate',
        width: 180,
      },
      {
        title: '作废人',
        dataIndex: 'cancelName',
        width: 100,
      },
      {
        title: '作废时间',
        dataIndex: 'cancelDate',
        width: 180,
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
            <TableSearchForm
              initialValues={this.initialValues}
              getTableData={this.getTableData}
              simpleForm={this.simpleForm}
            />
            <div className="tableListOperator">
              <Button type="primary" onClick={() => this.handleAdd()}>
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

export default SeqFactory;

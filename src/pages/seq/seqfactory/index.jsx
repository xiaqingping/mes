/**
 * 测序点
 */
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Select,
  message,
  Popconfirm
} from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { PlusOutlined } from '@ant-design/icons';
import StandardTable from '@/components/StandardTable';
import TableSearchForm from '@/components/TableSearchForm';
import EditableCell from '@/components/EditableCell';
import { formatter } from '@/utils/utils';
import api from '@/api';

const FormItem = Form.Item;
const { Option } = Select;

class Seqfactory extends Component {

  tableSearchFormRef = React.createRef();

  tableFormRef = React.createRef();

  state = {
    // 分页参数
    pagination: {
      // current: 1,
      // pageSize: 10,
      // total: 0,
    },
    // 表格数据
    list: [],
    // 加载状态
    loading: true,
    // 选中行数据
    selectedRows: [],
    // 编辑行
    editIndex: -1,
    // 自减ID（新增数据时，提供负数id做为列表的key）
    id: 0,
  }

  // 顶部表单默认值
  initialValues = {
    status: 1,
    page: 1,
    rows: 10,
  }

  // 组件挂载时
  componentDidMount() {
    this.getCacheData();
    this.getTableData(this.initialValues);
  }

  // 顶部表单简单搜索
  simpleForm = () => (
    <>
      <Col lg={6} md={8} sm={12}>
        <FormItem label="编号" name="code">
          <Input />
        </FormItem>
      </Col>
      <Col lg={6} md={8} sm={12}>
        <FormItem label="名称" name="name">
          <Input />
        </FormItem>
      </Col>
      <Col lg={6} md={8} sm={12}>
        <FormItem label="状态" name="status">
          <Select allowClear>
            {this.props.basicStatus.map(e =>
              <Option value={e.id} key={e.id}>{e.name}</Option>,
            )}
          </Select>
        </FormItem>
      </Col>
      <Col lg={6} md={8} sm={12}>
        <FormItem label="工厂" name="factory">
          <Select allowClear>
            {this.props.plants.map(e =>
              <Option value={e.code} key={e.code}>{e.text}</Option>,
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
      { type: 'plants' }, // 工厂
    ];
    basicCacheList.forEach(item => {
      this.props.dispatch({
        type: 'basicCache/getCache',
        payload: item,
      });
    });
  }

  // 分页
  handleStandardTableChange = data => {
    this.getTableData({
      page: data.current,
      rows: data.pageSize,
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

    api.seqfactory.getSeqfactory(data, true).then(res => {
      this.setState({
        list: res.rows,
        pagination: {
          current: data.page,
          pageSize: data.rows,
          total: res.total,
        },
        loading: false,
        editIndex: -1,
      });
    });
  }

  // 修改,开启编辑
  editRow = (row, index) => {
    if (this.state.editIndex !== -1) {
      message.warning('请先保存或退出正在编辑的数据');
      return;
    }
    this.tableFormRef.current.setFieldsValue({...row});
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
  saveRow = async index => {
    const { storages } = this.props;
    try {
      const row = await this.tableFormRef.current.validateFields();
      const storageName = storages.filter(e => e.code === row.storageCode)[0].name;
      const { list } = this.state;
      const newData = { ...list[index], ...row, storageName };
      if (newData.id < 0) {
        api.seqfactory.addSeqfactory(newData).then(() => this.getTableData());
      } else {
        api.seqfactory.updateSeqfactory(newData).then(() => this.getTableData());
      }
    } catch (error) {
      console.log(error);
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
    this.tableFormRef.current.resetFields();
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
      pagination,
      selectedRows,
      list,
      loading,
    } = this.state;
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
        render: text => formatter(this.props.plants, text, 'code', 'text'),
        inputType: (
          <Select style={{ width: 100 }}>
            {this.props.plants.map(e =>
              <Option value={e.code} key={e.code}>{e.text}</Option>,
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
        editable: true,
        inputType: (
          <Select style={{ width: 100 }}>
            {this.props.storages.map(e =>
              <Option value={e.code} key={e.code}>{e.text}</Option>,
            )}
          </Select>
        ),
        render: text => formatter(this.props.storages, text, 'code', 'text'),
        rules: [
          { required: true, message: '必填' },
        ],
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 100,
        render: text => formatter(this.props.basicStatus, text),
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
                <a onClick={() => this.editRow(row, index)}>修改</a>
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
              ref={this.tableSearchFormRef}
              initialValues={this.initialValues}
              getTableData={this.getTableData}
              simpleForm={this.simpleForm}
            />
            <div className="tableListOperator">
              <Button type="primary" onClick={() => this.handleAdd()}>
                <PlusOutlined />新建
              </Button>
            </div>
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
              />
            </Form>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ basicCache }) =>({
  storages: basicCache.storages,
  plants: basicCache.plants,
  basicStatus: basicCache.basicStatus,
}))(Seqfactory);

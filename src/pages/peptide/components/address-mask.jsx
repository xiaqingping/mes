// 编辑收货地址
import { Button, Divider, Form, Input, message, Popconfirm, Modal } from 'antd';
import React, { Component } from 'react';
import api from '@/api';
import { connect } from 'dva';
import EditableCell from '@/components/EditableCell';
import StandardTable from '@/components/StandardTable';
import { PlusOutlined } from '@ant-design/icons';

class Order extends Component {
  tableFormRef = React.createRef();

  state = {
    pagination: {},
    list: [],
    loading: false,
    selectedRows: [],
    editIndex: -1,
    id: 0, // 新增数据时，提供负数id
    visible: false,
  };

  // 顶部表单默认值
  initialValues = {
    status: 1,
    page: 1,
    rows: 10,
  };

  componentDidMount() {
    this.props.onRef(this);
  }

  visibleShow = visible => {
    this.setState({
      visible,
    });
    this.getTableData(this.initialValues);
  };
  // componentWillReceiveProps(nextProps) {
  //   this.setState({
  //     visible: nextProps.visible,
  //   })
  // }

  handleOk = () => {
    this.handleCancel();
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  // 分页
  handleStandardTableChange = pagination => {
    this.getTableData({
      page: pagination.current,
      rows: pagination.pageSize,
    });
  };

  // 选择行
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  // 获取表格数据
  getTableData = (options = {}) => {
    this.setState({ loading: true });
    const { pagination } = this.state;
    const { current: page, pageSize: rows } = pagination;
    const data = {
      page,
      rows,
      ...options,
    };

    api.peptideBase.getPurity(data, true).then(res => {
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
  };

  // 删除数据
  deleteRow = row => {
    api.peptideBase.deletePurity(row.id).then(() => {
      this.getTableData();
    });
  };

  // 恢复数据
  resumeRow = row => {
    api.peptideBase.resumePurity(row.id).then(() => {
      this.getTableData();
    });
  };

  // 保存
  saveRow = async index => {
    try {
      const row = await this.tableFormRef.current.validateFields();
      const { list } = this.state;
      const newData = { ...list[index], ...row };
      if (newData.id > 0) {
        // api.peptideBase.updateSeries(newData).then(() => this.getTableData());
      } else {
        api.peptideBase.insertPurity(newData).then(() => this.getTableData());
      }
    } catch (error) {
      console.log(error);
    }
  };

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
  };

  render() {
    const { pagination, list, loading, visible, selectedRows } = this.state;
    let tableWidth = 0;

    let columns = [
      {
        title: '地址编号',
        dataIndex: 'code',
        width: 100,
      },
      {
        title: '客户编号',
        dataIndex: 'customerCode',
        width: 100,
      },
      {
        title: '国家/地区',
        dataIndex: 'countryCode',
        width: 100,
        editable: true,
        inputType: <Input />,
        rules: [{ required: true, message: '必填' }],
      },
      {
        title: '省份',
        dataIndex: 'provinceCode',
        width: 100,
        editable: true,
        inputType: <Input />,
        rules: [{ required: true, message: '必填' }],
      },
      {
        title: '城市',
        dataIndex: 'cityCode',
        width: 100,
        editable: true,
        inputType: <Input />,
        rules: [{ required: true, message: '必填' }],
      },
      {
        title: '区县',
        dataIndex: 'countyCode',
        width: 100,
        editable: true,
        inputType: <Input />,
        rules: [{ required: true, message: '必填' }],
      },
      {
        title: '街道',
        dataIndex: 'streetCode',
        width: 100,
        editable: true,
        inputType: <Input />,
        rules: [{ required: true, message: '必填' }],
      },
      {
        title: '地址',
        dataIndex: 'address',
        width: 100,
        editable: true,
        inputType: <Input />,
        rules: [{ required: true, message: '必填' }],
      },
      {
        title: '手机',
        dataIndex: 'mobNo',
        width: 100,
        editable: true,
        inputType: <Input />,
        rules: [{ required: true, message: '必填' }],
      },
      {
        title: '姓名',
        dataIndex: 'name',
        width: 100,
        editable: true,
        inputType: <Input />,
        rules: [{ required: true, message: '必填' }],
      },
      {
        title: '电话',
        dataIndex: 'telNo',
        width: 100,
        editable: true,
        inputType: <Input />,
        rules: [{ required: true, message: '必填' }],
      },
      {
        title: '操作',
        width: 100,
        fixed: 'right',
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
      <Modal
        title="编辑收货地址"
        width="800px"
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        keyboard={false}
        maskClosable={false}
        className="addressModal"
      >
        <div className="tableList">
          <div className="tableListOperator">
            <Button type="primary" onClick={() => this.handleAdd()}>
              <PlusOutlined />
              新建
            </Button>
          </div>
          <Form ref={this.tableFormRef}>
            <StandardTable
              scroll={{ x: tableWidth }}
              rowClassName="editable-row"
              components={components}
              selectedRows={selectedRows}
              loading={loading}
              data={{ list, pagination }}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
            {/* <Table
              dataSource={list}
              columns={columns}
              scroll={{ x: tableWidth }}
              pagination={pagination}
              rowKey="code"
              // rowSelection={rowSelection}
              loading={loading}
              onChange={this.handleStandardTableChange}
            /> */}
          </Form>
        </div>
      </Modal>
    );
  }
}

export default connect(({ peptide }) => ({
  peptide,
}))(Order);

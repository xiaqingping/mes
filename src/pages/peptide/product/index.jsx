// 多肽合成产品
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Checkbox,
} from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
// import Products from '@/pages/peptide/components/products-mask';
import api from '@/api';
import { connect } from 'dva';
import TableSearchForm from '@/components/TableSearchForm';
import EditableCell from '@/components/EditableCell';
import { PlusOutlined } from '@ant-design/icons';

const FormItem = Form.Item;
const { Option } = Select;
const { Search } = Input;

class Product extends Component {
  tableSearchFormRef = React.createRef();

  tableFormRef = React.createRef();

  state = {
    pagination: {
      // current: 1,
      // pageSize: 10,
      // total: 0,
    },
    list: [],
    loading: false,
    selectedRows: [],
    editIndex: -1,
    id: 0, // 新增数据时，提供负数id
    purityValue: [],
    sonProducts: [],
  };

  // 顶部表单默认值
  initialValues = {
    aminoAcidType: '',
    status: 1,
    page: 1,
    rows: 10,
  };

  componentDidMount() {
    api.peptideBase.getPurity({ status: 1 }).then(res => {
      this.setState({
        purityValue: res,
      });
    });
    this.getTableData(this.initialValues);
  }

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
    const formData = this.tableSearchFormRef.current.getFieldsValue();
    const { pagination } = this.state;
    const { current: page, pageSize: rows } = pagination;
    const data = {
      page,
      rows,
      ...formData,
      ...options,
    };

    api.peptideBase.getProduct(data).then(res => {
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

  getMaskData = v => {
    this.tableSearchFormRef.current.setFieldsValue({
      sapProductCode: v.code,
      sapProductName: v.name,
    });
    this.setState({
      sonProducts: v,
    });
  };

  // 清空弹框的选择内容
  clearInput = () => {
    this.tableSearchFormRef.current.setFieldsValue({
      sapProductCode: '',
      sapProductName: '',
    });
    this.setState({
      sonProducts: [],
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
    this.clearInput();
  };

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
      const newData = {
        ...list[index],
        ...row,
        isNeedDesalting: row.isNeedDesalting ? 1 : 2,
        aminoAcidMinimumCharge: 0,
        purityID: row.purityID.split('-')[0],
        purityCode: row.purityID.split('-')[1],
        purityName: row.purityID.split('-')[2],
      };
      if (newData.id > 0) {
        // api.peptideBase.updateSeries(newData).then(() => this.getTableData());
      } else {
        api.peptideBase.insertProduct(newData).then(() => {
          this.getTableData();
          this.clearInput();
        });
      }
    });
  };

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
  };

  simpleForm = () => {
    const { purityValue } = this.state;
    const {
      peptide: {
        commonData: { status },
      },
    } = this.props;
    return (
      <>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="编号" name="code">
            <Input />
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="纯度" name="purityID">
            <Select>
              {purityValue.map(item => (
                // eslint-disable-next-line no-unused-expressions
                <Option key={item.id} value={item.id}>
                  {item.purity}
                </Option>
              ))}
            </Select>
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="类型" name="aminoAcidType">
            <Select>
              <Option value="">全部</Option>
              <Option value="L">L</Option>
              <Option value="D">D</Option>
            </Select>
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="状态" name="status">
            <Select>
              {status.map(item => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </FormItem>
        </Col>
      </>
    );
  };

  render() {
    const { pagination, selectedRows, list, loading, purityValue, sonProducts } = this.state;
    let tableWidth = 0;
    const {
      peptide: { commonData },
    } = this.props;

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
        inputType: <Input style={{ width: '90%' }} />,
        rules: [{ required: true, message: '必填' }],
      },
      {
        title: '提供总量至',
        dataIndex: 'providerTotalAmountEnd',
        width: 150,
        editable: true,
        inputType: <Input style={{ width: '90%' }} />,
        rules: [{ required: true, message: '必填' }],
      },
      {
        title: '纯度',
        dataIndex: 'purityID',
        width: 150,
        editable: true,
        inputType: (
          <Select style={{ width: '90%' }}>
            {purityValue.map(item => (
              <Option value={`${item.id}-${item.code}-${item.purity}`} key={item.id}>
                {item.purity}
              </Option>
            ))}
          </Select>
        ),
        rules: [{ required: true, message: '必填' }],
        render: text => {
          let val = null;
          purityValue.forEach(item => {
            if (item.id === text) {
              val = item.purity;
            }
          });
          return val;
        },
      },
      {
        title: '长度从',
        dataIndex: 'aminoAcidLengthBegin',
        width: 100,
        editable: true,
        inputType: <Input style={{ width: '90%' }} />,
        rules: [{ required: true, message: '必填' }],
      },
      {
        title: '长度至',
        dataIndex: 'aminoAcidLengthEnd',
        width: 100,
        editable: true,
        inputType: <Input style={{ width: '90%' }} />,
        rules: [{ required: true, message: '必填' }],
      },
      {
        title: '是否脱盐',
        align: 'center',
        dataIndex: 'isNeedDesalting',
        width: 100,
        render: text => (text === 1 ? '√' : ''),
        editable: true,
        inputType: <Checkbox style={{ textAlign: 'center', display: 'block' }} />,
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
          </Select>
        ),
      },
      {
        title: '产品编号',
        dataIndex: 'sapProductCode',
        width: 150,
        editable: true,
        inputType: (
          <Input
            style={{ width: '90%' }}
            value={sonProducts.code ? sonProducts.code : ''}
            readOnly
          />
        ),
        rules: [{ required: true, message: '必填' }],
      },
      // {
      //   title: '产品名称',
      //   dataIndex: 'sapProductName',
      //   width: 300,
      //   editable: true,
      //   inputType: (
      //     <Search
      //       style={{ width: '90%' }}
      //       // onSearch={() => this.productShow.visibleShow(true)}
      //       value={sonProducts.name ? sonProducts.name : ''}
      //       readOnly
      //     />
      //   ),
      //   rules: [{ required: true, message: '必填' }],
      // },
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
            <TableSearchForm
              ref={this.tableSearchFormRef}
              initialValues={this.initialValues}
              getTableData={this.getTableData}
              simpleForm={this.simpleForm}
            />
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
            </Form>
          </div>
        </Card>
        {/* <Products
          onRef={ref => {
            this.productShow = ref;
          }}
          getData={v => {
            this.getMaskData(v);
          }}
        /> */}
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ peptide }) => ({
  peptide,
}))(Product);

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
import api from '@/api';
import { connect } from 'dva';
import Modifications from '@/pages/peptide/components/modifications-mask';
import Products from '@/pages/peptide/components/products-mask';
import TableSearchForm from '@/components/TableSearchForm';
import EditableCell from '@/components/EditableCell';
import { PlusOutlined } from '@ant-design/icons';
import { formatter } from '@/utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
const { Search } = Input;

class ModificationProducts extends Component {
  tableSearchFormRef = React.createRef();

  tableFormRef = React.createRef();

  state = {
    pagination: {},
    list: [],
    loading: false,
    selectedRows: [],
    editIndex: -1,
    aminoAcid: [], // 氨基酸
    id: 0, // 新增数据时，提供负数id
    sonModification: [],
  };

  // 顶部表单默认值
  initialValues = {
    status: 1,
    page: 1,
    rows: 10,
  };

  componentDidMount() {
    api.peptideBase.getAminoAcid({ status: 1 }, true).then(data => {
      const map = {};
      const dest = [];
      for (let i = 0; i < data.rows.length; i++) {
        const ai = data.rows[i];
        if (!map[ai.code]) {
          dest.push({
            id: ai.id,
            name: ai.name,
            code: ai.code,
          });
          map[ai.code] = ai;
        }
      }
      this.setState({
        aminoAcid: dest,
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

    api.peptideBase.getModificationProducts(data).then(res => {
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
        sonModification: [],
        editIndex: index,
      });
    }
    // this.clearInput();
  };

  // 清空弹框的选择内容
  // clearInput = () => {
  //   this.tableFormRef.current.setFieldsValue({
  //     sapProductCode: '',
  //     sapProductName: '',
  //     modificationPosition: '',
  //     modificationName: '',
  //   });
  //   this.setState({
  //     sonModification: [],
  //   });
  // };

  // 删除数据
  deleteRow = row => {
    api.peptideBase.deleteModificationProducts(row.id).then(() => {
      this.getTableData();
    });
  };

  // 恢复数据
  resumeRow = row => {
    api.peptideBase.resumeModificationProducts(row.id).then(() => {
      this.getTableData();
    });
  };

  // 保存
  saveRow = async index => {
    try {
      const row = await this.tableFormRef.current.validateFields();
      const { list, sonModification } = this.state;
      const newData = {
        ...list[index],
        ...row,
        isNeedDesalting: row.isNeedDesalting ? 1 : 2,
        aminoAcidLengthBegin: parseInt(row.aminoAcidLengthBegin, 10),
        aminoAcidLengthEnd: parseInt(row.aminoAcidLengthEnd, 10),
        providerTotalAmountBegin: parseInt(row.providerTotalAmountBegin, 10),
        providerTotalAmountEnd: parseInt(row.providerTotalAmountEnd, 10),
        modificationCode: sonModification.modificationCode,
        modificationID: sonModification.id,
        aminoAcidCode: row.aminoAcidName.split('-')[0],
        aminoAcidID: row.aminoAcidName.split('-')[1],
        aminoAcidName: row.aminoAcidName.split('-')[2],
        modificationPosition: sonModification.modificationPosition,
      };
      if (newData.id > 0) {
        // api.peptideBase.updateSeries(newData).then(() => this.getTableData());
      } else {
        api.peptideBase.insertModificationProducts(newData).then(() => {
          this.getTableData();
          // this.clearInput();
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 得到修饰搜索的值
  getSonData = (data, type) => {
    if (type === 'modifications') {
      this.tableFormRef.current.setFieldsValue({
        modificationPosition: formatter(
          this.props.peptide.commonData.modificationPosition,
          data.modificationPosition,
        ),
        modificationName: data.name,
      });
      this.setState({
        sonModification: data,
      });
    } else {
      this.tableFormRef.current.setFieldsValue({
        sapProductCode: data.code,
        sapProductName: data.name,
      });
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
      sonModification: [],
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
    const { pagination, selectedRows, list, loading, sonModification, aminoAcid } = this.state;
    let tableWidth = 0;

    let columns = [
      {
        title: '编号',
        dataIndex: 'code',
        width: 100,
      },
      {
        title: '修饰名称',
        dataIndex: 'modificationName',
        width: 250,
        editable: true,
        inputType: (
          <Search
            style={{ width: 230 }}
            onSearch={() => this.modificationShow.visibleShow(true)}
            value={sonModification.name ? sonModification.name : ''}
            readOnly
          />
        ),
        rules: [{ required: true, message: '必填' }],
      },
      {
        title: '修饰位置',
        dataIndex: 'modificationPosition',
        width: 110,
        editable: true,
        inputType: (
          <Input
            style={{ width: 90 }}
            value={sonModification.modificationPosition ? sonModification.modificationPosition : ''}
            readOnly
          />
        ),
        rules: [{ required: true, message: '必填' }],
        render: text => {
          let val = null;
          this.props.peptide.commonData.modificationPosition.forEach(item => {
            if (item.id === text) {
              val = item.name;
            }
          });
          return val;
        },
      },
      {
        title: '氨基酸',
        dataIndex: 'aminoAcidName',
        width: 120,
        editable: true,
        inputType: (
          <Select style={{ width: 110 }}>
            {aminoAcid.map(item => (
              <Option value={`${item.code}-${item.id}-${item.name}`} key={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        ),
        rules: [{ required: true, message: '必填' }],
      },
      {
        title: '氨基酸类型',
        dataIndex: 'aminoAcidType',
        width: 110,
        editable: true,
        inputType: (
          <Select style={{ width: 90 }}>
            <Option value="L">L</Option>
            <Option value="D">D</Option>
          </Select>
        ),
        rules: [{ required: true, message: '必填' }],
      },
      {
        title: '提供总量从',
        dataIndex: 'providerTotalAmountBegin',
        width: 110,
        editable: true,
        inputType: <Input style={{ width: 90 }} />,
        rules: [{ required: true, message: '必填' }],
      },
      {
        title: '提供总量至',
        dataIndex: 'providerTotalAmountEnd',
        width: 120,
        editable: true,
        inputType: <Input style={{ width: 100 }} />,
        rules: [{ required: true, message: '必填' }],
      },
      {
        title: '长度从',
        dataIndex: 'aminoAcidLengthBegin',
        width: 100,
        editable: true,
        inputType: <Input style={{ width: 80 }} />,
        rules: [{ required: true, message: '必填' }],
      },
      {
        title: '长度至',
        dataIndex: 'aminoAcidLengthEnd',
        width: 100,
        editable: true,
        inputType: <Input style={{ width: 80 }} />,
        rules: [{ required: true, message: '必填' }],
      },
      {
        title: '是否脱盐',
        dataIndex: 'isNeedDesalting',
        width: 110,
        align: 'center',
        render: text => (text === 1 ? '√' : ''),
        editable: true,
        checkType: true,
        inputType: <Checkbox style={{ textAlign: 'center', display: 'block' }} />,
      },
      {
        title: '产品编号',
        dataIndex: 'sapProductCode',
        width: 200,
        editable: true,
        inputType: <Input style={{ width: 180 }} readOnly />,
        rules: [{ required: true, message: '必填' }],
      },
      {
        title: '产品名称',
        dataIndex: 'sapProductName',
        width: 300,
        editable: true,
        inputType: (
          <Search
            style={{ width: 280 }}
            onSearch={() => this.productShow.visibleShow(true)}
            readOnly
          />
        ),
        rules: [{ required: true, message: '必填' }],
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 100,
        render: text => {
          if (text === 1) return '正常';
          if (text === 2) return '已删除';
          return '';
        },
      },
      {
        title: '创建人',
        dataIndex: 'creatorName',
        width: 100,
      },
      {
        title: '创建日期',
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
        title: '操作',
        fixed: 'right',
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
          checkType: col.checkType,
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
        <Modifications
          getData={v => {
            this.getSonData(v, 'modifications');
          }}
          onRef={ref => {
            this.modificationShow = ref;
          }}
        />
        <Products
          getData={v => {
            this.getSonData(v, 'products');
          }}
          onRef={ref => {
            this.productShow = ref;
          }}
        />
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ peptide }) => ({
  peptide,
}))(ModificationProducts);

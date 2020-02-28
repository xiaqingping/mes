// 多肽修饰
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
  Table,
} from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import api from '@/api';
import { connect } from 'dva';
import AminoAcid from '@/pages/peptide/components/amino-acid-mask';
import TableSearchForm from '@/components/TableSearchForm';
import EditableCell from '@/components/EditableCell';
import { PlusOutlined } from '@ant-design/icons';

const FormItem = Form.Item;
const { Option } = Select;
const { Search } = Input;

/**
 * 页面根组件
 */
class Modifications extends Component {
  tableSearchFormRef = React.createRef();

  tableFormRef = React.createRef();

  tableFormRef1 = React.createRef();

  state = {
    pagination: {},
    list: [],
    loading: false,
    loadingSon: false,
    selectedRows: [],
    editIndex: -1,
    id: 0, // 新增数据时，提供负数id
    modificationType: [],
    dataSon: [],
    selectParantData: false,
    editIndexSon: -1,
    sonAminoAcid: [], // 子氨基酸值
    parantData: [], // 父数据
  };

  // 顶部表单默认值
  initialValues = {
    modificationTypeID: '0',
    status: 1,
    page: 1,
    rows: 10,
  };

  componentDidMount() {
    api.peptideBase.getModificationTypes().then(res => {
      this.setState({
        modificationType: res,
      });
    });
    this.getTableData(this.initialValues);
  }

  // 设置子值
  dataSon = (v, e) => {
    if (e.target.className === 'ant-table-cell') {
      this.setState({
        loadingSon: true,
      });
      setTimeout(() => {
        this.setState({
          dataSon: v.details,
          selectParantData: true,
          loadingSon: false,
          parantData: v,
        });
      }, 500);
    }
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
  getTableData = (options = {}, son) => {
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

    api.peptideBase.getModifications(data, true).then(res => {
      if (son === 'son') {
        const { parantData } = this.state;
        res.rows.forEach(item => {
          if (item.id === parantData.id) {
            this.setState({
              dataSon: item.details,
            });
          }
        });
      }
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
  cancelEdit = (row, index, son) => {
    if (son === 'son') {
      if (row.id > 0) {
        this.setState({ editIndexSon: index });
      } else {
        const { dataSon } = this.state;
        this.setState({
          dataSon: dataSon.filter(e => e.id > 0),
          editIndexSon: index,
        });
      }
    } else if (row.id > 0) {
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
  deleteRow = (row, son) => {
    if (son === 'son') {
      api.peptideBase.deleteSuitableAminoAcids(row.id).then(() => {
        this.getTableData();
        this.setState({
          dataSon: [],
        });
      });
    } else {
      api.peptideBase.deleteModifications(row.id).then(() => {
        this.getTableData();
      });
    }
  };

  // 恢复数据
  resumeRow = (row, son) => {
    if (son === 'son') {
      api.peptideBase.resumeSuitableAminoAcids(row.id).then(() => {
        this.getTableData();
        this.setState({
          dataSon: [],
        });
      });
    } else {
      api.peptideBase.resumeModifications(row.id).then(() => {
        this.getTableData();
      });
    }
  };

  // 保存
  saveRow = async (index, son) => {
    if (son === 'son') {
      try {
        const { parantData, sonAminoAcid } = this.state;
        const newData = {
          name: sonAminoAcid.name,
          code: sonAminoAcid.code,
          aminoAcidID: sonAminoAcid.id,
          modificationID: parantData.id,
        };
        if (newData.id > 0) {
          // api.peptideBase.updateSeries(newData).then(() => this.getTableData());
        } else {
          api.peptideBase.insertSuitableAminoAcids(newData).then(() => {
            this.setState({
              editIndexSon: -1,
            });
            this.getTableData([], 'son');
          });
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const row = await this.tableFormRef.current.validateFields();
        const { list } = this.state;
        const newData = {
          ...list[index],
          ...row,
          isIndependentModification: row.isIndependentModification ? 1 : 2,
        };
        if (newData.id > 0) {
          // api.peptideBase.updateSeries(newData).then(() => this.getTableData());
        } else {
          api.peptideBase.insertModifications(newData).then(() => this.getTableData());
        }
      } catch (error) {
        console.log(error);
      }
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

  // 新增子数据
  handleAddSon = () => {
    const { editIndexSon, id, dataSon, selectParantData } = this.state;
    if (editIndexSon !== -1) {
      message.warning('请先保存或退出正在编辑的数据');
      return;
    }

    if (!selectParantData) {
      message.warning('请先选择左侧列表的一行');
      return;
    }

    const newId = id - 1;
    this.tableFormRef1.current.resetFields();
    this.setState({
      id: newId,
      editIndexSon: 0,
      sonAminoAcid: [],
      dataSon: [
        {
          id: newId,
        },
        ...dataSon,
      ],
    });
  };

  // 得到搜索的值
  getSonAminoAcid = data => {
    this.setState({
      sonAminoAcid: data,
    });
    this.tableFormRef1.current.setFieldsValue({
      code: data.code,
      name: data.name,
    });
  };

  simpleForm = () => {
    const { modificationType } = this.state;
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
          <FormItem label="名称" name="name">
            <Input />
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="修饰类型" name="modificationTypeID">
            <Select>
              <Option value="0">全部</Option>
              {modificationType.map(item => (
                <Option key={item.id} value={item.id}>
                  {item.modificationType}
                </Option>
              ))}
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
    const {
      pagination,
      selectedRows,
      list,
      loading,
      dataSon,
      loadingSon,
      modificationType,
      sonAminoAcid,
    } = this.state;
    const {
      peptide: { commonData },
    } = this.props;
    let tableWidth = 0;
    let tableWidthSon = 0;

    let columns = [
      {
        title: '编号',
        dataIndex: 'code',
        width: 100,
      },
      {
        title: '修饰名称',
        dataIndex: 'name',
        width: 260,
        editable: true,
        inputType: <Input style={{ width: '90%' }} />,
        rules: [{ required: true, message: '必填' }],
      },
      {
        title: '修饰代码',
        dataIndex: 'modificationCode',
        width: 120,
        editable: true,
        inputType: <Input style={{ width: '90%' }} />,
        rules: [{ required: true, message: '必填' }],
      },
      {
        title: '修饰位置',
        dataIndex: 'modificationPosition',
        width: 140,
        editable: true,
        inputType: (
          <Select style={{ width: '90%' }}>
            {commonData.modificationPosition.map(item => (
              <Option value={item.id} key={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        ),
        rules: [{ required: true, message: '必填' }],
        render: text => {
          let val = null;
          commonData.modificationPosition.forEach(item => {
            if (item.id === text) {
              val = item.name;
            }
          });
          return val;
        },
      },
      {
        title: '独立修饰',
        dataIndex: 'isIndependentModification',
        align: 'center',
        width: 100,
        render: text => (text === 1 ? '√' : ''),
        editable: true,
        checkType: true,
        inputType: <Checkbox />,
      },
      {
        title: '修饰类别',
        dataIndex: 'modificationTypeID',
        width: 250,
        editable: true,
        inputType: (
          <Select style={{ width: '90%' }}>
            {modificationType.map(item => (
              <Option value={item.id} key={item.id}>
                {item.modificationType}
              </Option>
            ))}
          </Select>
        ),
        rules: [{ required: true, message: '必填' }],
        render: text => {
          let val = null;
          modificationType.forEach(item => {
            if (item.id === text) {
              val = item.modificationType;
            }
          });
          return val;
        },
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
        title: '创建时间',
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
        className: 'operate',
        width: 150,
        render: (value, row, index) => {
          const { editIndex } = this.state;
          let actions;
          if (editIndex !== index) {
            if (row.status === 1) {
              actions = (
                <Popconfirm title="确定删除数据？" onConfirm={() => this.deleteRow(row)}>
                  <a className="operate">删除</a>
                </Popconfirm>
              );
            } else {
              actions = (
                <Popconfirm title="确定恢复数据？" onConfirm={() => this.resumeRow(row)}>
                  <a className="operate">恢复</a>
                </Popconfirm>
              );
            }
          }
          if (editIndex === index) {
            actions = (
              <>
                <a className="addNewData" onClick={() => this.saveRow(index)}>
                  保存
                </a>
                <Divider type="vertical" />
                <a onClick={() => this.cancelEdit(row, -1)}>退出</a>
              </>
            );
          }
          return actions;
        },
      },
    ];

    let columnSon = [
      {
        title: '编号',
        dataIndex: 'code',
        width: 120,
        editable: true,
        inputType: (
          <Search
            style={{ width: '90%' }}
            onSearch={() => this.AminoAcidShow.visibleShow(true)}
            value={sonAminoAcid.code ? sonAminoAcid.code : ''}
            readOnly
          />
        ),
        rules: [{ required: true, message: '必填' }],
      },
      {
        title: '名称',
        dataIndex: 'name',
        width: 120,
        editable: true,
        inputType: (
          <Input
            style={{ width: '90%' }}
            value={sonAminoAcid.name ? sonAminoAcid.name : ''}
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
        width: 120,
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        width: 200,
      },
      {
        title: '删除人',
        dataIndex: 'cancelName',
        width: 120,
      },
      {
        title: '删除时间',
        dataIndex: 'cancelDate',
        width: 200,
      },
      {
        title: '操作',
        fixed: 'right',
        className: 'operate',
        width: 150,
        render: (value, row, index) => {
          const { editIndexSon } = this.state;
          let actions;
          if (editIndexSon !== index) {
            if (row.status === 1) {
              actions = (
                <Popconfirm title="确定删除数据？" onConfirm={() => this.deleteRow(row, 'son')}>
                  <a className="operate">删除</a>
                </Popconfirm>
              );
            } else {
              actions = (
                <Popconfirm title="确定恢复数据？" onConfirm={() => this.resumeRow(row, 'son')}>
                  <a className="operate">恢复</a>
                </Popconfirm>
              );
            }
          }
          if (editIndexSon === index) {
            actions = (
              <>
                <a className="addNewData" onClick={() => this.saveRow(index, 'son')}>
                  保存
                </a>
                <Divider type="vertical" />
                <a onClick={() => this.cancelEdit(row, -1, 'son')}>退出</a>
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

    columnSon = columnSon.map(col => {
      // eslint-disable-next-line no-param-reassign
      if (!col.width) col.width = 100;
      tableWidthSon += col.width;
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
          editing: rowIndex === this.state.editIndexSon,
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
            <Row>
              <Col span={14}>
                <Form ref={this.tableFormRef}>
                  <StandardTable
                    scroll={{ x: tableWidth }}
                    rowClassName="editable-row"
                    components={components}
                    selectedRows={selectedRows}
                    loading={loading}
                    data={{ list, pagination }}
                    columns={columns}
                    onRow={record => ({ onClick: e => this.dataSon(record, e) })}
                    onSelectRow={this.handleSelectRows}
                    onChange={this.handleStandardTableChange}
                  />
                </Form>
              </Col>
              <Col span={1} />
              <Col span={9}>
                <Button type="primary" onClick={() => this.handleAddSon()}>
                  <PlusOutlined />
                  新建
                </Button>
                <Form ref={this.tableFormRef1}>
                  <Table
                    scroll={{ x: tableWidthSon }}
                    loading={loadingSon}
                    dataSource={dataSon}
                    columns={columnSon}
                    pagination={false}
                    rowKey="id"
                    rowClassName="editable-row"
                    components={components}
                  />
                </Form>
              </Col>
            </Row>
          </div>
        </Card>
        <AminoAcid
          getData={v => {
            this.getSonAminoAcid(v);
          }}
          onRef={ref => {
            this.AminoAcidShow = ref;
          }}
        />
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ peptide }) => ({
  peptide,
}))(Modifications);

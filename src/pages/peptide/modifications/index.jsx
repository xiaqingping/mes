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
import AminoAcid from '@/pages/peptide/components/amino-acid-mask'

const EditableContext = React.createContext();
const FormItem = Form.Item;
const { Option } = Select;
const { Search } = Input;

/**
 * 页面顶部筛选表单
 */
@Form.create()
class SearchPage extends Component {
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
      modificationType,
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
            <FormItem label="名称">
              {getFieldDecorator('name')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="修饰类型">
              {getFieldDecorator('modificationTypeID', { initialValue: '0' })(
                <Select>
                  <Option value="0">全部</Option>
                  {modificationType.map(item => <Option key={item.id} value={item.id}>
                  {item.modificationType}
                  </Option>)}
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

/**
 * 页面根组件
 */

@connect(({ peptide }) => ({
  peptide,
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
  }

  componentDidMount() {
    api.peptideBase.getModificationTypesAll().then(res => {
      this.setState({
        modificationType: res,
      })
    })
  }

  // 设置子值
  dataSon = (v, e) => {
    if (e.target.className === 'operate' || e.target.className.indexOf('ant-btn-sm') !== -1 || v.id < 1) {
      return
    }
    this.setState({
      loadingSon: true,
    })
    setTimeout(() => {
        this.setState({
          dataSon: v.details,
          selectParantData: true,
          loadingSon: false,
          parantData: v,
        })
      }, 500)
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
  getTableData = (options = {}, son) => {
    const { formValues } = this.state;
    const query = Object.assign({}, formValues, options);

    this.setState({
      formValues: query,
      loading: true,
    });

    api.peptideBase.getModifications(query).then(res => {
      if (son === 'son') {
        const { parantData } = this.state;
        res.rows.forEach(item => {
          if (item.id === parantData.id) {
            this.setState({
              dataSon: item.details,
            })
          }
        })
      }
      this.setState({
        list: res.rows,
        total: res.total,
        loading: false,
        editIndex: -1,
      });
    });
  }

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
  }

  // 删除数据
  deleteRow = (row, son) => {
    if (son === 'son') {
      api.peptideBase.deleteSuitableAminoAcids(row.id).then(() => {
        this.getTableData();
        this.setState({
          dataSon: [],
        })
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
        })
      });
    } else {
      api.peptideBase.resumeModifications(row.id).then(() => {
        this.getTableData();
      });
    }
  };

  // 保存
  saveRow = (index, son) => {
    if (son === 'son') {
      this.props.form.validateFields(error => {
        if (error) return;
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
          },
          );
        }
      });
    } else {
      this.props.form.validateFields((error, row) => {
        if (error) return;
        const { list } = this.state;
        const newData = { ...list[index],
                          ...row,
                          isIndependentModification: row.isIndependentModification ? 1 : 2,
                        };
        if (newData.id > 0) {
          // api.peptideBase.updateSeries(newData).then(() => this.getTableData());
        } else {
          api.peptideBase.insertModifications(newData).then(() => this.getTableData());
        }
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
  }

  // 得到搜索的值
  getSonAminoAcid = data => {
    this.setState({
        sonAminoAcid: data,
    })
    this.props.form.setFieldsValue({
      code: data.code,
      name: data.name,
    })
  }

  clearInput = () => {
    this.setState({
      sonAminoAcid: [],
    })
    this.props.form.setFieldsValue({
      code: '',
      name: '',
    })
  }

  render() {
    const {
      formValues: { page: current, rows: pageSize },
      selectedRows,
      list,
      total,
      loading,
      dataSon,
      loadingSon,
      modificationType,
      sonAminoAcid,
    } = this.state;
    const data = { list, pagination: { current, pageSize, total } };
    const { peptide: { commonData } } = this.props;
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
        inputType: <Input style={{ width: '90%' }}/>,
        rules: [
          { required: true, message: '必填' },
        ],
      },
      {
        title: '修饰代码',
        dataIndex: 'modificationCode',
        width: 120,
        editable: true,
        inputType: <Input style={{ width: '90%' }}/>,
        rules: [
          { required: true, message: '必填' },
        ],
      },
      {
        title: '修饰位置',
        dataIndex: 'modificationPosition',
        width: 140,
        editable: true,
        inputType: (
          <Select style={{ width: '90%' }}>
          {commonData.modificationPosition.map(item =>
            <Option value={item.id} key={item.id}>{item.name}</Option>,
          )}
          </Select>),
        rules: [
          { required: true, message: '必填' },
        ],
        render: text => {
          let val = null;
          commonData.modificationPosition.forEach(item => {
            if (item.id === text) {
              val = item.name
            }
          })
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
        inputType: <Checkbox style={{ textAlign: 'center', display: 'block' }}/>,
      },
      {
        title: '修饰类别',
        dataIndex: 'modificationTypeID',
        width: 250,
        editable: true,
        inputType: (
          <Select style={{ width: '90%' }}>
          {modificationType.map(item =>
            <Option value={item.id} key={item.id}>{item.modificationType}</Option>,
          )}
          </Select>),
        rules: [
          { required: true, message: '必填' },
        ],
        render: text => {
          let val = null;
          modificationType.forEach(item => {
            if (item.id === text) {
              val = item.modificationType
            }
          })
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
                <a className="addNewData" onClick={() => this.saveRow(index)}>保存</a>
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
        inputType: <Search style={{ width: '90%' }} onSearch={() => this.AminoAcidShow.visibleShow(true)} value={sonAminoAcid.code ? sonAminoAcid.code : ''} readOnly/>,
        rules: [
          { required: true, message: '必填' },
        ],
      },
      {
        title: '名称',
        dataIndex: 'name',
        width: 120,
        editable: true,
        inputType: <Input style={{ width: '90%' }} value={sonAminoAcid.name ? sonAminoAcid.name : ''} readOnly/>,
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
                <a className="addNewData" onClick={() => this.saveRow(index, 'son')}>保存</a>
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
            <SearchPage getTableData={this.getTableData} modificationType={ modificationType }
             status={commonData.status}/>
            <div className="tableListOperator">
              <Button icon="plus" type="primary" onClick={() => this.handleAdd()}>
                新建
              </Button>
            </div>
            <Col span={14}>
              <EditableContext.Provider value={this.props.form}>
                <StandardTable
                  scroll={{ x: tableWidth }}
                  rowClassName="editable-row"
                  components={components}
                  selectedRows={selectedRows}
                  loading={loading}
                  data={data}
                  columns={columns}
                  onRow={record => ({ onClick: e => this.dataSon(record, e) }) }
                  onSelectRow={this.handleSelectRows}
                  onChange={this.handleStandardTableChange}
                />
              </EditableContext.Provider>
              </Col>
              <Col span={1}>
              </Col>
              <Col span={9}>
                <Button icon="plus" type="primary" onClick={() => this.handleAddSon()}>
                  新建
                </Button>
                <EditableContext.Provider value={this.props.form}>
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
                </EditableContext.Provider>
              </Col>
          </div>
        </Card>
        <AminoAcid getData={v => { this.getSonAminoAcid(v) }} 
        onRef={ ref => this.AminoAcidShow = ref }/>
      </PageHeaderWrapper>
    );
  }
}

export default Modifications;

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
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import api from '@/api';
import './style.less'
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
            <FormItem label="代码">
            {getFieldDecorator('aminoAcidCode')(<Input />)}
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
      double,
      ...restProps
    } = this.props;
    if (editing) {
      if (double) {
        return (
          <td {...restProps} style={{ padding: 0 }}>
              <Form.Item style={{ margin: 0, padding: 0 }}>
                {getFieldDecorator(`${dataIndex}0`, {
                  rules,
                  initialValue: record[`${dataIndex}0`],
                })(inputType)}
              </Form.Item>
              <Divider type="horizontal" style={{ margin: 0 }}/>
              <Form.Item style={{ margin: 0, padding: 0 }}>
                {getFieldDecorator(`${dataIndex}1`, {
                  rules,
                  initialValue: record[`${dataIndex}1`],
                })(inputType)}
              </Form.Item>
          </td>
        );
      }
      return (
        <td {...restProps} style={{ padding: 0 }}>
            <Form.Item style={{ margin: 0, padding: 0 }}>
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
class Order extends Component {
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

  componentDidMount() {
    //
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

    api.peptideBase.getAminoAcid(query).then(data => {
      console.log(data)
      const map = {}; const dest = [];
      for (let i = 0; i < data.rows.length; i++) {
        const ai = data.rows[i];
        if (!map[ai.id]) {
          dest.push({
            id: ai.id,
            code: ai.code,
            name: ai.name,
            hydrophilic: ai.hydrophilic,
            hydrophobic: ai.hydrophobic,
            acidic: ai.acidic,
            alkaline: ai.alkaline,
            isCanDisulfideBond: ai.isCanDisulfideBond,
            molecularWeight: ai.molecularWeight,
            isoelectricPoint: ai.isoelectricPoint,
            carboxylationDissociationConstant: ai.carboxylationDissociationConstant,
            aminoDissociationConstant: ai.aminoDissociationConstant,
            status: ai.status,
            creatorName: ai.creatorName,
            createDate: ai.createDate,
            cancelName: ai.cancelName,
            cancelDate: ai.cancelDate,
            aminoAcidType: ai.aminoAcidType,
            longCode: ai.longCode,
            shortCode: ai.shortCode,
          });
          map[ai.id] = ai;
        } else {
          for (let j = 0; j < dest.length; j++) {
            const dj = dest[j];
            if (dj.id === ai.id) {
              dj.cancelName = dj.cancelName || ai.cancelName ? [dj.cancelName, ai.cancelName] : '';
              dj.cancelDate = dj.cancelDate || ai.cancelDate ? [dj.cancelDate, ai.cancelDate] : '';
              dj.shortCode = dj.shortCode || ai.shortCode ? [dj.shortCode, ai.shortCode] : '';
              // dj.shortCode = (dj.shortCode ? dj.shortCode : '')
              // + (ai.shortCode ? ` | ${ai.shortCode}` : '');
              dj.longCode = dj.longCode || ai.longCode ? [dj.longCode, ai.longCode] : '';
              // dj.longCode = (dj.longCode ? dj.longCode : '')
              // + (ai.longCode ? ` | ${ai.longCode}` : '');
              dj.aminoAcidType = dj.aminoAcidType || ai.aminoAcidType ? [dj.aminoAcidType, ai.aminoAcidType] : '';
              // dj.aminoAcidType = (dj.aminoAcidType ? dj.aminoAcidType : '')
              // + (ai.aminoAcidType ? ` | ${ai.aminoAcidType}` : '');
              break;
            }
          }
        }
      }
      this.setState({
        loading: false,
        list: dest,
        total: dest.length * 2,
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
    api.peptideBase.deleteAminoAcid(row.id).then(() => {
      this.getTableData();
    });
  };

  // 恢复数据
  resumeRow = row => {
    api.peptideBase.resumeAminoAcid(row.id).then(() => {
      this.getTableData();
    });
  };

  // 保存
  saveRow = index => {
    this.props.form.validateFields((error, row) => {
      if (error) return;
      const { list } = this.state;
      const newData = { ...list[index],
                        ...row,
                        hydrophilic: row.hydrophilic ? 1 : 2,
                        hydrophobic: row.hydrophobic ? 1 : 2,
                        acidic: row.acidic ? 1 : 2,
                        alkaline: row.alkaline ? 1 : 2,
                        isCanDisulfideBond: row.isCanDisulfideBond ? 1 : 2,
                        details: [
                                {
                                  aminoAcidType: 'L',
                                  longCode: row.longCode0,
                                  shortCode: row.shortCode0,
                                },
                                {
                                  aminoAcidType: 'D',
                                  longCode: row.longCode1,
                                  shortCode: row.shortCode1,
                                },
                              ],
                      };
      if (newData.id > 0) {
        // api.peptideBase.updateSeries(newData).then(() => this.getTableData());
      } else {
        api.peptideBase.insertAminoAcid(newData).then(() => this.getTableData());
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
    const { peptide: { commonData } } = this.props
    let tableWidth = 0;

    let columns = [
      {
        title: '编号',
        dataIndex: 'code',
        width: 100,
      },
      {
        title: '名称',
        dataIndex: 'name',
        width: 100,
        editable: true,
        inputType: <Input style={{ width: 80 }}/>,
        rules: [
          { required: true, message: '必填' },
        ],
      },
      {
        title: '亲水性',
        dataIndex: 'hydrophilic',
        width: 100,
        align: 'center',
        render: text => (text === 1 ? '√' : ''),
        editable: true,
        inputType: <Checkbox style={{ textAlign: 'center', display: 'block' }}/>,
      },
      {
        title: '疏水性',
        dataIndex: 'hydrophobic',
        align: 'center',
        width: 100,
        render: text => (text === 1 ? '√' : ''),
        editable: true,
        inputType: <Checkbox style={{ textAlign: 'center', display: 'block' }}/>,
      },
      {
        title: '酸性',
        dataIndex: 'acidic',
        align: 'center',
        width: 100,
        render: text => (text === 1 ? '√' : ''),
        editable: true,
        inputType: <Checkbox style={{ textAlign: 'center', display: 'block' }}/>,
      },
      {
        title: '碱性',
        dataIndex: 'alkaline',
        align: 'center',
        width: 100,
        render: text => (text === 1 ? '√' : ''),
        editable: true,
        inputType: <Checkbox style={{ textAlign: 'center', display: 'block' }}/>,
      },
      {
        title: '是否可做二硫键',
        dataIndex: 'isCanDisulfideBond',
        align: 'center',
        width: 230,
        render: text => (text === 1 ? '√' : ''),
        editable: true,
        inputType: <Checkbox style={{ textAlign: 'center', display: 'block' }}/>,
      },
      {
        title: '分子量',
        dataIndex: 'molecularWeight',
        width: 100,
        editable: true,
        inputType: <Input style={{ width: 80 }}/>,
        rules: [
          { required: true, message: '必填' },
        ],
      },
      {
        title: '等电点',
        dataIndex: 'isoelectricPoint',
        width: 100,
        editable: true,
        inputType: <Input style={{ width: 80 }}/>,
        rules: [
          { required: true, message: '必填' },
        ],
      },
      {
        title: '羧基解离常数',
        dataIndex: 'carboxylationDissociationConstant',
        width: 200,
        editable: true,
        inputType: <Input style={{ width: 80 }}/>,
        rules: [
          { required: true, message: '必填' },
        ],
      },
      {
        title: '氨基解离常数',
        dataIndex: 'aminoDissociationConstant',
        width: 200,
        editable: true,
        inputType: <Input style={{ width: 80 }}/>,
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
        width: 300,
        // render: (value, row, index) => {
        //   const obj = {
        //     children: value,
        //     props: {},
        //   };
        //   if (index % 2 === 0) {
        //     obj.props.rowSpan = 2;
        //   }
        //   if (index % 2 === 1) {
        //     obj.props.rowSpan = 0;
        //   }
        //   return obj;
        // },
      },
      {
        title: '删除人',
        dataIndex: 'cancelName',
        width: 100,
        render: text => {
          if (!text) return false;
          return (<Fragment>
                    <span>{text[0]}</span>
                    <Divider type="horizontal" style={{ margin: 0 }}/>
                    <span>{text[1]}</span>
                </Fragment>)
        },
      },
      {
        title: '删除时间',
        dataIndex: 'cancelDate',
        width: 300,
        render: text => {
          if (!text) return false;
          return (<Fragment>
                    <span>{text[0]}</span>
                    <Divider type="horizontal" style={{ margin: 0 }}/>
                    <span>{text[1]}</span>
                </Fragment>)
        },
      },
      {
        title: '类型',
        dataIndex: 'aminoAcidType',
        width: 100,
        align: 'center',
        editable: true,
        inputType: (
          <Fragment>
            <Select style={{ width: 80, display: 'block', margin: '0 auto' }} defaultValue="L">
              <Option value="L">L</Option>
            </Select>
            <Divider type="horizontal" style={{ margin: 0 }}/>
            <Select style={{ width: 80, display: 'block', margin: '0 auto' }} defaultValue="D">
              <Option value="D">D</Option>
            </Select>
          </Fragment>
        ),
        render: text => {
          if (!text) return false;
          return (<Fragment>
                    <span>{text[0]}</span>
                    <Divider type="horizontal" style={{ margin: 0 }}/>
                    <span>{text[1]}</span>
                </Fragment>)
        },
      },
      {
        title: '长代码',
        dataIndex: 'longCode',
        width: 100,
        align: 'center',
        double: true,
        render: text => {
          if (!text) return false;
          return (<Fragment>
                    <span>{text[0]}</span>
                    <Divider type="horizontal" style={{ margin: 0 }}/>
                    <span>{text[1]}</span>
                </Fragment>)
        },
        editable: true,
        inputType: <Input style={{ width: 80, display: 'block', margin: '0 auto' }}/>,
      },
      {
        title: '短代码',
        dataIndex: 'shortCode',
        width: 100,
        align: 'center',
        double: true,
        render: text => {
          if (!text) return false;
          return (<Fragment>
                    <span>{text[0]}</span>
                    <Divider type="horizontal" style={{ margin: 0 }}/>
                    <span>{text[1]}</span>
                </Fragment>)
        },
        editable: true,
        inputType: <Input style={{ width: 80, display: 'block', margin: '0 auto' }}/>,
      },
      {
        title: '操作',
        width: 150,
        align: 'center',
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
          double: col.double,
        }),
      };
    });

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className="tableList">
            <Search getTableData={this.getTableData} status={commonData.status}/>
            <div className="tableListOperator">
              <Button icon="plus" type="primary" onClick={() => this.handleAdd()}>
                新建
              </Button>
            </div>
            <EditableContext.Provider value={this.props.form}>
              <StandardTable
                className="mytables"
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

export default Form.create()(Order);

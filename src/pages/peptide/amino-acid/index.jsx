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
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import api from '@/api';
import './style.less';
import { connect } from 'dva';
import TableSearchForm from '@/components/TableSearchForm';
import EditableCell from '@/components/EditableCell';
import { PlusOutlined } from '@ant-design/icons';

const FormItem = Form.Item;
const { Option } = Select;

class Order extends Component {
  tableSearchFormRef = React.createRef();

  tableFormRef = React.createRef();

  state = {
    pagination: {},
    list: [],
    loading: false,
    selectedRows: [],
    editIndex: -1,
    id: 0, // 新增数据时，提供负数id
    longCode0: '',
    longCode1: '',
    shortCode0: '',
    shortCode1: '',
  };

  // 顶部表单默认值
  initialValues = {
    status: 1,
    page: 1,
    rows: 10,
  };

  componentDidMount() {
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
    const dataVal = {
      page,
      rows,
      ...formData,
      ...options,
    };

    api.peptideBase.getAminoAcid(dataVal, true).then(data => {
      const map = {};
      const dest = [];
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
              dj.aminoAcidType =
                dj.aminoAcidType || ai.aminoAcidType ? [dj.aminoAcidType, ai.aminoAcidType] : '';
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
        pagination: {
          current: dataVal.page,
          pageSize: dataVal.rows,
          total: dest.length * 2,
        },
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
  saveRow = async index => {
    try {
      const row = await this.tableFormRef.current.validateFields();
      const { list, longCode0, longCode1, shortCode0, shortCode1 } = this.state;
      const newData = {
        ...list[index],
        ...row,
        hydrophilic: row.hydrophilic ? 1 : 2,
        hydrophobic: row.hydrophobic ? 1 : 2,
        acidic: row.acidic ? 1 : 2,
        alkaline: row.alkaline ? 1 : 2,
        isCanDisulfideBond: row.isCanDisulfideBond ? 1 : 2,
        details: [
          {
            aminoAcidType: 'L',
            longCode: longCode0,
            shortCode: shortCode0,
          },
          {
            aminoAcidType: 'D',
            longCode: longCode1,
            shortCode: shortCode1,
          },
        ],
      };
      if (newData.id > 0) {
        // api.peptideBase.updateSeries(newData).then(() => this.getTableData());
      } else {
        api.peptideBase.insertAminoAcid(newData).then(() => this.getTableData());
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
      longCode0: '',
      longCode1: '',
      shortCode0: '',
      shortCode1: '',
      list: [
        {
          id: newId,
        },
        ...list,
      ],
    });
  };

  // 渲染表单
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
          <FormItem label="名称" name="name">
            <Input />
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="代码" name="aminoAcidCode">
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
    const { pagination, selectedRows, list, loading } = this.state;
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
        inputType: <Input />,
        rules: [{ required: true, message: '必填' }],
      },
      {
        title: '亲水性',
        dataIndex: 'hydrophilic',
        width: 100,
        align: 'center',
        render: text => (text === 1 ? '√' : ''),
        editable: true,
        checkType: true,
        inputType: <Checkbox />,
      },
      {
        title: '疏水性',
        dataIndex: 'hydrophobic',
        align: 'center',
        width: 100,
        render: text => (text === 1 ? '√' : ''),
        editable: true,
        checkType: true,
        inputType: <Checkbox />,
      },
      {
        title: '酸性',
        dataIndex: 'acidic',
        align: 'center',
        width: 65,
        render: text => (text === 1 ? '√' : ''),
        editable: true,
        checkType: true,
        inputType: <Checkbox />,
      },
      {
        title: '碱性',
        dataIndex: 'alkaline',
        align: 'center',
        width: 65,
        render: text => (text === 1 ? '√' : ''),
        editable: true,
        checkType: true,
        inputType: <Checkbox />,
      },
      {
        title: '是否可做二硫键',
        dataIndex: 'isCanDisulfideBond',
        align: 'center',
        width: 180,
        render: text => (text === 1 ? '√' : ''),
        editable: true,
        checkType: true,
        inputType: <Checkbox />,
      },
      {
        title: '分子量',
        dataIndex: 'molecularWeight',
        width: 100,
        editable: true,
        inputType: <Input />,
        rules: [{ required: true, message: '必填' }],
      },
      {
        title: '等电点',
        dataIndex: 'isoelectricPoint',
        width: 100,
        editable: true,
        inputType: <Input />,
        rules: [{ required: true, message: '必填' }],
      },
      {
        title: '羧基解离常数',
        dataIndex: 'carboxylationDissociationConstant',
        width: 140,
        editable: true,
        inputType: <Input />,
        rules: [{ required: true, message: '必填' }],
      },
      {
        title: '氨基解离常数',
        dataIndex: 'aminoDissociationConstant',
        width: 140,
        editable: true,
        inputType: <Input />,
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
        title: '创建时间',
        dataIndex: 'createDate',
        width: 300,
      },
      {
        title: '删除人',
        dataIndex: 'cancelName',
        width: 100,
        render: text => {
          if (!text) return false;
          return (
            <Fragment>
              <span>{text[0]}</span>
              <Divider type="horizontal" style={{ margin: 0 }} />
              <span>{text[1]}</span>
            </Fragment>
          );
        },
      },
      {
        title: '删除时间',
        dataIndex: 'cancelDate',
        width: 300,
        render: text => {
          if (!text) return false;
          return (
            <Fragment>
              <span>{text[0]}</span>
              <Divider type="horizontal" style={{ margin: 0 }} />
              <span>{text[1]}</span>
            </Fragment>
          );
        },
      },
      {
        title: '类型',
        dataIndex: 'aminoAcidType',
        width: 60,
        align: 'center',
        editable: true,
        inputType: (
          <Fragment>
            <Select style={{ width: '90%', display: 'block', margin: '0 auto' }} defaultValue="L">
              <Option value="L">L</Option>
            </Select>
            <Divider type="horizontal" style={{ margin: '2px 0 0 0 ' }} />
            <Select style={{ width: '90%', display: 'block', margin: '0 auto' }} defaultValue="D">
              <Option value="D">D</Option>
            </Select>
          </Fragment>
        ),
        render: text => {
          if (!text) return false;
          return (
            <Fragment>
              <span>{text[0]}</span>
              <Divider type="horizontal" style={{ margin: '2px 0 0 0 ' }} />
              <span>{text[1]}</span>
            </Fragment>
          );
        },
      },
      {
        title: '长代码',
        dataIndex: 'longCode',
        width: 100,
        align: 'center',
        editable: true,
        inputType: (
          <Fragment>
            <Input
              style={{ width: '90%', display: 'block', margin: '0 auto' }}
              onChange={e => {
                this.setState({
                  longCode0: e.target.value,
                });
              }}
            />
            <Divider type="horizontal" style={{ margin: '2px 0 0 0 ' }} />
            <Input
              style={{ width: '90%', display: 'block', margin: '0 auto' }}
              onChange={e => {
                this.setState({
                  longCode1: e.target.value,
                });
              }}
            />
          </Fragment>
        ),
        render: text => {
          if (!text) return false;
          return (
            <Fragment>
              <span>{text[0]}</span>
              <Divider type="horizontal" style={{ margin: '2px 0 0 0 ' }} />
              <span>{text[1]}</span>
            </Fragment>
          );
        },
      },
      {
        title: '短代码',
        dataIndex: 'shortCode',
        width: 100,
        align: 'center',
        editable: true,
        inputType: (
          <Fragment>
            <Input
              style={{ width: '90%', display: 'block', margin: '0 auto' }}
              onChange={e => {
                this.setState({
                  shortCode0: e.target.value,
                });
              }}
            />
            <Divider type="horizontal" style={{ margin: '2px 0 0 0 ' }} />
            <Input
              style={{ width: '90%', display: 'block', margin: '0 auto' }}
              onChange={e => {
                this.setState({
                  shortCode1: e.target.value,
                });
              }}
            />
          </Fragment>
        ),
        render: text => {
          if (!text) return false;
          return (
            <Fragment>
              <span>{text[0]}</span>
              <Divider type="horizontal" style={{ margin: '2px 0 0 0 ' }} />
              <span>{text[1]}</span>
            </Fragment>
          );
        },
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
          checkType: col.checkType,
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
                className="mytables"
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
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ peptide }) => ({
  peptide,
}))(Order);

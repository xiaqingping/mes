// 多肽合成产品
import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Dropdown,
  Form,
  Icon,
  Input,
  InputNumber,
  Menu,
  Row,
  Select,
  message,
  Table,
} from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import api from '@/api'

const FormItem = Form.Item;
const { Option } = Select;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const { Search } = Input;

class Order extends Component {
  state = {
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
    list: [],
    loading: false,
    selectedRows: [],
    editIndex: -1,
  };

  columns = [
    {
      title: '编号',
      dataIndex: 'code',
      width: 100,
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: 100,
    },
    {
      title: '亲水性',
      dataIndex: 'hydrophilic',
      width: 100,
    },
    {
      title: '疏水性',
      dataIndex: 'hydrophobic',
      width: 100,
    },
    {
      title: '酸性',
      dataIndex: 'acidic',
      width: 100,
    },
    {
      title: '碱性',
      dataIndex: 'alkaline',
      width: 100,
    },
    {
      title: '是否可做二硫键',
      dataIndex: 'isCanDisulfideBond',
      width: 230,
    },
    {
      title: '分子量',
      dataIndex: 'molecularWeight',
      width: 100,
    },
    {
      title: '等电点',
      dataIndex: 'isoelectricPoint',
      width: 100,
    },
    {
      title: '羧基解离常数',
      dataIndex: 'carboxylationDissociationConstant',
      width: 200,
    },
    {
      title: '氨基解离常数',
      dataIndex: 'aminoDissociationConstant',
      width: 200,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: text => (text === 1 ? '正常' : '已删除'),
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
    },
    {
      title: '删除时间',
      dataIndex: 'cancelDate',
      width: 300,
    },
    {
      title: '类型',
      dataIndex: 'aminoAcidType',
      width: 100,
    },
    {
      title: '长代码',
      dataIndex: 'longCode',
      width: 100,
    },
    {
      title: '短代码',
      dataIndex: 'shortCode',
      width: 100,
    },
    {
      title: '操作',
      fixed: 'right',
      width: 100,
      render: (value, row, index) => {
        const { status } = row;
        const { editIndex } = this.state;
        let actions;
        if (editIndex !== index) {
          if (row.status === 1) {
            actions = (
              <>
                <a>删除</a>
                </>
            );
          } else {
            actions = (
              <>
                <a>恢复</a>
                </>
            );
          }
        }
        if (editIndex === index) {
          actions = (
            <>
              <a>保存</a>
              <Divider type="vertical" />
              <a>退出</a>
            </>
          );
        }
        return actions;
      },
    },
  ];

  componentDidMount() {
    this.getTableData();
  }

  handleSearch = e => {
    e.preventDefault();
    this.getTableData({ page: 1 });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    this.getTableData({
      page: pagination.current,
      rows: pagination.pageSize,
    });
  }

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  // 获取表格数据
  getTableData = (options = {}) => {
    this.setState({
      loading: true,
    });
    const { form } = this.props;
    const { pagination: { current: page, pageSize: rows } } = this.state;
    const query = Object.assign(form.getFieldsValue(), { page, rows }, options);
    api.peptideBase.getAminoAcid(query).then(data => {
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
              dj.shortCode = (dj.shortCode ? dj.shortCode : '') + (ai.shortCode ? ` | ${ai.shortCode}` : '');
              dj.longCode = (dj.longCode ? dj.longCode : '') + (ai.longCode ? ` | ${ai.longCode}` : '');
              dj.aminoAcidType = (dj.aminoAcidType ? dj.aminoAcidType : '') + (ai.aminoAcidType ? ` | ${ai.aminoAcidType}` : '');
              break;
            }
          }
        }
      }
      this.setState({
        loading: false,
        list: dest,
        pagination: {
          total: dest.length * 2,
          current: query.page,
          pageSize: query.rows,
        },
      });
    });
  }

  handleFormReset = () => {
    this.props.form.resetFields();
  };

  handleAdd = () => {
    console.log('add');
  }

  renderForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
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
            {getFieldDecorator('status', { initialValue: '1' })(
                <Select>
                  <Option value="0">全部</Option>
                  <Option value="1">正常</Option>
                  <Option value="2">已删除</Option>
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
    const { list, pagination, loading, selectedRows } = this.state;
    const data = { list, pagination };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className="tableList">
            <div className="tableListForm">{this.renderForm()}</div>
            <div className="tableListOperator">
              <Button icon="plus" type="primary" onClick={() => this.handleAdd()}>
                新建
              </Button>
            </div>
            <StandardTable
              scroll={{ x: 2000 }}
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(Order);

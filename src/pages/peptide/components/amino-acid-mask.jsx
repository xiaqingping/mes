// 氨基酸弹框
import { Col, Divider, Form, Input, Select, Table, Modal } from 'antd';
import React, { Component, Fragment } from 'react';

import api from '@/api';
import './style.less';
import { connect } from 'dva';
import TableSearchForm from '@/components/TableSearchForm';

const FormItem = Form.Item;
const { Option } = Select;

class Order extends Component {
  tableSearchFormRef = React.createRef();

  state = {
    pagination: {},
    list: [],
    loading: false,
    visible: false, // 遮罩层的判断
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
    this.setState({ visible });
    this.getTableData(this.initialValues);
  };

  handleSelect = data => {
    this.props.getData(data);
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

  // 获取表格数据
  getTableData = (options = {}) => {
    this.setState({ loading: true });

    const formData = this.tableSearchFormRef.current
      ? this.tableSearchFormRef.current.getFieldsValue()
      : '';
    const { pagination } = this.state;
    const { current: page, pageSize: rows } = pagination;
    const datas = {
      page,
      rows,
      ...formData,
      ...options,
    };

    api.peptideBase.getAminoAcid(datas, true).then(data => {
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
          current: datas.page,
          pageSize: datas.rows,
          total: dest.length * 2,
        },
      });
    });
  };

  handleFormReset = () => {
    this.tableSearchFormRef.current.resetFields();
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
    const { pagination, list, loading, visible } = this.state;
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
      },
      {
        title: '亲水性',
        dataIndex: 'hydrophilic',
        width: 100,
        align: 'center',
        render: text => (text === 1 ? '√' : ''),
      },
      {
        title: '疏水性',
        dataIndex: 'hydrophobic',
        align: 'center',
        width: 100,
        render: text => (text === 1 ? '√' : ''),
      },
      {
        title: '酸性',
        dataIndex: 'acidic',
        align: 'center',
        width: 100,
        render: text => (text === 1 ? '√' : ''),
      },
      {
        title: '碱性',
        dataIndex: 'alkaline',
        align: 'center',
        width: 100,
        render: text => (text === 1 ? '√' : ''),
      },
      {
        title: '是否可做二硫键',
        dataIndex: 'isCanDisulfideBond',
        align: 'center',
        width: 230,
        render: text => (text === 1 ? '√' : ''),
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
        width: 100,
        align: 'center',
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
        title: '长代码',
        dataIndex: 'longCode',
        width: 100,
        align: 'center',
        double: true,
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
        title: '短代码',
        dataIndex: 'shortCode',
        width: 100,
        align: 'center',
        double: true,
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
        title: '操作',
        dataIndex: 'actions',
        fixed: 'right',
        render: (text, record) => <a onClick={() => this.handleSelect(record)}>选择</a>,
      },
    ];

    columns = columns.map(col => {
      // eslint-disable-next-line no-param-reassign
      if (!col.width) col.width = 100;
      tableWidth += col.width;
      return col;
    });

    return (
      <div>
        <Modal
          width="1200px"
          title="多肽氨基酸列表"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
        >
          <TableSearchForm
            ref={this.tableSearchFormRef}
            initialValues={this.initialValues}
            getTableData={this.getTableData}
            simpleForm={this.simpleForm}
          />
          <div className="tableListOperator" />
          <Table
            dataSource={list}
            columns={columns}
            scroll={{ x: tableWidth, y: 400 }}
            pagination={pagination}
            rowKey="code"
            // rowSelection={rowSelection}
            loading={loading}
            onChange={this.handleStandardTableChange}
          />
        </Modal>
      </div>
    );
  }
}

export default connect(({ peptide }) => ({
  peptide,
}))(Order);

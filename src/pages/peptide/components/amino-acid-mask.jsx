// 氨基酸弹框
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Table,
  Modal,
} from 'antd';
import React, { Component, Fragment } from 'react';

import api from '@/api';
import './style.less'
import { connect } from 'dva';

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
    visible: false, // 遮罩层的判断
    data: [],
  }

  componentDidMount () {
    this.props.onRef(this);
  }

  visibleShow = visible => {
    this.setState({ visible })
  }

  handleOk = () => {
    if (this.state.data.length !== 0) {
      this.props.getData(this.state.data);
      this.handleCancel()
    }
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
  }

  // 获取表格数据
  getTableData = (options = {}) => {
    const { formValues } = this.state;
    const query = Object.assign({}, formValues, options);

    this.setState({
      formValues: query,
      loading: true,
    });

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
      });
    });
  }

  handleFormReset = () => {
    this.props.form.resetFields();
  };

  render() {
    const {
      formValues: { page: current, rows: pageSize },
      list,
      total,
      loading,
      visible,
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
      },
    ];


    columns = columns.map(col => {
      // eslint-disable-next-line no-param-reassign
      if (!col.width) col.width = 100;
      tableWidth += col.width;
      return col
    });

    const rowSelection = {
      type: 'radio',
      onChange: (selectedRowKeys, selectedRows) => {
          this.setState({
              data: selectedRows[0],
            })
        },
    }

    return (
      <div>
        <Modal
          width="1200px"
          title="多肽氨基酸列表"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
            <Search getTableData={this.getTableData} status={commonData.status}/>
            <div className="tableListOperator">
            </div>
              <Table
                dataSource={data.list}
                columns={columns}
                scroll={{ x: tableWidth, y: 400 }}
                pagination={data.pagination}
                rowKey="code"
                rowSelection={rowSelection}
                loading={loading}
                onChange={this.handleStandardTableChange}
               />
        </Modal>
      </div>
    );
  }
}

export default Form.create()(Order);

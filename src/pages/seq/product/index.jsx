import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Select,
  Checkbox,
  message,
  Popconfirm,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import TableSearchForm from '@/components/TableSearchForm';
import api from '@/api';
import { formatter } from '@/utils/utils';
import ChooseProduct from '@/components/choosse/seq/Product';

const FormItem = Form.Item;
const { Option } = Select;
const { Search } = Input;

const EditableCell = props => {
  const {
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    editOptions,
    ...restProps
  } = props;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item name={dataIndex} {...editOptions}>
          {inputType}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

/**
 * 页面根组件
 */
class Product extends React.Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.TopForm = React.createRef();
    this.state = {
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      list: [],
      loading: false,
      selectedRows: [],
      editKey: null,
      id: 0, // 新增数据时，提供负数id
    };
    this.initialValues = {
      status: '1',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'seq/getSampleType',
    });

    dispatch({
      type: 'seq/getSeqType',
    });
    this.getTableData();
  }

  // 顶部表单简单搜索
  simpleForm = () => (
    <>
      <Col xxl={6} lg={8} sm={12}>
        <FormItem name="status" label="状态">
          <Select>
            <Option value="1">正常</Option>
            <Option value="2">已删除</Option>
          </Select>
        </FormItem>
      </Col>
      <Col xxl={6} lg={8} sm={12}>
        <FormItem name="productCode" label="SAP编号">
          <Search onSearch={() => this.ChooseProduct.changeVisible(true)} />
        </FormItem>
      </Col>
      <Col xxl={6} lg={0} sm={12}>
        <FormItem name="sampleTypeId" label="样品类型">
          <Select>
            <Option value="1">PCR产物(已纯化)</Option>
            <Option value="2">PCR产物(未纯化)</Option>
          </Select>
        </FormItem>
      </Col>
    </>
  );

  advancedForm = () => (
    <>
      <Col xxl={6} lg={8} sm={12}>
        <FormItem name="status" label="状态">
          <Select>
            <Option value="1">正常</Option>
            <Option value="2">已删除</Option>
          </Select>
        </FormItem>
      </Col>
      <Col xxl={6} lg={8} sm={12}>
        <FormItem name="productCode" label="SAP编号">
          <Search onSearch={() => this.ChooseProduct.changeVisible(true)} />
        </FormItem>
      </Col>
      <Col xxl={6} lg={8} sm={12}>
        <FormItem name="sampleTypeId" label="样品类型">
          <Select>
            {this.props.sampleType.map(e => (
              <Option value={e.id} key={e.id}>
                {e.name}
              </Option>
            ))}
          </Select>
        </FormItem>
      </Col>
      <Col xxl={6} lg={8} sm={12}>
        <FormItem name="seqTypeId" label="测序类型">
          <Select>
            {this.props.seqType.map(e => (
              <Option value={e.id} key={e.id}>
                {e.name}
              </Option>
            ))}
          </Select>
        </FormItem>
      </Col>
    </>
  );

  handleStandardTableChange = ({ current, pageSize, total }) => {
    const pagination = { current, pageSize, total };
    this.setState({ pagination }, () => {
      this.getTableData();
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  // 获取表格数据
  getTableData = async (options = {}) => {
    const formData = await this.TopForm.current.getFieldsValue();
    const { pagination } = this.state;
    const query = Object.assign(
      {},
      {
        page: pagination.current,
        rows: pagination.pageSize,
      },
      options,
      formData,
    );

    this.setState({ loading: true });

    api.sampletype
      .getSeqProduct(query, true)
      .then(res => {
        this.setState({
          list: res.rows,
          pagination: {
            current: query.page,
            pageSize: query.rows,
            total: res.total,
          },
          editKey: null,
        });
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  // 作废数据
  deleteRow = row => {
    api.sampletype.cancelSeqProduct(row.id).then(() => {
      this.getTableData();
    });
  };

  // 保存
  saveRow = async () => {
    const { sampleType, seqType } = this.props;
    try {
      let row = this.formRef.current.validateFields();
      const nowSampleType = sampleType.filter(e => e.id === row.sampleTypeName)[0];
      const nowSeqType = seqType.filter(e => e.id === row.seqTypeName)[0];

      row = {
        ...row,
        sampleTypeId: nowSampleType.id,
        sampleTypeCode: nowSampleType.code,
        sampleTypeName: nowSampleType.name,
        seqTypeId: nowSeqType.id,
        seqTypeCode: nowSeqType.code,
        seqTypeName: nowSeqType.name,
        surcharge: row.surcharge ? 1 : 2,
      };

      api.sampletype.addSeqProduct(row).then(() => this.getTableData());
    } catch (error) {
      console.log(error);
    }
  };

  // 退出编辑
  cancelEdit = (row, key) => {
    if (row.id > 0) {
      this.setState({ editKey: key });
    } else {
      const { list } = this.state;
      this.setState({
        list: list.filter(e => e.id > 0),
        editKey: key,
      });
    }
  };

  // 新增
  handleAdd = () => {
    const { editKey, id, list } = this.state;
    if (editKey) {
      message.warning('请先保存或退出正在编辑的数据');
      return;
    }

    const newId = id - 1;
    this.setState({
      id: newId,
      editKey: newId,
      list: [
        {
          id: newId,
        },
        ...list,
      ],
    });
  };

  selectChooseModalData = data => {
    this.props.form.setFieldsValue({
      productCode: data.code,
      productName: data.name,
    });
  };

  setColumnsToTable1 = () => {
    const { commonStatus, sampleType, seqType } = this.props;
    let tableWidth = 0;

    let columns = [
      {
        title: 'SAP产品编号',
        dataIndex: 'productCode',
        width: 140,
        editable: true,
        inputType: <Input disabled />,
      },
      {
        title: 'SAP产品名称',
        dataIndex: 'productName',
        width: 180,
        editable: true,
        inputType: <Search onSearch={() => this.ChooseProduct.changeVisible(true)} />,
        editOptions: {
          rules: [{ required: true, message: '必填' }],
        },
      },
      {
        title: '样品类型',
        dataIndex: 'sampleTypeName',
        width: 180,
        editable: true,
        inputType: (
          <Select onChange={this.sampleTypeChange} style={{ width: '100%' }}>
            {sampleType.map(e => (
              <Option value={e.id} key={e.id}>
                {e.name}
              </Option>
            ))}
          </Select>
        ),
        editOptions: {
          rules: [{ required: true, message: '必填' }],
        },
      },
      {
        title: '测序类型',
        dataIndex: 'seqTypeName',
        width: 180,
        editable: true,
        inputType: (
          <Select style={{ width: '100%' }}>
            {seqType.map(e => (
              <Option value={e.id} key={e.id}>
                {e.name}
              </Option>
            ))}
          </Select>
        ),
        editOptions: {
          rules: [{ required: true, message: '必填' }],
        },
      },
      {
        title: '统一附加费',
        dataIndex: 'surcharge',
        width: 120,
        editable: true,
        inputType: <Checkbox />,
        editOptions: {
          valuePropName: 'checked',
        },
        render(text) {
          return text === 1 ? '√' : '';
        },
      },
      {
        title: '状态',
        dataIndex: 'status',
        render(text) {
          return formatter(commonStatus, text);
        },
      },
      {
        title: '创建人',
        dataIndex: 'creatorName',
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        width: 200,
      },
      {
        title: '作废人',
        dataIndex: 'cancelName',
      },
      {
        title: '作废时间',
        dataIndex: 'cancelDate',
        width: 200,
      },
      {
        fixed: 'right',
        title: '操作',
        width: 120,
        render: (value, row, index) => {
          const { status } = row;
          const { editKey } = this.state;
          let actions;
          if (editKey !== row.id && status === 1) {
            actions = (
              <>
                <Popconfirm title="确定作废数据？" onConfirm={() => this.deleteRow(row)}>
                  <a>删除</a>
                </Popconfirm>
              </>
            );
          }
          if (editKey === row.id) {
            actions = (
              <>
                <a onClick={() => this.saveRow(index)}>保存</a>
                <Divider type="vertical" />
                <a onClick={() => this.cancelEdit(row, null)}>退出</a>
              </>
            );
          }
          return actions;
        },
      },
    ];

    columns = columns.map(col => {
      if (!col.width) col.width = 100;
      tableWidth += col.width;
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editOptions: col.editOptions,
          inputType: col.inputType,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: record.id === this.state.editKey,
        }),
      };
    });

    return { columns, tableWidth };
  };

  render() {
    const { pagination, selectedRows, list, loading } = this.state;

    const data = { list, pagination };
    const { columns, tableWidth } = this.setColumnsToTable1();
    const components = {
      body: {
        cell: EditableCell,
      },
    };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className="tableList">
            <TableSearchForm
              ref={this.TopForm}
              initialValues={this.initialValues}
              getTableData={this.getTableData}
              simpleForm={this.simpleForm}
              advancedForm={this.advancedForm}
            />
            <div className="tableListOperator">
              <Button icon={<PlusOutlined />} type="primary" onClick={() => this.handleAdd()}>
                新建
              </Button>
            </div>
            <Form ref={this.formRef}>
              <StandardTable
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
            </Form>
          </div>
          <ChooseProduct
            ref={ref => {
              this.ChooseProduct = ref;
            }}
            selectChooseModalData={this.selectChooseModalData}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ global, seq }) => ({
  commonStatus: global.commonStatus,
  sampleType: seq.sampleType,
  seqType: seq.seqType,
}))(Product);

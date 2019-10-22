import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Select,
  DatePicker,
  message,
} from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import api from '@/api';

const EditableContext = React.createContext();
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Search } = Input;

// 角色
const roles = {
  66: { id: 66, text: '测序制备反应' },
  65: { id: 65, text: '测序制备' },
  64: { id: 64, text: '测序项目' },
  63: { id: 63, text: '测序负责人' },
  62: { id: 62, text: '测序分析' },
  61: { id: 61, text: '测序反应' },
  60: { id: 60, text: '多肽审核' },
  59: { id: 59, text: '多肽制单' },
  58: { id: 58, text: '未使用' },
  57: { id: 57, text: '国际业务' },
  56: { value: 56, text: '基因实验查看' },
  55: { value: 55, text: '销售代表（仅查看）' },
  53: { value: 53, text: '代理商' },
  52: { value: 52, text: '客服订单' },
  51: { value: 51, text: '其他部门' },
  50: { value: 50, text: '测序审核' },
  49: { value: 49, text: '测序制单' },
  48: { value: 48, text: '基因实验' },
  47: { value: 47, text: '基因审核' },
  46: { value: 46, text: '基因制单' },
  45: { value: 45, text: '合成审核' },
  44: { value: 44, text: '合成制单' },
  39: { value: 39, text: '销售总监' },
  38: { value: 38, text: '大区经理' },
  37: { value: 37, text: '销售经理' },
  36: { value: 36, text: '销售助理' },
  35: { value: 35, text: '销售代表' },
  34: { value: 34, text: '财务' },
  33: { value: 33, text: '人事' },
  32: { value: 32, text: '仓库' },
  5: { value: 5, text: '系统管理员' },
  1: { value: 1, text: '管理员' },
  0: { value: 0, text: '0' },
};
const roleList = [
  { value: 67, text: 'BBI_基因' },
  { value: 56, text: '多肽订单' },
  { value: 53, text: '代理商' },
  { value: 52, text: '客服订单' },
  { value: 51, text: '其他部门' },
  { value: 50, text: '测序审核' },
  { value: 49, text: '测序制单' },
  { value: 48, text: '基因实验' },
  { value: 47, text: '基因审核' },
  { value: 46, text: '基因制单' },
  { value: 45, text: '合成审核' },
  { value: 44, text: '合成制单' },
  { value: 39, text: '销售总监' },
  { value: 38, text: '大区经理' },
  { value: 37, text: '销售经理' },
  { value: 36, text: '销售助理' },
  { value: 35, text: '销售代表' },
  { value: 34, text: '财务' },
  { value: 33, text: '人事' },
  { value: 32, text: '仓库' },
  { value: 5, text: '采购员' },
  { value: 1, text: '系统管理员' },
];
// 大区
const regions = {
  0: { value: 0, text: '' },
  1000: { value: 1000, text: '华北大区' },
  2000: { value: 2000, text: '东北大区' },
  2200: { value: 2200, text: '香港大区' },
  3100: { value: 3100, text: '总部大区' },
  3110: { value: 3110, text: '华东一区' },
  3120: { value: 3120, text: '华东二区' },
  3130: { value: 3130, text: '华东三区' },
  3210: { value: 3210, text: '加拿大国内大区' },
  3220: { value: 3220, text: '加拿大国外大区' },
  3300: { value: 3300, text: '美国大区' },
  3500: { value: 3500, text: '英国大区' },
  4000: { value: 4000, text: '华南一区' },
  4010: { value: 4010, text: '华南二区' },
  5000: { value: 5000, text: '西南大区' },
  6000: { value: 6000, text: '西北大区' },
  7000: { value: 7000, text: '华中大区' },
  8000: { value: 8000, text: '北京大区' },
  9000: { value: 9000, text: '上海大区' },
};
const regionList = [
  { value: 1000, text: '华北大区' },
  { value: 2000, text: '东北大区' },
  { value: 2200, text: '香港大区' },
  { value: 3100, text: '总部大区' },
  { value: 3110, text: '华东一区' },
  { value: 3120, text: '华东二区' },
  { value: 3130, text: '华东三区' },
  { value: 3210, text: '加拿大国内大区' },
  { value: 3220, text: '加拿大国外大区' },
  { value: 3300, text: '美国大区' },
  { value: 3500, text: '英国大区' },
  { value: 4000, text: '华南一区' },
  { value: 4010, text: '华南二区' },
  { value: 5000, text: '西南大区' },
  { value: 6000, text: '西北大区' },
  { value: 7000, text: '华中大区' },
  { value: 8000, text: '北京大区' },
  { value: 9000, text: '上海大区' },
];
// 网点
const offices = {
  100: { value: 100, text: '北京' },
  101: { value: 101, text: '广州' },
  102: { value: 102, text: '武汉' },
  103: { value: 103, text: '上海' },
  104: { value: 104, text: '天津' },
  105: { value: 105, text: '石家庄' },
  106: { value: 106, text: '扬州' },
  107: { value: 107, text: '太原' },
  108: { value: 108, text: '呼和浩特' },
  109: { value: 109, text: '沈阳' },
  110: { value: 110, text: '哈尔滨' },
  111: { value: 111, text: '长春' },
  112: { value: 112, text: '大连' },
  113: { value: 114, text: '苏州' },
  115: { value: 115, text: '无锡' },
  116: { value: 116, text: '南京' },
  117: { value: 117, text: '徐州' },
  118: { value: 118, text: '杭州' },
  119: { value: 119, text: '宁波' },
  120: { value: 120, text: '温州' },
  121: { value: 121, text: '福州' },
  122: { value: 122, text: '厦门' },
  123: { value: 123, text: '安徽' },
  124: { value: 124, text: '南昌' },
  125: { value: 125, text: '济南' },
  126: { value: 126, text: '青岛' },
  127: { value: 127, text: '南宁' },
  129: { value: 129, text: '海口' },
  131: { value: 131, text: '深圳' },
  133: { value: 133, text: '成都' },
  134: { value: 134, text: '重庆' },
  135: { value: 135, text: '贵阳' },
  136: { value: 136, text: '昆明' },
  137: { value: 137, text: '西安' },
  138: { value: 138, text: '兰州' },
  141: { value: 141, text: '乌鲁木齐' },
  142: { value: 142, text: '郑州' },
  143: { value: 143, text: '长沙' },
  144: { value: 144, text: '青海' },
  201: { value: 201, text: '加拿大国内' },
  299: { value: 299, text: '加拿大海外' },
  301: { value: 301, text: '美国' },
  401: { value: 401, text: '香港' },
  501: { value: 501, text: '英国' },
  998: { value: 998, text: '总部-国际' },
  999: { value: 999, text: '总部-国内' },
};
const officesList = [
  { value: 100, text: '北京' },
  { value: 101, text: '广州' },
  { value: 102, text: '武汉' },
  { value: 103, text: '上海' },
  { value: 104, text: '天津' },
  { value: 105, text: '石家庄' },
  { value: 106, text: '扬州' },
  { value: 107, text: '太原' },
  { value: 108, text: '呼和浩特' },
  { value: 109, text: '沈阳' },
  { value: 110, text: '哈尔滨' },
  { value: 111, text: '长春' },
  { value: 112, text: '大连' },
  { value: 114, text: '苏州' },
  { value: 115, text: '无锡' },
  { value: 116, text: '南京' },
  { value: 117, text: '徐州' },
  { value: 118, text: '杭州' },
  { value: 119, text: '宁波' },
  { value: 120, text: '温州' },
  { value: 121, text: '福州' },
  { value: 122, text: '厦门' },
  { value: 123, text: '安徽' },
  { value: 124, text: '南昌' },
  { value: 125, text: '济南' },
  { value: 126, text: '青岛' },
  { value: 127, text: '南宁' },
  { value: 129, text: '海口' },
  { value: 131, text: '深圳' },
  { value: 133, text: '成都' },
  { value: 134, text: '重庆' },
  { value: 135, text: '贵阳' },
  { value: 136, text: '昆明' },
  { value: 137, text: '西安' },
  { value: 138, text: '兰州' },
  { value: 141, text: '乌鲁木齐' },
  { value: 142, text: '郑州' },
  { value: 143, text: '长沙' },
  { value: 144, text: '青海' },
  { value: 201, text: '加拿大国内' },
  { value: 299, text: '加拿大海外' },
  { value: 301, text: '美国' },
  { value: 401, text: '香港' },
  { value: 501, text: '英国' },
  { value: 998, text: '总部-国际' },
  { value: 999, text: '总部-国内' },
];
// 测序点
const cxPointId = {
  0: { value: 0, text: '' },
  1: { value: 1, text: '上海测序点x' },
  2: { value: 2, text: '广州测序点' },
  3: { value: 3, text: '北京测序点' },
  4: { value: 4, text: '武汉测序点' },
  5: { value: 5, text: '成都测序点' },
  6: { value: 6, text: '昆明测序点' },
  7: { value: 7, text: '长春测序点' },
  8: { value: 8, text: '青岛测序点' },
  9: { value: 9, text: '西安测序点' },
  10: { value: 10, text: '郑州测序点' },
  11: { value: 11, text: '南京测序点' },
};
// 仓库
const storageCode = {
  1002: { value: 1002, text: '北京测序' },
  2100: { value: 2100, text: '上海仓' },
  2801: { value: 2801, text: '成都合成' },
};
// 状态
const isdel = {
  0: {
    value: 'default',
    text: '正常',
  },
  1: {
    value: 'processing',
    text: '作废',
  },
};
const isdelList = [
  { value: 0, text: '正常' },
  { value: 1, text: '作废' },
];

/**
 * 页面顶部筛选表单
 */
@Form.create()
class Searchs extends Component {
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
            <FormItem label="姓名">
              {getFieldDecorator('name')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="角色">
              {getFieldDecorator('roleID')(
                <Select placeholder="请选择">
                  <Option value="0">全部</Option>
                  {roleList.map(item => <Option key={item.value} value={item.value}>{item.text}</Option>)}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="大区">
              {getFieldDecorator('regionCode')(
                <Select placeholder="请选择">
                  <Option value="">全部</Option>
                  {regionList.map(item => <Option key={item.value} value={item.value}>{item.text}</Option>)}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="网点">
              {getFieldDecorator('officeCode')(
                <Select placeholder="请选择">
                  <Option value="">全部</Option>
                  {officesList.map(item => <Option key={item.value} value={item.value}>{item.text}</Option>)}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="员工">
              {getFieldDecorator('employeeCode')(
                <Search placeholder="请选择" onSearch={this.employeeListOpen} />,
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="状态">
              {getFieldDecorator('isdel')(
                <Select placeholder="请选择">
                  <Option value="">全部</Option>
                  {isdelList.map(item => <Option key={item.value} value={item.value}>{item.text}</Option>)}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="登陆时间">
              {getFieldDecorator('wanchengshijian')(
                <RangePicker onChange={this.onChange} />,
              )}
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
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules,
              initialValue: record[dataIndex],
            })(inputType)}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };


  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
  }
}

/**
 * 页面根组件
 */
@Form.create()
class User extends Component {
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
    // visible: false,
    createDateBegin: '',
    createDateEnd: '',
  }

  columns = [
    {
      title: '员工',
      dataIndex: 'employeeCode',
      width: 100,
      editable: true,
      inputType: <Input />,
      rules: [
        { required: true, message: '必填' },
      ],
    },
    {
      title: '编号',
      dataIndex: 'loginCode',
      width: 180,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 200,
    },
    {
      title: '角色',
      dataIndex: 'roleID',
      width: 200,
      render(val) {
        if (val === undefined) {
          return <span></span>;
        }
        if (val === 0) {
          return <span>0</span>;
        }
        return <span>{roles[val].text}</span>;
      },
    },
    {
      title: '大区',
      dataIndex: 'regionCode',
      width: 200,
      render(val) {
        if (val === undefined || val === '') {
          return <span></span>;
        }
        return <span>{val} - {regions[val].text}</span>;
      },
    },
    {
      title: '网点',
      dataIndex: 'officeCode',
      width: 200,
      render(val) {
        if (val === undefined || val === '') {
          return <span></span>;
        }
        return <span>{val} - {offices[val].text}</span>;
      },
    },
    {
      title: '客户',
      dataIndex: 'customerCode',
      width: 200,
    },
    {
      title: '测序点',
      dataIndex: 'cxPointId',
      width: 220,
      render(val) {
        if (val === undefined || val === 0) {
          return <span></span>;
        }
        return <span>{cxPointId[val].text}</span>;
      },
    },
    {
      title: '仓库',
      dataIndex: 'storageCode',
      width: 100,
      render(val) {
        if (val === undefined || val === '') {
          return <span></span>;
        }
        return <span>{val} - {storageCode[val].text}</span>;
      },
    },
    {
      title: '状态',
      dataIndex: 'isdel',
      width: 100,
      render(val) {
        if (val === undefined) {
          return <span></span>;
        }
        return <span>{isdel[val].text}</span>;
      },
    },
    {
      title: '登录时间',
      dataIndex: 'loginDate',
      width: 300,
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
      width: 300,
    },
    {
      title: 'ID',
      dataIndex: 'code',
      width: 100,
    },
    {
      fixed: 'right',
      title: '操作',
      width: 120,
      render: (value, row, index) => {
        // const { status } = row;
        const { editIndex } = this.state;
        let actions;
        if (editIndex !== index) {
          actions = (
            <>
              {/* <a>删除</a>
              <Divider type="vertical" /> */}
              <a>修改</a>
            </>
          );
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

  componentDidMount() {
    //
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
  }

  // 获取表格数据
  getTableData = (options = {}) => {
    const { formValues } = this.state;
    const query = Object.assign({}, formValues, options);

    this.setState({
      formValues: query,
      loading: true,
    });

    api.user.getUserList(query, true).then(res => {
      this.setState({
        list: res.rows,
        total: res.total,
        loading: false,
        editIndex: -1,
      });
    });
  }

  // 取消编辑
  cancel = () => {
    this.setState({ editIndex: -1 });
  };

  // 删除
  deleteRow = row => {
    console.log(row);
    // api.series.cancelSeries(row.id).then(() => {
    //   this.getTableData();
    // });
  };

  // 保存
  saveRow = index => {
    console.log(index);
    // this.props.form.validateFields((error, row) => {
    //   if (error) return;
    //   const { list } = this.state;
    //   const newData = { ...list[index], ...row };
    //   if (newData.id > 0) {
    //     api.series.updateSeries(newData).then(() => this.getTableData());
    //   } else {
    //     api.series.addSeries(newData).then(() => this.getTableData());
    //   }
    // });
  }

  // 开启编辑
  editRow = index => {
    this.setState({
      editIndex: index,
    });
  }

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

  // 日期选择框改变
  onChange = (date, dateString) => {
    console.log(123);
    console.log(dateString);
    // this.setState({
    //   createDateBegin: dateStrings[0],
    //   createDateEnd: dateStrings[1],
    // });
    // console.log(this.createDateBegin);
    // console.log(this.DividercreateDateEnd);
  }

  // onOk = value => {
  //   console.log('onOk: ', value);
  // }


  // 员工列表弹窗
  employeeListOpen = () => {
    console.log('role');
  }

  render() {
    const {
      formValues: { page: current, rows: pageSize },
      selectedRows,
      list,
      total,
      loading,
      // visible,
      createDateBegin,
      createDateEnd,
    } = this.state;
    const data = { list, pagination: { current, pageSize, total } };

    const components = {
      body: {
        cell: EditableCell,
      },
    };

    const columns = this.columns.map(col => {
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
            <Searchs getTableData={this.getTableData} />
            <div className="tableListOperator">
              <Button icon="plus" type="primary" onClick={() => this.handleAdd()}>
                新建
              </Button>
            </div>
            <EditableContext.Provider value={this.props.form}>
              <StandardTable
                scroll={{ x: 2000 }}
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

export default Form.create()(User);

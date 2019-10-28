import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Popconfirm,
  Upload,
  Message,
  Icon,
  Table,
} from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import api from '@/api';
// import { formatter } from '@/utils/utils';

const EditableContext = React.createContext();
const FormItem = Form.Item;
const { Option } = Select;

/**
 * 页面顶部筛选表单
 */
@connect(({ personel }) => ({
  year: personel.year,
  month: personel.month,
}))
@Form.create()
class Search extends Component {
  
  componentDidMount() {
    this.submit();
  }

  // 查询
  submit = e => {
    if (e) e.preventDefault();
    const val = this.props.form.getFieldsValue();
    this.props.getTableData({ page: 1,...val});
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
            <FormItem label="员工编号">
              {getFieldDecorator('code')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="员工名称">
              {getFieldDecorator('staffName')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            
            <FormItem label="年">
              {getFieldDecorator('year')(
                <Select allowClear={true}>
                  {this.props.year.map(e =>
                    <Option value={e.id} key={e.id}>{e.name}</Option>,
                  )}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="月">
              {getFieldDecorator('month')(
                <Select allowClear={true}>
                  {this.props.month.map(e =>
                    <Option value={e.id} key={e.id}>{e.name}</Option>,
                  )}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="状态">
              {getFieldDecorator('status', { initialValue: '2' })(
                <Select allowClear={true}>
                  <Option value="1">正常</Option>
                  <Option value="2">已删除</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <span className="submitButtons">
              <Button type="primary" htmlType="submit" >
                查询
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
@connect(({ personel }) => ({
  year: personel.year, //年
  month: personel.month, //月
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
    dataSons: [],
  }
  // state = {
  //   pagination: {
  //     current: 1,
  //     pageSize: 10,
  //     total: 0,
  //   },
  //   list: [],
  //   loading: false,
  //   selectedRows: [],
  //   editIndex: -1,
  // }

  // 工资管理
  columns = [
    {
      title: '员工编号',
      dataIndex: 'employeeCode',
      width: 100,

    },
    {
      title: '员工名称',
      dataIndex: 'employeeName',
      // dataIndex: 'name',
      width: 180,
    },
    {
      title: '总额',
      dataIndex: 'amount',
      width: 100,
    },
    {
      title: '时间',
      dataIndex: 'year',
      width: 100,
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
      dataIndex: 'createName',
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
      fixed: 'right',
      title: '操作',
      width: 120,
      render: (value, row, index) => {
        const { status } = row;
        const { editIndex } = this.state;
        let actions;
        if (editIndex !== index) {
          actions = (
            <>
              <Popconfirm title="确定作废数据？" onConfirm={() => this.deleteRow(row)}>
                <a>删除</a>
              </Popconfirm>
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

  // 工资明细
  columnSon= [
    {
      title: '编号',
      dataIndex: 'typeCode',
      width: 100,
    },
    {
      title: '名称',
      dataIndex: 'typeName',
      width: 100,
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 100,
    },
    {
      title: '金额',
      dataIndex: 'amount',
      width: 100,
    }
  ];

  // componentDidMount() {
  //   api.series.getSeries().then(res => {
  //     this.setState({
  //       modificationType: res,
  //     })
  //   })
  // }

  // 点击获取子值
  dataSon = (v, e) => {
    if (e.target.className === 'operate' || e.target.className.indexOf('ant-btn-sm') !== -1 || v.id < 1) {
      return
    }
    this.setState({
      loadingSon: true,
    });
    api.pay.getPays(v.id, true).then(res => {
      this.setState({
        dataSons: res,
        loadingSon: false,
        editIndex: -1,
        parantData: v,
        selectParantData: true,
      });
    });
    
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
    
    api.pay.getPay(query).then(res => {
      this.setState({
        list: res.rows,
        total: res.total,
        loading: false,
        editIndex: -1,
      });
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

  // 删除数据
  deleteRow = row => {
  //  console.log(1);
   api.peptideBase.deleteModificationTypes(row.id).then(() => {
    this.getTableData();
    });
  };
  
  // 保存
  saveRow = index => {
    this.props.form.validateFields((error, row) => {
      if (error) return;
      const { list } = this.state;
      const newData = { ...list[index], ...row };
      if (newData.id > 0) {
        // api.peptideBase.updateSeries(newData).then(() => this.getTableData());
      } else {
        api.peptideBase.insertPurity(newData).then(() => this.getTableData());
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

  // states = {
  //   fileList: [],//存放上传信息：比如路径、文件名
  //   imgList: [],//存放回显信息：修改时的路径、文件名

  // };
  //form表单提交事件
  // handleSubmit = e => {
  //   const { dispatch, form } = this.props;
  //   e.preventDefault();
  //   form.validateFieldsAndScroll((err, values) => {
  //       if (!err) {
  //           const { imgList } = this.state
  //           values.imgList = JSON.stringify(imgList);
  //           console.log('values', values);
  //       }
  //   });
  // };
  //上传事件
  // onChange = ({ fileList }) => {
  //   console.log('file', fileList);
  //   let imgList = [];
  //   fileList.map(function (item, key) {
  //     if (item.response && item.response.success) {
  //       console.log('item.response',item.response);
  //       imgList.push({ url: item.response.url, Name: item.response.name });//这的参数具体看上传成功后返回的值，打印的item.response
  //     } else {
  //         //回显
  //         if (item.url) {
  //             //拼接'http:// 如果路径可以直接使用不需要拼接
  //             imgList.push({ url: item.url.replace('http://', ""), Name: item.name });
  //         }
  //       }
  //   });
  //   this.setState({ fileList, imgList });
  // }
  // 上传文件
  handleChange = info => {
    let fileList = [...info.fileList];

    // 1. Limit the number of uploaded files限制上传文件的数量
    // Only to show two recent uploaded files, and old ones will be replaced by the new只显示最近上传的两个文件，旧的将被新的取代
    fileList = fileList.slice(-2);

    // 2. Read from response and show file link读取响应并显示文件链接
    fileList = fileList.map(file => {
      if (file.response) {
        // Component will show file.url as link组件将显示文件。url链接
        file.url = file.response.url;
      }
      return file;
    });

    this.setState({ fileList });
  };
  render() {
    const {
      formValues: { page: current, rows: pageSize },
      selectedRows,
      list,
      total,
      loading,
      dataSons,
      loadingSon,
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


    const columnSon = this.columnSon.map(col => {
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

    // 子列表分页设置
    const paginationProps = {
      total: list.length,
      showSizeChanger: true,
      showQuickJumper: true,
    };
    
    // const { fileList } = this.state
    const props = {
      name: 'filename',//name得看接口需求，name与接口需要的name一致
      action: 'https://devapi.sangon.com:8443/api/pay/v1/date/excel',//接口路径
      onChange: this.handleChange,
      data: {  },//接口需要的参数，无参数可以不写
      multiple: true,//支持多个文件
      // showUploadList: true,//展示文件列表
    }
    
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className="tableList">
            <Search getTableData={this.getTableData} />
            <div className="tableListOperator">
              {/* <Button icon="plus" type="primary" onClick={() => this.handleAdd()}>
                新建
              </Button> */}
              {/* <Upload>
                <Button type="primary" icon="upload" style={{ marginLeft: 8 }}  {...props} fileList={fileList} onChange={this.onChange}>
                  上传
                </Button>
              </Upload> */}
              <Upload {...props} fileList={this.state.fileList}  style={{ marginLeft: 8 }}>
                <Button type="primary" icon="upload" >
                  上传
                </Button>
              </Upload>
            </div>
            <Col span={14}>
              <EditableContext.Provider value={this.props.form}>
                <StandardTable
                  scroll={{ x: 1500 }}
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
              <p>工资明细</p>
              <EditableContext.Provider value={this.props.form}>
                <Table
                  scroll={{ x: 300 }}
                  components={components}
                  loading={loading}
                  dataSource={dataSons}
                  rowKey="id"
                  // rowKey={record => record.id}
                  // rowKey={row=>row.id}
                  columns={columnSon}
                  pagination={paginationProps}
                />
                </EditableContext.Provider>
            </Col>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default Modifications;


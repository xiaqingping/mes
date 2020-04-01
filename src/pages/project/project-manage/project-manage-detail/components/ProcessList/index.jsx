// 流程列表
import { Form, Table, Tag, Progress, Divider } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import { SlidersOutlined } from '@ant-design/icons';
import  DrawerTool  from '../AntdUI'

// import StandardTable from '@/components/StandardTable';
// import EditableCell from '@/components/EditableCell';
// import { formatter } from '@/utils/utils';
// import api from '@/api';
import './index.less';

class ProcessList extends Component {
  tableSearchFormRef = React.createRef();

  tableFormRef = React.createRef();

  state = {
    // 分页参数
    // pagination: {},
    // 表格数据
    list: [],
    // 加载状态
    loading: true,
    // 选中行数据
    // selectedRows: [],
    // 编辑行
    // editIndex: -1,
    // 自减ID（新增数据时，提供负数id做为列表的key）
    // id: 0,

    // 任务列表抽屉
    visible: false,
    detailValue: [],
  };

  // 顶部表单默认值
  initialValues = {
    // status: 1,
    page: 1,
    rows: 10,
  };

  // 组件挂载时
  componentDidMount() {
    this.getCacheData();
    this.getTableData(this.initialValues);
  }

  // 获取此页面需要用到的基础数据
  getCacheData = () => {};

  // 分页
  handleStandardTableChange = data => {
    this.getTableData({
      page: data.current,
      rows: data.pageSize,
    });
  };

  // 选择行
  // handleSelectRows = rows => {
  //   this.setState({
  //     selectedRows: rows,
  //   });
  // };

  // 查看任务列表及执行记录
  searchTaskList = row => {
    this.setState({
      visible: true,
      detailValue: row,
    });
  }

  // 关闭任务列表抽屉
  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  // 获取表格数据
  // getTableData = (options = {}) => {
  getTableData = () => {
    // this.setState({ loading: true });

    // const { pagination } = this.state;
    // const { current: page, pageSize: rows } = pagination;
    // const data = {
    //   page,
    //   rows,
    //   ...options,
    // };

    // api.dataauth.getSources(data, true).then(res => {
    //   this.setState({
    //     list: res.rows,
    //     pagination: {
    //       current: data.page,
    //       pageSize: data.rows,
    //       total: res.total,
    //     },
    //     loading: false,
    //     // editIndex: -1,
    //   });
    // });
    const data = this.props.projectDetail.processList;
    this.setState({
        list: data,
        // pagination: {
        //   current: options.page,
        //   pageSize: options.rows,
        //   total: data.total,
        // },
        loading: false,
        // editIndex: -1,
      });
  };

  render() {
    const {
      // pagination, selectedRows,
    list, loading,
    visible, detailValue
    } = this.state;
    let tableWidth = 0;

    // const components = {
    //   body: {
    //     cell: EditableCell,
    //   },
    // };

    let columns = [
      {
        title: '名称',
        dataIndex: 'name',
        width: 150,
        render: (text, row) => (
          <a onClick={() => this.searchTaskList(row)}>{text}</a>
        )
      },
      {
        title: '描述',
        dataIndex: 'decs',
        width: 350,
      },
      {
        title: '版本',
        dataIndex: 'version',
        width: 100,
        render: text => <Tag color="green">{text}</Tag>
      },
      {
        title: '进度',
        dataIndex: 'schedule',
        width: 150,
        render: text => {
          if (text === '0') return <a>运行</a>
          if (text === '0' && text === '100') return <Progress percent={text} size="small" />
          return <Progress percent={text} size="small"/>
        }
      },
      {
        title: '流程模型',
        dataIndex: 'processList',
        width: 250,
        render: text => (
          <div style={{display:"flex"}}>
            <img
              src={text.path}
              alt=""
              height='50'
              width="50"
              style={{borderRadius: '100%' }}
            />
            <div style={{marginLeft:10}}>
              <p>{text.name} <br/> {text.code} </p>
            </div>

          </div>
        )
      },
      {
        title: '参数',
        dataIndex: 'type',
        width: 100,
        render: () => <SlidersOutlined />,
      },
      {
        title: '操作',
        width: 150,
        render: () => (
          <>
            <a onClick={() => console.log(111)}>删除</a>
            <Divider type="vertical" />
            <a onClick={() => console.log(222)}>修改</a>
            <Divider type="vertical" />
            <a onClick={() => console.log(333)}>交互分析</a>
          </>
        ),
      },
    ];

    columns = columns.map(col => {
      // if (!col.width) col.width = 100;
      tableWidth += col.width;
      if (!col.editable) {
        return col;
      }
      console.log(tableWidth)
      return true;
    });

    return (
      <>
        <Form ref={this.tableFormRef}>
          <Table
            scroll={{ x: tableWidth, y: 400 }}
            rowKey="id"
            loading={loading}
            dataSource={list}
            // pagination={pagination}
            columns={columns}
            onChange={this.handleStandardTableChange}
          />
        </Form>
        <DrawerTool
          visible={visible}
          onClose={this.onClose}
          detailValue={detailValue}
        />
      </>
    );
  }
}

export default connect(({ projectDetail }) => ({
  projectDetail,
}))(ProcessList);

// 流程列表
import { Form, Table, Select } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
// import router from 'umi/router';
import api from '@/pages/project/api/projectManageDetail';
import { EditJurisdictionModel } from '../ModelUI';

// import { formatter } from '@/utils/utils';

const { Option } = Select;

class MemberList extends Component {
  tableSearchFormRef = React.createRef();

  tableFormRef = React.createRef();

  state = {
    // 分页参数
    pagination: {},
    // 表格数据
    list: [],
    // 加载状态
    loading: true,
    visibleModel: false,
    menberInfor: [],
    // 选中行数据
    // selectedRows: [],
    // 编辑行
    // editIndex: -1,
    // 自减ID（新增数据时，提供负数id做为列表的key）
    // id: 0,
  };

  // 组件挂载时
  componentDidMount() {
    const { projectId } = this.props;
    this.getCacheData();
    this.getTableData(projectId);
  }

  // 获取此页面需要用到的基础数据
  getCacheData = () => {};

  // 获取表格数据
  getTableData = projectId => {
    this.setState({ loading: true });
    const data = { projectId }
    api.getProjectMember(data).then(res => {
      this.setState({
        list: res,
        loading: false,
      });
    })

  };

  // 修改成员权限
  handleUpdateJurisdiction = (value, row) => {
    let jurisdictionName = '';
    if (value === 1) jurisdictionName = '所有者';
    if (value === 2) jurisdictionName = '管理者';
    if (value === 3) jurisdictionName = '参与者';

    const data = {
      id: row.id,
      name: row.creatorName,
      jurisdictionName,
      jurisdictionValue: value,
    }
    this.setState({
      visibleModel: true,
      menberInfor: data,
    });
  }

  // 确认修改权限
  getEditModelData = data => {
    if(data.type === 'ok') {
      api.updateMemberJurisdiction(data).then(() => {
        this.getTableData(this.props.projectId);
      })
    }
  }

  // 关闭编辑模态框
  onCloseModel = () => {
    this.setState({
      visibleModel: false,
    });
  };

   // 退出
  handleExit = row => {
    console.log(row);
    api.deleteMember(row.id).then(() => {
      this.getTableData(this.props.projectId);
    })
  }

  render() {
    const {
      pagination,
      // selectedRows,
      list, loading, visibleModel, menberInfor
    } = this.state;
    const { jurisdiction } = this.props.projectDetail;
    let tableWidth = 0;

    // const components = {
    //   body: {
    //     cell: EditableCell,
    //   },
    // };

    let columns = [
      {
        title: '用户名',
        dataIndex: 'creatorName',
        width: 200,
        render: value => (
          <div style={{display:"flex"}}>
            <img
              // src={row.path}
              src='/favicon.png'
              alt=""
              height='50'
              width="50"
              style={{borderRadius: '100%' }}
            />
            <div style={{marginLeft:10, marginTop: 6}}>
              <p>{value}</p>
            </div>

          </div>
        )
      },
      {
        title: '加入时间',
        dataIndex: 'createDate',
        width: 150,
      },
      {
        title: '权限',
        dataIndex: 'jurisdictionValue',
        width: 150,
        render: (value, row) => (
            <Select
              style={{ width: 100 }}
              disabled={value === 1}
              defaultValue={value}
              bordered={false}
              onChange={() => this.handleUpdateJurisdiction(value, row)}
            >
              {jurisdiction.map(e => (
                <Option value={e.id} key={e.name}>
                  {e.name}
                </Option>
              ))}
            </Select>
          )
      },
      {
        title: '操作',
        dataIndex: 'jurisdictionValue',
        width: 150,
        render: (value, row) => {
          if (value === 1) return '';
          return <a onClick={() => this.handleExit(row)}>退出</a>;
        }
      },
    ];

    columns = columns.map(col => {
      // if (!col.width) col.width = 100;
      tableWidth += col.width;
      if (!col.editable) {
        return col;
      }
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
            // selectedRows={selectedRows}
            pagination={pagination}
            columns={columns}
            onChange={this.handleStandardTableChange}
          />
        </Form>
        <EditJurisdictionModel
          visible={visibleModel}
          onClose={this.onCloseModel}
          data={menberInfor}
          getData={this.getEditModelData}
        />
      </>
    );
  }
}

export default connect(({ projectDetail }) => ({
  projectDetail,
}))(MemberList);

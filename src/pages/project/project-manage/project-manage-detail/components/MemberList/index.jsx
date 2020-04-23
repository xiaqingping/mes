// 流程列表
import { Form, Table, Select, message } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import api from '@/pages/project/api/projectManageDetail';
import { EditJurisdictionModel } from '../ModelUI';


const { Option } = Select;

class MemberList extends Component {
  tableSearchFormRef = React.createRef();

  tableFormRef = React.createRef();

  state = {
    list: [],             // 表格数据
    loading: true,        // 加载状态
    visibleModel: false,  // 编辑名称描述模态框是否显示
    menberInfor: [],      // 成员名称描述
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
      try {
        api.updateMemberJurisdiction(data).then(() => {
          this.getTableData(this.props.projectId);
        })
      } catch (e) {
        this.getTableData(this.props.projectId);
        return message.error(e.message);
      }
    }
    return false;
  }

  // 关闭编辑模态框
  onCloseModel = () => {
    this.setState({
      visibleModel: false,
    });
  };

   // 退出
  handleExit = row => {
    api.deleteMember(row.id).then(() => {
      this.getTableData(this.props.projectId);
    })
  }

  render() {
    const { list, loading, visibleModel, menberInfor } = this.state;
    const { jurisdiction } = this.props.projectDetail;
    let tableWidth = 0;

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
        // eslint-disable-next-line arrow-body-style
        render: (value, row) => {
          // console.log(value);
          // console.log(row);
          // const userData = JSON.parse(localStorage.user);
          // console.log(userData);
          // if (value === 1) {

          // }
          return (
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
        }
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

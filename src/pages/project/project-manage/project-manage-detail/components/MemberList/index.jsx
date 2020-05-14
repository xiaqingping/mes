/** 成员列表 渲染Table页面 */
import { Form, Table, Select, message } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import api from '@/pages/project/api/projectManageDetail';
import { EditJurisdictionModel } from '../ModelUI';

const { Option } = Select;

class MemberList extends Component {
  tableFormRef = React.createRef();

  state = {
    list: [], // 表格数据
    loading: true, // 加载状态
    visibleModel: false, // 编辑名称描述模态框是否显示
    menberInfor: [], // 成员名称描述
  };

  /** 组件挂载时 */
  componentDidMount() {
    const { projectId } = this.props;
    this.getCacheData();
    this.getTableData(projectId);
  }

  /** 获取此页面需要用到的基础数据 */
  getCacheData = () => {};

  /**
   * 获取表格数据
   * @param {String} projectId  项目ID
   */
  getTableData = projectId => {
    this.setState({ loading: true });
    const data = { projectId };
    api
      .getProjectMember(data)
      .then(res => {
        this.setState({
          list: res,
        });
      })
      .catch();
    this.setState({ loading: false });
  };

  /**
   * 修改成员权限
   * @param {Number} value  权限值
   * @param {Object} row  行数据
   */
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
    };
    this.setState({
      visibleModel: true,
      menberInfor: data,
    });
  };

  /**
   * 确认修改权限
   * @param {Object} data  修改数据
   */
  getEditModelData = data => {
    if (data.type === 'ok') {
      api
        .updateMemberJurisdiction(data)
        .then(() => {
          this.getTableData(this.props.projectId);
        })
        .catch(e => {
          this.getTableData(this.props.projectId);
          return message.error(e.message);
        });
    }
    return false;
  };

  /** 关闭编辑模态框 */
  onCloseModel = () => {
    this.setState({
      visibleModel: false,
    });
  };

  /** 退出 */
  handleExit = row => {
    api.deleteMember(row.id).then(() => {
      this.getTableData(this.props.projectId);
    });
  };

  render() {
    const { list, loading, visibleModel, menberInfor } = this.state;
    const { jurisdiction } = this.props.projectDetail;

    let columns = [
      {
        title: '用户名',
        dataIndex: 'name',
        width: 150,
        render: value => (
          <div style={{ display: 'flex' }}>
            <img
              src="/favicon.png"
              alt=""
              height="50"
              width="50"
              style={{ borderRadius: '100%' }}
            />
            <div style={{ marginLeft: 10, marginTop: 6 }}>
              <p>{value}</p>
            </div>
          </div>
        ),
      },
      {
        title: '加入时间',
        dataIndex: 'createDate',
        width: 180,
      },
      {
        title: '权限',
        dataIndex: 'jurisdictionValue',
        width: 180,
        render: (value, row) => {
          const userData = JSON.parse(localStorage.user);
          let disabledIs = true;
          if (value === 1) {
            if (userData.code === row.code) disabledIs = false;
          }
          return (
            <Select
              style={{ width: 100 }}
              disabled={disabledIs}
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
          );
        },
      },
      {
        title: '操作',
        dataIndex: 'jurisdictionValue',
        width: 150,
        render: (value, row) => {
          if (value === 1) return '';
          return <a onClick={() => this.handleExit(row)}>退出</a>;
        },
      },
    ];

    columns = columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return true;
    });

    return (
      <>
        <Form ref={this.tableFormRef}>
          <Table
            rowKey="id"
            loading={loading}
            dataSource={list}
            columns={columns}
            onChange={this.handleStandardTableChange}
            pagination={false}
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

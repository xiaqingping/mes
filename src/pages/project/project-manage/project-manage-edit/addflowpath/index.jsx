// 项目管理：新建项目：添加流程
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Form, Tag, Button, Avatar, Table, message, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import router from 'umi/router';
import { connect } from 'dva';
import api from '@/pages/project/api/projectManage';
import disk from '@/pages/project/api/disk';
import DefaultHeadPicture from '@/assets/imgs/defaultheadpicture.jpg';
import ChooseProcessModel from '../components/ChooseProcessModel';
// import ParamPic from '@/assets/imgs/canshu@1x.png';

class Test extends Component {
  // 表单默认值
  // initialValues = {
  //   status: 1,
  //   page: 1,
  //   pageSize: 5,
  // };

  constructor(props) {
    super(props);
    const {
      // processSelectedList,
      paramList,
      projectInfor,
    } = this.props.projectManage;
    console.log(this.props);

    let viewShow;
    if (projectInfor.requestType === 'add') viewShow = [];

    // 已创建的项目传过来的项目id和类型
    if (!this.props.location.state) {
      // const projectProcesses = this.props.location.state.newData;
      // console.log(projectProcesses);
      console.log(123);
    }

    // // if (projectProcesses.requestType === 'add') viewShow = [];
    // viewShow = processSelectedList;

    this.state = {
      // list选中的流程参数数据
      list: viewShow,
      loading: false,
      visible: false,
      projectInfor,
      paramList,
    };
    console.log(this.state);
  }

  componentDidMount() {
    this.getData();
    // 传过来的项目id和类型

    // if(this.props.location.state === []) {
    //   return
    //   // console.log(123);
    // }
    // const projectProcesses = this.props.location.state.newData;
    // console.log(projectProcesses);
    // this.setState({ projectProcesses },() => {
    //   // console.log(this.state);
    // });
    console.log(this.state);
  }

  // componentWillUnmount() {
  //   this.props.dispatch({
  //     type: 'projectManage/setProcessSelectedList',
  //     payload: [],
  //   });
  // }

  // 点击打开关联
  onOpen = () => {
    this.setState({
      visible: true,
    });
  };

  // 点击关闭关联
  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  // 删除数据
  deleteRow = value => {
    const tableData = this.state.list;
    const newData = tableData.filter(item => item.id !== value.id);
    this.setState({
      list: newData,
    });
    this.props.dispatch({
      type: 'projectManage/setProcessSelectedList',
      payload: newData,
    });
  };

  // 打开参数
  handleOpen = row => {
    const { paramList } = this.props.projectManage;

    let data = {};
    if (paramList.length === 0 && paramList.processModelId === undefined) {
      // 添加 参数值
      data = {
        requestType: 'addParam',
        processModelId: row.id,
      };
    } else {
      // 修改 参数值
      data = {
        requestType: 'updateParam',
        processModelId: row.id,
        params: paramList.params,
      };
    }

    this.props.dispatch({
      type: 'projectDetail/setUserForParam',
      payload: data,
    });
    router.push('/project/project-manage/process-parameter');
  };

  // 获取模态框选中的流程模型数据
  getData = value => {
    if (!(value === '' || value === undefined)) {
      this.setState({
        list: value,
      });
      this.props.dispatch({
        type: 'projectManage/setProcessSelectedList',
        payload: value,
      });
    }
  };

  // 保存
  handleSave = () => {
    // const { projectProcesses} = this.state;
    // console.log(projectProcesses);
    const {
      list,
      projectInfor,
      paramList,
      // projectProcesses
    } = this.state;
    let status = false;
    if (list === '' || list === undefined) {
      status = true;
    }
    if (projectInfor === '' || projectInfor === undefined) {
      status = true;
    }
    if (paramList === '' || paramList === undefined) {
      status = true;
    }
    if (status) return message.error('数据为空');

    // 设置好的参数追加在流程列表数据中
    const newList = [];
    list.forEach(item => {
      let newItem = {};
      newItem = {
        describe: item.describe,
        name: item.name,
        processModelId: item.id,
      };
      if (item.id === paramList.processId) {
        newItem.processesParamList = paramList.params;
      }
      newList.push(newItem);
    });
    console.log(newList);

    projectInfor.processList = newList;
    const data = projectInfor;

    api.addProjects(data).then(() => router.push('/project/project-manage'));

    // if (projectProcesses.requestType === 'add') {
    //   // api.addProjectsProcess({projectProcesses,data}).then(res => {
    //   //   console.log(res);
    //   // });
    // }
    return '';
  };

  render() {
    const { list, loading, visible } = this.state;
    const columns = [
      {
        title: '名称/描述',
        dataIndex: 'name',
        width: 900,
        render: (value, row) => (
          <>
            <div>{value}</div>
            <div>{row.describe}</div>
          </>
        ),
      },
      {
        title: '流程模型',
        dataIndex: 'name',
        width: 300,
        render: (value, row) => (
          <>
            {/* <Avatar
              src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              style={{ float: 'left' }}
              size="large"
            /> */}
            <Avatar
              src={row.fileId ? disk.downloadFiles(row.fileId, { view: true }) : DefaultHeadPicture}
              style={{ float: 'left', width: '46px', height: '46px' }}
            />
            <div style={{ float: 'left' }}>
              <div>{value}</div>
              <div>{row.code}</div>
            </div>
          </>
        ),
      },
      {
        title: '参数',
        dataIndex: 'parameter',
        width: 100,
        render: (value, row) => (
          // </div>
          <div className="task_model_add_task_icon" onClick={() => this.handleOpen(row)} />
        ),
      },
      {
        title: '版本',
        dataIndex: 'version',
        width: 130,
        render: () => (
          <Tag color="green" style={{ padding: '0 10px' }}>
            V1.0
          </Tag>
        ),
      },
      {
        title: '操作',
        width: 200,
        render: value => (
          <>
            <a onClick={() => this.deleteRow(value)}>删除</a>
            <Popconfirm
              placement="topLeft"
              title="确定要删除吗？"
              onConfirm={() => this.confirm(value)}
              okText="确定"
              cancelText="取消"
            />
          </>
        ),
      },
    ];

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className="tableList" style={{ height: '400px', overflow: 'auto' }}>
            <Form ref={this.tableFormRef}>
              <Table
                rowClassName="editable-row"
                rowKey="id"
                loading={loading}
                dataSource={list}
                columns={columns}
                pagination={false}
                onSelectRow={this.handleSelectRows}
              />
            </Form>
          </div>
          <div
            style={{
              width: '100%',
            }}
          >
            <Button
              type="dashed"
              onClick={this.onOpen}
              icon={<PlusOutlined />}
              style={{
                width: '100%',
                marginTop: 16,
                paddingBottom: 8,
              }}
            >
              选择流程模型
            </Button>
          </div>
        </Card>
        <Form onFinish={this.handleSave}>
          <Card
            style={{ height: '48px', width: '100%', position: 'fixed', bottom: '0', left: '0' }}
          >
            <Button type="primary" style={{ float: 'right', marginTop: '-16px' }} htmlType="submit">
              保存
            </Button>
          </Card>
        </Form>
        <ChooseProcessModel
          visible={visible}
          onClose={this.onClose}
          getData={v => this.getData(v)}
        />
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ global, projectDetail, projectManage }) => ({
  languageCode: global.languageCode,
  projectDetail,
  projectManage,
}))(Test);

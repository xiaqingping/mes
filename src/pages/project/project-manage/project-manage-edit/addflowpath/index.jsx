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
  constructor(props) {
    super(props);
    const { processSelectedList, paramList, projectInfor } = this.props.projectManage;
    console.log(this.props);

    let viewShow;

    this.state = {
      // list选中的流程参数数据
      list: processSelectedList,
      loading: false,
      visible: false,
      projectInfor,
      paramList,
      buttonLoading: false,
      projectProcesses: [],
    };
    console.log(this.state);

    if (this.props.location.state) {
      // 已创建的项目传过来的项目id和类型
      const projectProcesses = this.props.location.state.newData;
      console.log(projectProcesses);
      if (projectProcesses.requestType === 'add') {
        viewShow = [];
        console.log(viewShow);
        console.log('从已有项目新增页面跳转的');
        // this.setState({
        //   projectProcesses: 123,
        // },() => {
        //   console.log(this.state);
        // });
      }
    } else {
      if (projectInfor.requestType === 'add') {
        console.log('基础信息页面跳转过来的');
        viewShow = [];
      } else {
        console.log('从其他页面跳转进来的');
        viewShow = processSelectedList;
        console.log(viewShow);
      }
      console.log(123);
    }
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'projectManage/setProcessSelectedList',
      payload: [],
    });
    this.getData();
  }

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
    this.setState({
      buttonLoading: true,
    });
    const { list, projectInfor, paramList, projectProcesses } = this.state;
    // console.log(projectProcesses);
    let status = false;

    if (projectInfor.requestType === 'add') {
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
      console.log('基础信息有值的保存');
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
      console.log(list);

      projectInfor.processList = newList;
      const data = projectInfor;

      console.log(newList);
      api
        .addProjects(data)
        .then(() => {
          this.setState({
            buttonLoading: false,
          });
          // router.push('/project/project-manage');
        })
        .catch(() => {
          this.setState({
            buttonLoading: false,
          });
        });
    } else {
      if (this.props.location.state.newData) {
        const { newData } = this.props.location.state;
        const projectId = newData.id;
        console.log(projectId);
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
        const processList = newList;
        console.log(processList);
        api
          .addProjectsProcess({ projectId, processList })
          .then(res => {
            this.setState({
              buttonLoading: false,
            });
            console.log(res);
            // router.push('/project/project-manage/detail');
          })
          .catch(() => {
            this.setState({
              buttonLoading: false,
            });
          });
      }
      console.log('其他方式');
    }

    if (projectProcesses.requestType === 'add') {
      // 如果是从项目流程新增跳转的，点保存要跳转回详情页面
      const processIds = projectProcesses.id;
      console.log('判断id');
      console.log(processIds);

      // // 设置好的参数追加在流程列表数据中
      // const newList = [];
      // list.forEach(item => {
      //   let newItem = {};
      //   newItem = {
      //     describe: item.describe,
      //     name: item.name,
      //     processModelId: item.id,
      //   };
      //   if (item.id === paramList.processId) {
      //     newItem.processesParamList = paramList.params;
      //   }
      //   newList.push(newItem);
      // });
      // // console.log(newList);
      // // projectProcesses
      // let projectParam;
      // projectParam.processList = newList;
      // const data = projectParam;

      // api.addProjectsProcess({processIds,data}).then(res => {
      //   this.setState({
      //     buttonLoading: false,
      //   });
      //   console.log(res);
      //   router.push('/project/project-manage/detail');
      // }).catch(() => {
      //   this.setState({
      //     buttonLoading: false,
      //   });
      // });
    }
    return '';
  };

  render() {
    const { list, loading, visible, buttonLoading } = this.state;
    console.log(list);
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
    console.log(123);
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
            <Button
              type="primary"
              style={{ float: 'right', marginTop: '-16px' }}
              htmlType="submit"
              loading={buttonLoading}
            >
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

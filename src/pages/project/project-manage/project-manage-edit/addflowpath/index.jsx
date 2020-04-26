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
    // 传过来的已有项目的id和类型
    // TODO:
    const { type, projectId } = this.props.match.params;
    console.log(this.props.match.params);
    const { paramList, projectInfor } = this.props.projectManage;
    // const projectInfor = this.props.projectManage;

    this.state = {
      // TODO:
      processType: type, // 请求类型 edit：流程列表跳转 携带项目id  add：新建项目跳转 无id
      projectId: projectId || '', // 项目Id

      // list选中的流程参数数据
      list: [],
      loading: false,
      visible: false,
      projectInfor, // 项目基础信息
      paramList, // 流程参数
      buttonLoading: false,
      // projectId: id || '',
    };
  }

  componentDidMount() {
    const { projectInfor, paramList, processType } = this.state;
    this.getData();
    // 保存已选流程
    const introductionProcess = JSON.parse(sessionStorage.getItem('introduction'));
    console.log(introductionProcess);

    // 参数页面点击保存带回的参数
    const paramsList = JSON.parse(sessionStorage.getItem('processForParams'));
    console.log(paramsList);
    this.setState(
      {
        paramList: paramsList,
      },
      () => {
        console.log(this.state);
      },
    );

    if (introductionProcess !== null) {
      this.setState({
        list: introductionProcess,
      });
      this.props.dispatch({
        type: 'projectManage/setProcessSelectedList',
        payload: introductionProcess,
      });
    }
    if (projectInfor.requestType === 'add') {
      console.log('新建项目清空保存');
      sessionStorage.removeItem('introduction');
    }
    if (processType === 'edit') {
      console.log('已有项目页面清空保存');
      sessionStorage.removeItem('introduction');
    }
    if (paramList === null) {
      console.log('参数页面返回');
      sessionStorage.removeItem('introduction');
    }
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
    // 参数数据
    const paramList = JSON.parse(sessionStorage.getItem('processForParams'));
    console.log(paramList);

    // TODO:
    const { projectId } = this.state;

    let type;
    if (paramList === null) type = 'add';
    if (paramList !== null) type = 'update';
    const processModelId = row.id;

    let url;
    if (projectId === '') {
      url = `/project/project-manage/process-parameter/${type}/${processModelId}`;
    } else {
      url = `/project/project-manage/process-parameter/${type}/${processModelId}/${projectId}`;
    }
    router.push(url);
  };

  // 获取模态框选中的流程模型数据
  getData = value => {
    console.log(value);
    // 存储选中的流程模型数据
    if (!(value === '' || value === undefined)) {
      sessionStorage.setItem('introduction', JSON.stringify(value));

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
    const { list, projectInfor, paramList, processType, projectId } = this.state;
    console.log(this.state);
    let status = false;

    if (projectInfor.requestType === 'add') {
      console.log('新建项目跳转，基础信息有值的保存,');
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
        console.log(item.id);
        console.log(paramList);
        // if (item.id === paramList.processId) {
        //   newItem.processesParamList = paramList.params;
        // }
        newList.push(newItem);
      });
      console.log(list);

      projectInfor.processList = newList;
      const data = projectInfor;
      api
        .addProjects(data)
        .then(() => {
          this.setState({
            buttonLoading: false,
          });
          router.push('/project/project-manage');
        })
        .catch(() => {
          this.setState({
            buttonLoading: false,
          });
        });
      sessionStorage.removeItem('introduction');
    }
    if (processType === 'edit') {
      console.log('正常从已有项目跳转，');
      const newList = [];

      // 参数数据
      const paramsList = JSON.parse(sessionStorage.getItem('processForParams'));
      console.log(paramsList);

      list.forEach(item => {
        let newItem = {};
        newItem = {
          describe: item.describe,
          name: item.name,
          processModelId: item.id,
        };
        // if (item.id === paramList.processId) {
        //   newItem.processesParamList = paramList.params;
        // }
        newList.push(newItem);
      });
      console.log(list);
      const processList = newList;
      api
        .addProjectsProcess({ projectId, processList })
        .then(res => {
          this.setState({
            buttonLoading: false,
          });
          console.log(res);
          router.push(`/project/project-manage/detail/${projectId}`);
        })
        .catch(() => {
          this.setState({
            buttonLoading: false,
          });
        });
    }

    // if(paramsList) {

    // }
    sessionStorage.removeItem('introduction');
    return '';
  };

  render() {
    const { list, loading, visible, buttonLoading } = this.state;
    console.log(this.state);
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
            <Avatar
              src={
                row.picture ? disk.downloadFiles(row.picture, { view: true }) : DefaultHeadPicture
              }
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

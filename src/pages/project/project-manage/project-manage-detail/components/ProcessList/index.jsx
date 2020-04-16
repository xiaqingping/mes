// 流程列表
import { Form, Table, Tag, Divider, Button, message, Avatar } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import {
  SlidersOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  EditOutlined,
  } from '@ant-design/icons';
import router from 'umi/router';
import api from '@/pages/project/api/projectManageDetail';
import TaskList  from '../TaskList';
import { EditInforModel }  from '../ModelUI';
import ProgressMould from '../ProgressMould';
// import { formatter } from '@/utils/utils';


class ProcessList extends Component {
  tableSearchFormRef = React.createRef();

  tableFormRef = React.createRef();

  state = {
    // 表格
    list: [],         // 表格数据
    loading: false,    // 加载状态
    editIndex: -1,    // 当前编辑行icon
    visibleModel: false,    // 是否显示编辑模态框
    processList: [],    // 选中编辑行数据

    // 任务列表抽屉
    visibleDrawer: false,   // 是否显示抽屉
    detailList: [],   // 项目信息
    taskList: [],     // 任务列表信息
  };

  // 组件挂载时
  componentDidMount() {
    const { projectId } = this.props;
    this.getTableData(projectId);
  }

  // 获取表格数据
  getTableData = projectId => {
    this.setState({ loading: true });
    api.getProjectProcess(projectId).then(res => {
      this.setState({
        list: res.processList,
        loading: false,
      });
    });
  };

  // 查看任务列表及执行记录
  searchTaskList = row => {
    const data = { processId: row.id };
    api.getProjectTask(data).then(res => {
      this.setState({
        visibleDrawer: true,
        detailList: row,
        taskList: res,
      });
    });
  };

   // 查看流程参数
  searchProcessParam = processesData => {
    // console.log(processesData); // 流程数据
    // console.log(projectData);   // 项目数据
    const data = {
      processId: processesData.id,                    // 流程ID
      processModelId: processesData.processModelId,   // 流程模型ID
      requestType: 'editParam',                       // 请求类型
    };

    this.props.dispatch({
      type: 'projectDetail/setUserForParam',
      payload: data
    })
    router.push('/project/project-manage/process-parameter');

  }

  // 流程进度开始
  processStart = row => {
    this.setState({ loading: true });
    const { projectId } = this.props;
    api.startProcessesProcess(row.id).then(() => {
      this.getTableData(projectId);
      this.setState({ loading: false });
    })
  }

  // 流程进度开始
  processPause = row => {
    this.setState({ loading: true });
    const { projectId } = this.props;
    api.pauseProcessesProcess(row.id).then(() => {
      this.getTableData(projectId);
      this.setState({ loading: false });
    })
  }

  // 删除
  handleDelete = row => {
    api.deleteProjectProcess(row.id).then(() => {
      this.getTableData(this.props.projectId);
    });
  }

  // 编辑名称描述模态框
  editBasicInfor = row => {
    this.setState({
      visibleModel: true,
      processList: row,
    })
  }

  // 获取回传数据进行保存
  getEditModelData = data => {
    const { projectId } = this.props;
    api.saveProcessInfor(data).then(() => {
      this.setState({
        visibleModel: false,
      });
      this.getTableData(projectId);
    }).catch();
  }

  // 关闭编辑模态框
  onCloseModel = () => {
    this.setState({
      visibleModel: false,
    });
  };

  // 关闭任务列表抽屉
  onCloseTask = () => {
    this.setState({
      visibleDrawer: false,
    });
  };


  render() {
    const {
      list,
      loading,
      editIndex,
      visibleModel,
      processList,
      visibleDrawer,
      detailList,
      taskList,
    } = this.state;

    let tableWidth = 0;

    let columns = [
      {
        title: '名称/描述',
        dataIndex: 'name',
        width: 600,
        render: (value, row, index) => {
          if (index === editIndex) {
            return (
              <>
                <span>
                  <a onClick={() => this.searchTaskList(row)}>
                    {value} <br/> {row.describe}
                  </a>
                </span>
                <EditOutlined
                  onClick={() => this.editBasicInfor(row)}
                  style={{ float: 'right', marginRight: 20, fontSize: 20}}
                />
              </>
            )
          }
          return <a onClick={() => this.searchTaskList(row)}>{value} <br/> {row.describe}</a>
        }
      },
      {
        title: '进度',
        dataIndex: 'processProgress',
        width: 270,
        render: (value, row) => {
          if (row.status === 1) {
            return (
              <Button
                onClick={() => this.processStart(row)}
                type='primary'
                style={{ borderRadius: '50px' }}
              >
                运行
              </Button>
            )
          }
          if (row.status === 2) {
            return (
              <>
                <ProgressMould percentData={row} />
                <PauseCircleOutlined
                  style={{ marginLeft: '10px' }}
                  onClick={() => this.processPause(row)}
                />
              </>
            )
          }
          if (row.status === 3) {
            return (
              <>
                <ProgressMould percentData={row} />
                <PlayCircleOutlined
                  style={{ marginLeft: '10px' }}
                  onClick={() => this.processStart(row)}
                />
              </>
            )
          }
          return <ProgressMould percentData={row} />;
        }
      },
      {
        title: '流程模型',
        dataIndex: 'processModelName',
        width: 350,
        render: (value, row) => (
            <>
              <Avatar
                src='/favicon.png'
                style={{ float: 'left', width: '46px', height: '46px' }}
              />
              <div style={{ float: 'left', marginLeft: '10px' }}>
                <div>{value}</div>
                <div>
                  <span style={{ marginRight: 10 }}> {row.processModelCode} </span>
                  <Tag color="green" > {row.processModeVersion} </Tag>
                </div>
              </div>
            </>
          )
      },
      {
        title: '参数',
        dataIndex: 'type',
        width: 100,
        render: (value, row) => (
          <SlidersOutlined
            onClick={() => this.searchProcessParam(row)}
            style={{ fontSize: 20 }}
          />
        )
      },
      {
        title: '操作',
        width: 120,
        render: (value, row) => {
          if(row.interactionAnalysis === 1) {
            return (
              <>
                <a onClick={() => this.handleDelete(row)}>删除</a>
                <Divider type="vertical" />
                <a onClick={() => message('交互分析')}>交互分析</a>
              </>
            )
          }
          return <a onClick={() => this.handleDelete(row)}>删除</a>
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
            columns={columns}
            onChange={this.handleStandardTableChange}
            onRow={( record, index ) => ({
              onMouseEnter: () => { this.setState({ editIndex: index }) },
              onMouseLeave: () => { this.setState({ editIndex: -1 }) }
            })}
            height={80}
          />
        </Form>
        <TaskList
          visible={visibleDrawer}
          onClose={this.onCloseTask}
          detailList={detailList}
          taskList={taskList}
        />
        <EditInforModel
          visible={visibleModel}
          onClose={this.onCloseModel}
          processList={processList}
          getData={this.getEditModelData}
        />
      </>
    );
  }
}

export default connect(({ projectDetail }) => ({
  projectDetail,
}))(ProcessList);

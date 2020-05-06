// 流程列表
import { Form, Table, Tag, Divider, message, Avatar, Tooltip } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
// import { EditOutlined } from '@ant-design/icons';
import router from 'umi/router';
import api from '@/pages/project/api/projectManageDetail';
import disk from '@/pages/project/api/disk';
import DefaultHeadPicture from '@/assets/imgs/defaultheadpicture.jpg';
import parameterImg from '@/assets/imgs/canshu@1x.png';
import edit from '@/assets/imgs/edit.png';
import TaskList from '../TaskList';
import { EditInforModel } from '../ModelUI';
import ProgressMould from '../ProgressMould';
import style from './index.less';

class ProcessList extends Component {
  tableSearchFormRef = React.createRef();

  tableFormRef = React.createRef();

  constructor(props) {
    super(props);
    const { data } = this.props;
    this.state = {
      // 表格
      list: data.processes, // 表格数据
      loading: false, // 加载状态
      editIndex: -1, // 当前编辑行icon
      visibleModel: false, // 是否显示编辑模态框
      rowData: [], // 选中编辑行数据

      // 任务列表抽屉
      visibleDrawer: false, // 是否显示抽屉
      detailList: [], // 项目信息
      taskList: [], // 任务列表信息
      test: false,
    };
  }

  // 组件挂载时
  componentDidMount() {}

  // 获取表格数据
  getTableData = projectId => {
    this.setState({ loading: true });
    api.getProjectProcess(projectId).then(res => {
      this.setState({
        list: res.processes,
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

  /**
   * 查看流程参数
   * processesData 流程数据
   */
  searchProcessParam = processesData => {
    const { projectId } = this.props;
    const { processModelId } = processesData;
    const processId = processesData.id;

    let type;
    if (processesData.status === 1) {
      type = 'edit';
    } else {
      type = 'view';
    }

    router.push(
      // eslint-disable-next-line max-len
     `/project/project-manage/process-parameter/${type}/${processModelId}/${projectId}/${processId}`,
    );
  };

  // 删除
  handleDelete = row => {
    this.setState({ loading: true });
    api.deleteProjectProcess(row.id).then(() => {
      this.getTableData(this.props.projectId);
    });
  };

  // 编辑名称描述模态框
  editBasicInfor = row => {
    this.setState({
      test: true,
      visibleModel: true,
      rowData: row,
    });
  };

  /**
   * 获取回传数据进行保存
   * data 回传数据
   */
  getEditModelData = data => {
    api
      .saveProcessInfor(data)
      .then(() => {
        this.setState({ visibleModel: false });
        this.getTableData(this.props.projectId);
      })
      .catch();
  };

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
      rowData,
      visibleDrawer,
      detailList,
      taskList,
      test,
    } = this.state;
    const columns = [
      {
        title: '名称/描述',
        dataIndex: 'name',
        width: 600,
        render: (value, row, index) => (
          <>
            <span className={style.textEllipsis}>
              <Tooltip placement="top" title={row.describe}>
                <a onClick={() => this.searchTaskList(row)}>
                  {value} <br /> {row.describe}
                </a>
              </Tooltip>
            </span>
            {index === editIndex && (
              <span className={style.textEllipsisImg}>
                <img src={edit} alt="" onClick={() => this.editBasicInfor(row)} />
              </span>
            )}
          </>
        ),
      },
      {
        title: '进度',
        dataIndex: 'processProgress',
        width: 270,
        render: (value, row) => (
          <ProgressMould
            percentData={row}
            processStart={this.processStart}
            processPause={this.processPause}
          />
        ),
      },
      {
        title: '流程模型',
        dataIndex: 'processModelName',
        width: 350,
        render: (value, row) => (
          <>
            <Avatar
              src={
                row.processModelPicture
                  ? disk.downloadFiles(row.processModelPicture, { view: true })
                  : DefaultHeadPicture
              }
              // src="/favicon.png"
              style={{ float: 'left', width: '46px', height: '46px' }}
            />
            <div style={{ float: 'left', marginLeft: '10px' }}>
              <div>{value}</div>
              <div>
                <span style={{ marginRight: 10 }}> {row.processModelCode} </span>
                <Tag color="green"> {row.processModeVersion} </Tag>
              </div>
            </div>
          </>
        ),
      },
      {
        title: '参数',
        dataIndex: 'type',
        width: 100,
        render: (value, row) => (
          <img
            src={parameterImg}
            alt=""
            onClick={() => this.searchProcessParam(row)}
            style={{ fontSize: 20, cursor: 'pointer' }}
          />
        ),
      },
      {
        title: '操作',
        width: 150,
        render: (value, row) => {
          if (row.interactionAnalysis === 1) {
            return (
              <>
                <a onClick={() => this.handleDelete(row)}>删除</a>
                <Divider type="vertical" />
                <a onClick={() => message('交互分析')}>交互分析</a>
              </>
            );
          }
          return <a onClick={() => this.handleDelete(row)}>删除</a>;
        },
      },
    ];

    return (
      <>
        <Form ref={this.tableFormRef}>
          <Table
            style={{ paddingRight: 30 }}
            scroll={{ y: 400 }}
            rowKey="id"
            loading={loading}
            dataSource={list}
            columns={columns}
            onRow={(record, index) => ({
              onMouseEnter: () => {
                this.setState({ editIndex: index });
              },
              onMouseLeave: () => {
                this.setState({ editIndex: -1 });
              },
            })}
            height={80}
            pagination={false}
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
          submit={test}
          onClose={this.onCloseModel}
          rowData={rowData}
          getData={this.getEditModelData}
        />
      </>
    );
  }
}

export default connect(({ projectDetail }) => ({
  projectDetail,
}))(ProcessList);

import React, { Component } from 'react';

import { connect } from 'dva';
import { Tabs, Avatar, Tag, Badge, Card, List, Spin } from 'antd';
import ArgumentModel from './argumentModel';
import api from '@/pages/project/api/taskmodel';
import { formatter } from '@/utils/utils';
import disk from '@/pages/project/api/disk';

const { TabPane } = Tabs;
// import TitleModel from './components/titleModel';

class TaskModelTabs extends Component {
  static getDerivedStateFromProps(nextProps) {
    console.log(nextProps.nowId);
    return {
      taskId: nextProps.nowId,
      preTaskList: nextProps.preTaskList,
      postTasks: nextProps.postTasks,
      preLoading: nextProps.preLoading,
      postLoading: nextProps.postLoading,
    };
  }

  state = {
    viewVisible: false,
    preTaskList: [], // 前置任务列表
    postTasks: [], // 后置任务列表
    preLoading: false,
    postLoading: false,
    toViewArgument: false,
    taskId: 0,
  };

  componentDidMount() {
    // const { viewId } = this.props.taskModel.taskModel;
    // console.log(this.getPreData(viewId));
    // debugger;
    // this.getPostData(viewId);
  }

  getPreData = async id => {
    this.setState({
      preLoading: true,
    });

    // const data = await api.getPreTasks(id);
    // api.getPreTasks(id).then()

    this.setState({
      preLoading: false,
    });
    // return data || [];
    // debugger;
    api.getPreTasks(id).then(res => {
      this.setState({
        preTaskList: res || [],
      });
    });
  };

  onChange = () => {};

  toViewParams = item => {
    this.setState({
      viewVisible: true,
    });
    console.log(this.props);
    // TODO 获取数据参数数据
    const { dispatch } = this.props;

    dispatch({
      type: 'taskModel/setViewParamsId',
      payload: item.id,
    });
    this.setState({
      toViewArgument: true,
    });
  };

  onViewClose = () => {
    this.setState({
      viewVisible: false,
    });
  };

  render() {
    const {
      viewVisible,
      preTaskList,
      postTasks,
      preLoading,
      postLoading,
      toViewArgument,
      taskId,
    } = this.state;
    console.log(taskId);

    const { taskModel } = this.props;
    const { taskModelStatusOptions, viewId } = taskModel.taskModel;

    // debugger;
    return (
      <div className="task_model_view_tab_wrap">
        <Tabs defaultActiveKey="1" onChange={this.onChange}>
          <TabPane tab="前置任务" key="1">
            {preLoading ? (
              <div className="task_model_pre_task_loading">
                <Spin />
              </div>
            ) : (
              <List
                rowKey="id"
                dataSource={preTaskList}
                renderItem={item => (
                  <List.Item key={item.id} onClick={() => this.toViewParams(item)}>
                    <Card hoverable style={{ width: '520px' }}>
                      <Avatar
                        src={item.fileId ? disk.downloadFiles(item.fileId, { view: true }) : ''}
                        style={{ float: 'left', marginRight: 10 }}
                        size="large"
                      />
                      <div style={{ display: 'inline-block', width: '55%' }}>
                        <div>{item.code}</div>
                        <div style={{ wordWrap: 'break-word' }}>{item.name}</div>
                      </div>

                      <Badge
                        status={formatter(taskModelStatusOptions, item.status, 'value', 'status')}
                        text={formatter(taskModelStatusOptions, item.status, 'value', 'label')}
                        style={{ float: 'right', marginLeft: 10 }}
                      />
                      <Tag color="green" style={{ padding: '0 10px', float: 'right' }}>
                        {item.version}
                      </Tag>
                    </Card>
                  </List.Item>
                )}
                className="list-style"
                split={false}
              />
            )}
          </TabPane>
          <TabPane tab="后置任务" key="2">
            {postLoading ? (
              <div className="task_model_pre_task_loading">
                <Spin />
              </div>
            ) : (
              <List
                rowKey="id"
                dataSource={postTasks}
                renderItem={item => (
                  <List.Item key={item.id} onClick={() => this.toViewParams(item)}>
                    <Card hoverable style={{ width: '520px' }}>
                      <Avatar
                        src={item.fileId ? disk.downloadFiles(item.fileId, { view: true }) : ''}
                        style={{ float: 'left', marginRight: 10 }}
                        size="large"
                      />
                      <div style={{ display: 'inline-block', width: '55%' }}>
                        <div>{item.code}</div>
                        <div style={{ wordWrap: 'break-word' }}>{item.name}</div>
                      </div>

                      <Badge
                        status={formatter(taskModelStatusOptions, item.status, 'value', 'status')}
                        text={formatter(taskModelStatusOptions, item.status, 'value', 'label')}
                        style={{ float: 'right', marginLeft: 10 }}
                      />
                      <Tag color="green" style={{ padding: '0 10px', float: 'right' }}>
                        {item.version}
                      </Tag>
                    </Card>
                  </List.Item>
                )}
                className="list-style"
                split={false}
              />
            )}
          </TabPane>
        </Tabs>
        {toViewArgument && (
          <ArgumentModel visible={viewVisible} onClose={this.onViewClose} fromView />
        )}
      </div>
    );
  }
}

export default connect(taskModel => ({
  taskModel,
}))(TaskModelTabs);

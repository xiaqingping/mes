import React, { Component } from 'react';

import { connect } from 'dva';
import { Tabs, Avatar, Tag, Badge, Card, List, Spin } from 'antd';
import ArgumentModel from './argumentModel';
import api from '@/pages/project/api/taskmodel';
import { formatter } from '@/utils/utils';

const { TabPane } = Tabs;
// import TitleModel from './components/titleModel';

class TaskModelTabs extends Component {
  state = {
    viewVisible: false,
    preTaskList: [], // 前置任务列表
    postTasks: [], // 后置任务列表
    preLoading: false,
    postLoading: false,
    toViewArgument: false,
  };

  componentDidMount() {
    const { viewId } = this.props.taskModel.taskModel;
    this.setState({
      preLoading: true,
      postLoading: true,
    });
    api.getPreTasks(viewId).then(res => {
      this.setState({
        preTaskList: res || [],
        preLoading: false,
      });
    });
    api.getPostTasks(viewId).then(res => {
      this.setState({
        postTasks: res || [],
        postLoading: false,
      });
    });
  }

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
    } = this.state;
    const { taskModel } = this.props;
    const { taskModelStatusOptions } = taskModel.taskModel;
    return (
      <>
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
                    <Card hoverable style={{ width: '550px' }}>
                      <Avatar
                        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                        style={{ float: 'left' }}
                        size="large"
                      />
                      <div style={{ float: 'left' }}>
                        <div>{item.code}</div>
                        <div style={{ wordWrap: 'break-word' }}>{item.name}</div>
                      </div>
                      <Badge
                        status={formatter(taskModelStatusOptions, item.status, 'value', 'status')}
                        text={formatter(taskModelStatusOptions, item.status, 'value', 'label')}
                        style={{ float: 'right', marginLeft: 10 }}
                      />
                      <Tag color="green" style={{ padding: '0 10px', float: 'right' }}>
                        V1.0
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
                    <Card hoverable style={{ width: '550px' }}>
                      <Avatar
                        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                        style={{ float: 'left' }}
                        size="large"
                      />
                      <div style={{ float: 'left' }}>
                        <div>{item.code}</div>
                        <div style={{ wordWrap: 'break-word' }}>{item.name}</div>
                      </div>
                      <Badge
                        status={formatter(taskModelStatusOptions, item.status, 'value', 'status')}
                        text={formatter(taskModelStatusOptions, item.status, 'value', 'label')}
                        style={{ float: 'right' }}
                      />
                      <Tag color="green" style={{ padding: '0 10px', float: 'right' }}>
                        V1.0
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
      </>
    );
  }
}

export default connect(taskModel => ({
  taskModel,
}))(TaskModelTabs);

import React, { Component } from 'react';
import { Drawer } from 'antd';
import { connect } from 'dva';
import api from '@/pages/project/api/taskmodel';
import TitleModel from './components/titleModel';
import TaskModelTabs from './components/taskModelTabs';
import './index.less';

/**
 * 查看任务模型 包含头部以及下面的前/后置tab
 */
class TaskModelView extends Component {
  static getDerivedStateFromProps(nextProps) {
    return { visible: nextProps.visible || false };
  }

  state = { nowId: '', preLoading: false, postLoading: false, postTasks: [], preTaskList: [] };

  /**
   * 根据id， 获取前置任务后置任务
   */
  componentDidMount() {
    // 获取抽屉数据
    const { viewId } = this.props;
    if (viewId) {
      this.getPreData(viewId);
      this.getPostData(viewId);
    }
  }

  /**
   * 关闭抽屉
   */
  onClose = () => {
    this.props.onClose();
  };

  /**
   * 获取子组件传过来的更改的id， 根据id查询前后置任务
   * @param {String} v 更改的id
   */
  getId = v => {
    this.setState(
      {
        nowId: v,
      },
      () => {
        this.getPreData(v);
        this.getPostData(v);
      },
    );
  };

  /**
   * 获取前置任务列表
   */
  getPreData = id => {
    this.setState({
      preLoading: true,
    });
    api.getPreTasks(id).then(res => {
      this.setState({
        preTaskList: res,
        preLoading: false,
      });
    });
  };

  /**
   * 获取后置任务列表
   */
  getPostData = id => {
    this.setState({
      postLoading: true,
    });
    api.getPostTasks(id).then(res => {
      this.setState({
        postTasks: res,
        postLoading: false,
      });
    });
  };

  render() {
    const { nowId, preTaskList, postTasks, preLoading, postLoading } = this.state;
    return (
      <>
        <Drawer
          width={520}
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={this.props.visible}
          destroyOnClose
          className="classTaskModelView"
        >
          <div>
            <TitleModel emitData={this.getId} reload={this.props.reload} />
          </div>
          <div className="task_model_view_wrap">
            <TaskModelTabs
              nowId={nowId}
              preTaskList={preTaskList}
              postTasks={postTasks}
              preLoading={preLoading}
              postLoading={postLoading}
            />
          </div>
        </Drawer>
      </>
    );
  }
}

export default connect(taskModel => ({
  taskModel,
}))(TaskModelView);

import React, { Component } from 'react';
import { Drawer } from 'antd';
import { connect } from 'dva';
import TitleModel from './components/titleModel';
import TaskModelTabs from './components/taskModelTabs';
import api from '@/pages/project/api/taskmodel';
import disk from '@/pages/project/api/disk';
import './index.less';

class TaskModel extends Component {
  static getDerivedStateFromProps(nextProps) {
    return { visible: nextProps.visible || false };
  }

  state = { nowId: '', preLoading: false, postLoading: false, postTasks: [], preTaskList: [] };

  componentDidMount() {
    // 获取抽屉数据
    // console.log(this.props);
    const { viewId } = this.props;
    console.log(viewId);
    if (viewId) {
      this.getPreData(viewId);
      this.getPostData(viewId);
    }
  }

  onClose = () => {
    this.props.onClose();
  };

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

  getPreData = id => {
    this.setState({
      preLoading: true,
    });
    api.getPreTasks(id).then(res => {
      console.log(res);
      const uuids = (res || []).map(e => e.picture);
      disk
        .getFiles({
          sourceCode: uuids.join(','),
          sourceKey: 'project_task_model',
        })
        .then(v => {
          const newList = (res || []).map(e => {
            const filterItem = (v || []).filter(item => item.sourceCode === e.picture) || [];
            const fileId = filterItem[0] && filterItem[0].id;
            return {
              ...e,
              fileId,
            };
          });
          this.setState({
            preTaskList: newList,
            preLoading: false,
          });
        });
      // this.setState({
      //   preTaskList: res || [],
      //   preLoading: false,
      // });
    });
  };

  getPostData = id => {
    this.setState({
      postLoading: true,
    });
    api.getPostTasks(id).then(res => {
      const uuids = (res || []).map(e => e.picture);
      disk
        .getFiles({
          sourceCode: uuids.join(','),
          sourceKey: 'project_task_model',
        })
        .then(v => {
          const newList = (res || []).map(e => {
            const filterItem = (v || []).filter(item => item.sourceCode === e.picture) || [];
            const fileId = filterItem[0] && filterItem[0].id;
            return {
              ...e,
              fileId,
            };
          });
          this.setState({
            postTasks: newList,
            postLoading: false,
          });
        });
      // this.setState({
      //   postTasks: res || [],
      //   postLoading: false,
      // });
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
}))(TaskModel);

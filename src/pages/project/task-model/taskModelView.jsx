import React, { Component } from 'react';
import { Drawer } from 'antd';
import { connect } from 'dva';
import TitleModel from './components/titleModel';
import TaskModelTabs from './components/taskModelTabs';

class TaskModel extends Component {
  static getDerivedStateFromProps(nextProps) {
    return { visible: nextProps.visible || false };
  }

  state = {};

  componentDidMount() {
    // 获取抽屉数据
    // const { viewId } = this.props;
  }

  onClose = () => {
    this.props.onClose();
  };

  render() {
    return (
      <>
        <Drawer
          width={600}
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={this.props.visible}
          destroyOnClose
        >
          <div>
            <TitleModel />
          </div>
          <div>
            <TaskModelTabs />
          </div>
        </Drawer>
      </>
    );
  }
}

export default connect(project => ({
  project,
}))(TaskModel);

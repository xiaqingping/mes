import React from 'react';
import './index.less';

const STATUS_TODO = 'STATUS_TODO';

// 类别
const STATUS_CODE = {
  STATUS_TODO: '待处理',
  STATUS_1: 'A类',
  STATUS_2: 'B类',
  STATUS_3: 'C类',
  STATUS_4: 'D类',
  STATUS_5: 'E类',
  STATUS_6: 'F类',
};

// 需要分类的项目
const tasks = [
  {
    id: 0,
    status: STATUS_TODO,
    username: 'aa',
  },
  {
    id: 1,
    status: STATUS_TODO,
    username: 'bb',
  },
  {
    id: 2,
    status: STATUS_TODO,
    username: 'cc',
  },
  {
    id: 3,
    status: STATUS_TODO,
    username: 'dd',
  },
  {
    id: 4,
    status: STATUS_TODO,
    username: 'ee',
  },
  {
    id: 5,
    status: STATUS_TODO,
    username: 'ff',
  },
];

class TaskItem extends React.Component {
  state = {
    dragStatus: false,
  };

  // 拖拽开始获取项目的ID
  handleDragStart = () => {
    this.setState({
      dragStatus: true,
    });
    this.props.onDragStart(this.props.id);
  };

  handleDragEnd = () => {
    this.props.onDragEnd;
    this.setState({
      dragStatus: false,
    });
  };

  render() {
    const { id, point, username, active } = this.props;
    const { dragStatus } = this.state;
    return (
      <div
        onDragStart={this.handleDragStart}
        onDragEnd={this.handleDragEnd}
        id={`item-${id}`}
        className={`item${active ? ' active' : ''}`}
        draggable="true"
        onMouseEnter={item => {
          if (dragStatus) {
            console.log(item.target);
          }
        }}
      >
        <header className="item-header">
          <span className="item-header-username">{username}</span>
          <span className="item-header-point">{point}</span>
        </header>
        {/* <main className="item-main">{title}</main> */}
      </div>
    );
  }
}

class TaskCol extends React.Component {
  // state = {
  //   in: false,
  // };

  handleDragEnter = e => {
    e.preventDefault();
    // if (this.props.canDragIn) {
    // this.setState({
    //   in: true,
    // });
    // }
  };

  handleDragLeave = e => {
    e.preventDefault();
    // if (this.props.canDragIn) {
    // this.setState({
    //   in: false,
    // });
    // }
  };

  handleDrop = e => {
    e.preventDefault();
    this.props.dragTo(this.props.status);
    // this.setState({
    //   in: false,
    // });
  };

  render() {
    const { status, children } = this.props;
    return (
      <div
        id={`col-${status}`}
        onDragEnter={this.handleDragEnter}
        onDragLeave={this.handleDragLeave}
        onDragOver={this.handleDragEnter}
        onDrop={this.handleDrop}
        className="col"
      >
        <header className="col-header">{STATUS_CODE[status]}</header>
        {/* <main className={`col-main${this.state.in ? ' active' : ''}`}>{children}</main> */}
        {/* 选择的类型 */}
        <main>{children}</main>
      </div>
    );
  }
}

class App extends React.Component {
  state = {
    activeId: null,
  };

  /**
   * 传入被拖拽任务项的 id
   */
  onDragStart = id => {
    this.setState({
      activeId: id,
    });
  };

  // 项目归到分类里
  dragTo = status => {
    const { activeId } = this.state;
    const task = tasks[activeId];
    if (task.status !== status) {
      task.status = status;
    }
    this.cancelSelect();
  };

  // 取消选择
  cancelSelect = () => {
    this.setState({
      activeId: null,
    });
  };

  render() {
    const { activeId } = this.state;
    const { onDragStart, cancelSelect } = this;
    return (
      <div className="task-wrapper">
        {Object.keys(STATUS_CODE).map(status => (
          <TaskCol
            status={status}
            key={status}
            dragTo={this.dragTo}
            canDragIn={activeId !== null && tasks[activeId].status !== status}
          >
            {tasks
              .filter(t => t.status === status)
              .map(t => (
                <TaskItem
                  key={t.id}
                  active={t.id === activeId}
                  id={t.id}
                  title={t.title}
                  point={t.point}
                  username={t.username}
                  onDragStart={onDragStart}
                  onDragEnd={cancelSelect}
                />
              ))}
          </TaskCol>
        ))}
      </div>
    );
  }
}

export default App;

import React, { Component } from 'react';

import { Drawer, Button, Popconfirm, Dropdown, Menu, Spin } from 'antd';

import { connect } from 'dva';
import ArgumentForm from './argumentForm';

class ArgumentModel extends Component {
  state = {
    loading: false,
    childrenDrawer: false,
    argumentList: [],
    isAdd: window.location.href.indexOf('add'),
    paramName: '', // 控制下一个抽屉的标题显示
    editOriginData: {}, // 修改参数时传给二级抽屉的原始参数对象,
  };

  componentDidMount() {
    // 获取列表
    const isAdd = window.location.href.indexOf('add');
    if (isAdd) {
      // 如果是新增
      this.setState({
        argumentList: [],
      });
      const { dispatch } = this.props;
      dispatch({
        type: 'taskModel/getArgumentsList',
        payload: this.state.argumentList,
      });
    } else {
      this.getArgumentList();
    }
  }

  getArgumentList = () => {
    this.setState({
      loading: true,
    });
  };

  emitArguments = props => {
    const { argumentList } = this.state;
    const list = [...argumentList];
    let idx = null;
    list.some((item, index) => {
      if (item.myId === props.myId) {
        idx = index;
      } else {
        idx = null;
      }
      return item.myId === props.myId;
    });
    if (idx || idx === 0) {
      list[idx] = props;
    } else {
      list.push(props);
    }
    this.setState({
      argumentList: list,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'taskModel/getArgumentsList',
      payload: this.state.argumentList,
    });
  };

  toggleChildrenDrawer = (bool, item) => {
    this.setState({
      childrenDrawer: bool,
    });
    if (item) {
      this.setState({
        title: item.text,
        editOriginData: {},
      });
    }
  };

  titleContent = () => {
    const { title, isAdd, paramName } = this.state;
    return (
      <>
        <div style={{ fontSize: '16px' }}>{`${title}---${isAdd ? '新增' : paramName}`}</div>
      </>
    );
  };

  handleDelete = (item, index) => {
    const { argumentList } = this.state;
    let list = [...argumentList];
    list = list.filter((v, idx) => {
      return idx !== index;
    });
    this.setState({
      argumentList: list,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'taskModel/getArgumentsList',
      payload: this.state.argumentList,
    });
  };

  toViewArgumrnt = (item, idx) => {
    this.setState({
      paramName: item.paramName,
    });
    this.toggleChildrenDrawer(true);
    if (idx || idx === 0) {
      this.setState({
        editOriginData: item,
      });
    } else {
      this.setState({
        editOriginData: {},
      });
    }
  };

  deleteArgumentItem = () => {};

  render() {
    const { visible, onClose, fromView } = this.props;
    const { childrenDrawer, argumentList, loading, editOriginData } = this.state;
    const { formItemType } = this.props.taskModel;
    const menu = (
      <Menu style={{ height: 200, overflow: 'auto' }}>
        {formItemType.map(item => {
          return (
            <Menu.Item key={item.type}>
              <a
                className="task_model_add_argument_list"
                onClick={() => {
                  this.toggleChildrenDrawer(true, item);
                }}
              >
                {item.text}
              </a>
            </Menu.Item>
          );
        })}
      </Menu>
    );

    return (
      <>
        <Drawer
          visible={visible}
          closable={false}
          onClose={onClose}
          title="参数"
          width={500}
          destroyOnClose
        >
          {loading ? (
            <div style={{ textAlign: 'center', marginTop: 15 }}>
              <Spin size="small" />
            </div>
          ) : (
            <>
              {argumentList.map((item, index) => {
                return (
                  <div style={{ overflow: 'hidden' }} key={item.paramKey}>
                    <span
                      style={{ fontSize: '14px', fontWeight: 600, cursor: 'point' }}
                      onClick={() => this.toViewArgumrnt(item, index)}
                    >
                      {item.paramKey}
                    </span>
                    <span style={{ marginLeft: 40 }}>{item.paramName}</span>
                    <Popconfirm
                      placement={index === 0 ? 'bottom' : 'top'}
                      title="确定要删除吗?"
                      onConfirm={() => this.handleDelete(item, index)}
                      okText="确认"
                      cancelText="取消"
                    >
                      <Button type="link" style={{ float: 'right', marginLeft: 40 }}>
                        删除
                      </Button>
                    </Popconfirm>
                  </div>
                );
              })}

              <Dropdown overlay={menu} trigger={['click']}>
                <Button type="dashed" block style={{ marginTop: 30 }}>
                  新增
                </Button>
              </Dropdown>
            </>
          )}
          <Drawer
            destroyOnClose
            width={400}
            visible={childrenDrawer}
            closable={false}
            onClose={() => this.toggleChildrenDrawer(false)}
            title={this.titleContent()}
          >
            <ArgumentForm
              fromView
              editOriginData={editOriginData}
              emitArguments={this.emitArguments}
              onClose={() => {
                this.toggleChildrenDrawer(false);
              }}
            />
          </Drawer>
        </Drawer>
      </>
    );
  }
}

export default connect(({ taskModel }) => ({
  taskModel,
}))(ArgumentModel);

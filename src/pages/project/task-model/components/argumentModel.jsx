import React, { Component } from 'react';

import { Drawer, Button, Popconfirm, Dropdown, Menu, Spin } from 'antd';

import { connect } from 'dva';
import ArgumentForm from './argumentForm';

class ArgumentModel extends Component {
  state = {
    loading: false,
    childrenDrawer: false,
    argumentList: [],
  };

  componentDidMount() {
    // 获取列表

    const isAdd = window.location.href.indexOf('add');
    if (isAdd) {
      // 如果是新增
      this.setState({
        argumentList: [],
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
    list.push(props);
    this.setState({
      argumentList: list,
    });
  };

  toggleChildrenDrawer = (bool, item) => {
    this.setState({
      childrenDrawer: bool,
    });
    if (item) {
      this.setState({
        title: item.describe,
      });
    }
  };

  titleContent = () => {
    const { title } = this.state;
    return (
      <>
        <div style={{ fontSize: '16px' }}>{title}</div>
      </>
    );
  };

  handleDelete = item => {
    console.log(item);
  };

  render() {
    const { visible, onClose } = this.props;
    const { childrenDrawer, argumentList, loading } = this.state;
    const { formItemType } = this.props.taskModel;
    console.log(this.state.argumentList);

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
        <Drawer visible={visible} closable={false} onClose={onClose} title="参数" width={500}>
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
                      style={{ fontSize: '14px', fontWeight: 600 }}
                      onClick={this.toViewArgumrnt}
                    >
                      {item.paramKey}
                    </span>
                    <span style={{ marginLeft: 40 }}>{item.paramName}</span>
                    <Popconfirm
                      placement={index === 0 ? 'bottom' : 'top'}
                      title="确定要删除吗?"
                      onConfirm={() => this.handleDelete(item)}
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
            width={400}
            visible={childrenDrawer}
            closable={false}
            onClose={() => this.toggleChildrenDrawer(false)}
            title={this.titleContent()}
          >
            <ArgumentForm
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

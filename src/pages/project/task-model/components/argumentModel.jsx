import React, { Component } from 'react';

import { Drawer, Button, Popconfirm, Dropdown, Menu } from 'antd';

import { connect } from 'dva';
import ArgumentForm from './argumentForm';

class ArgumentModel extends Component {
  state = {
    childrenDrawer: false,
    arr: [1, 2, 3, 4],
  };

  toggleChildrenDrawer = bool => {
    this.setState({
      childrenDrawer: bool,
    });
  };

  titleContent = () => {
    return (
      <>
        <div style={{ fontSize: '16px' }}>参数</div>
      </>
    );
  };

  handleDelete = item => {
    console.log(item);
  };

  render() {
    const { visible, onClose } = this.props;
    const { childrenDrawer } = this.state;
    const { formItemType } = this.props.taskModel;

    const menu = (
      <Menu style={{ height: 200, overflow: 'auto' }}>
        {formItemType.map(item => {
          return (
            <Menu.Item key={item.type}>
              <a
                className="task_model_add_argument_list"
                onClick={() => {
                  this.toggleChildrenDrawer(true);
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
          {this.state.arr.map((item, index) => {
            return (
              <div style={{ overflow: 'hidden' }} key={item}>
                <span style={{ fontSize: '14px', fontWeight: 600 }}>参数 &nbsp;{item}：</span>
                <span style={{ marginLeft: 40 }}>OTU阀值</span>
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
          <Drawer
            width={400}
            visible={childrenDrawer}
            closable={false}
            onClose={() => this.toggleChildrenDrawer(false)}
            title={this.titleContent()}
          >
            <ArgumentForm />
          </Drawer>
        </Drawer>
      </>
    );
  }
}

export default connect(({ taskModel }) => ({
  taskModel,
}))(ArgumentModel);

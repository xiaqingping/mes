import React, { Component } from 'react';
import { Drawer, Button, Popconfirm, Dropdown, Menu, Spin, Empty, message } from 'antd';
import api from '@/pages/project/api/taskmodel';
import { connect } from 'dva';
import ArgumentForm from './argumentForm';
import '../index.less';

class ArgumentModel extends Component {
  state = {
    loading: false,
    childrenDrawer: false,
    argumentList: [],
    isAdd: window.location.href.indexOf('add') > 0,
    paramName: '', // 控制下一个抽屉的标题显示
    editOriginData: {}, // 修改参数时传给二级抽屉的原始参数对象,
    type: '', // 组件类型 ,比如: input
  };

  componentDidMount() {
    // alert(1);
    // 获取列表
    const isAdd = window.location.href.indexOf('add') > 0;
    const { argumentList } = this.props.taskModel;
    console.log(argumentList);

    if (argumentList && argumentList.length > 0) {
      this.setState({
        argumentList,
      });
    } else if ((argumentList || []).length === 0 && isAdd) {
      this.setState({
        argumentList: [],
      });
      const { dispatch } = this.props;
      dispatch({
        type: 'taskModel/getArgumentsList',
        payload: [],
      });
    } else {
      this.getArgumentList();
    }

    // if (isAdd) {
    //   // 如果是新增
    //   if (argumentList && !argumentList.length) {
    //     this.setState({
    //       argumentList,
    //     });
    //   } else {
    //     this.setState({
    //       argumentList: [],
    //     });
    //     const { dispatch } = this.props;
    //     dispatch({
    //       type: 'taskModel/getArgumentsList',
    //       payload: this.state.argumentList,
    //     });
    //   }
    // } else {
    //   this.getArgumentList();
    // }
  }

  getArgumentList = () => {
    const { selectParamsId, editTaskModelId } = this.props.taskModel;
    const { fromView } = this.props;
    const { isAdd } = this.state;
    this.setState({
      loading: true,
    });
    console.log(selectParamsId);
    let id = isAdd ? selectParamsId : editTaskModelId;
    if (fromView) {
      id = selectParamsId;
    }
    console.log(id);
    api
      .getTaskModelDetail(id)
      .then(res => {
        console.log(res);
        const list = res.params.map(item => {
          item.myId = Date.now();
          return item;
        });
        const { dispatch } = this.props;
        dispatch({
          type: 'taskModel/getArgumentsList',
          payload: list,
        });
        this.setState({
          argumentList: list,
          loading: false,
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          argumentList: [],
          loading: false,
        });
      });
  };

  emitArguments = props => {
    const { argumentList } = this.state;
    const list = [...argumentList];
    let idx = null;
    const isEdit = list.some((item, index) => {
      if (item.myId === props.myId) {
        idx = index;
      } else {
        idx = null;
      }
      return item.myId === props.myId;
    });
    if (isEdit) {
      list[idx] = props;
    } else {
      const listkeys = list.map(item => {
        return item.paramKey;
      });
      if (listkeys.includes(props.paramKey)) {
        return message.error('参数中存在相同参数key!');
      }
      list.push(props);
    }
    this.toggleChildrenDrawer(false);
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
        type: item.type,
        editOriginData: {},
      });
    }
  };

  titleContent = () => {
    const { title, isAdd, paramName } = this.state;
    const paramname = isAdd ? '新增' : paramName;
    const spliter = paramname ? '---' : '';
    return (
      <>
        {/* <div style={{ fontSize: '16px' }}>{`${title}---${isAdd ? '新增' : paramName}`}</div> */}
        <div style={{ fontSize: '16px' }}>{`${title}${spliter}${paramname}`}</div>
      </>
    );
  };

  handleDelete = (item, index) => {
    const { argumentList } = this.state;
    let list = [...argumentList];
    list = list.filter((v, idx) => {
      return idx !== index;
    });
    if (!list.length) {
      this.setState({
        paramName: '',
      });
    }
    this.setState(
      {
        argumentList: list,
      },
      () => {
        const { dispatch } = this.props;
        dispatch({
          type: 'taskModel/getArgumentsList',
          payload: this.state.argumentList,
        });
      },
    );
  };

  toViewArgumrnt = (item, idx) => {
    console.log(item);
    const { formItemType } = this.props.taskModel;
    console.log(this.props.taskModel);
    let title = null;
    formItemType.some(v => {
      if (v.type === item.type) {
        title = v.text;
      }
    });

    this.setState({
      type: item.type,
      title,
    });
    const { fromView } = this.props;
    const { argumentList } = this.state;
    this.setState({
      paramName: item.paramName,
    });
    this.toggleChildrenDrawer(true);
    // 当关闭时候需要展示的列表
    if (idx || idx === 0) {
      this.setState({
        editOriginData: item,
      });
    } else {
      this.setState({
        editOriginData: {},
      });
    }

    // -------------------当打开某一个参数的时候获取它的详细信息--------------------

    if (fromView) {
      argumentList.some(v => {
        if (v.paramId === item.paramId) {
          console.log(item);

          this.setState({
            editOriginData: v,
            type: v.type,
          });
          return true;
        }
        return v;
      });
    }
  };

  deleteArgumentItem = () => {};

  render() {
    const { visible, onClose, fromView } = this.props;
    const { childrenDrawer, argumentList, loading, editOriginData, type } = this.state;
    const { formItemType } = this.props.taskModel;
    const menu = (
      <Menu style={{ maxHeight: 200, overflow: 'auto' }}>
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
      <div className="task_model_argu_draw_wrap">
        <Drawer
          headerStyle={{ paddingTop: 24, paddingBottom: 24 }}
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
              {argumentList.length === 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
              {argumentList.map((item, index) => {
                return (
                  <div className="task_model_argumrnt_list" key={item.paramKey}>
                    <span
                      className="task_model_argu_label"
                      onClick={() => this.toViewArgumrnt(item, index)}
                    >
                      {item.paramKey}
                    </span>
                    <span
                      className="task_model_argu_content"
                      // style={{ display: 'inline-block', width: '200px' }}
                    >
                      {item.paramName}
                    </span>
                    {!fromView && (
                      <div style={{ float: 'right', paddingLeft: 40 }}>
                        <Popconfirm
                          overlayClassName="task_model_argu_model_pop"
                          // width={200}
                          placement={index === 0 ? 'bottom' : 'top'}
                          title="确定要删除吗?"
                          onConfirm={() => this.handleDelete(item, index)}
                          okText="确认"
                          cancelText="取消"
                        >
                          <Button type="link">删除</Button>
                        </Popconfirm>
                      </div>
                    )}
                  </div>
                );
              })}

              {!fromView && (
                <Dropdown overlay={menu} trigger={['click']}>
                  <Button type="dashed" block style={{ marginTop: 30 }}>
                    新增
                  </Button>
                </Dropdown>
              )}
            </>
          )}
          <Drawer
            headerStyle={{ paddingTop: 24, paddingBottom: 24 }}
            destroyOnClose
            width={420}
            visible={childrenDrawer}
            closable={false}
            onClose={() => this.toggleChildrenDrawer(false)}
            title={this.titleContent()}
          >
            {type === 'input' && (
              <ArgumentForm
                fromView={fromView}
                type={type}
                editOriginData={editOriginData}
                emitArguments={this.emitArguments}
                onClose={() => {
                  this.toggleChildrenDrawer(false);
                }}
              />
            )}
          </Drawer>
        </Drawer>
      </div>
    );
  }
}

export default connect(({ taskModel }) => ({
  taskModel,
}))(ArgumentModel);

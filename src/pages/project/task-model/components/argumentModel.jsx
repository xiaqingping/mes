import React, { Component } from 'react';
import { Drawer, Button, Popconfirm, Dropdown, Menu, Spin, Empty, message } from 'antd';
import api from '@/pages/project/api/taskmodel';
import { connect } from 'dva';
import ArgumentForm from './argumentForm';

/**
 * 任务新增，修改，升级，查看的参数列表页面
 */

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

  /**
   * 获取所需要的参数列表
   */
  componentDidMount() {
    // 获取列表
    const isAdd = window.location.href.indexOf('add') > 0;
    const { argumentList, firstOpenParams } = this.props.taskModel;
    if ((argumentList && argumentList.length > 0) || !firstOpenParams) {
      const list = argumentList.map((item, index) => {
        const newItem = item;
        newItem.myId = Date.now() + index;
        return item;
      });
      const { dispatch } = this.props;
      dispatch({
        type: 'taskModel/getArgumentsList',
        payload: list,
      });
      this.setState({
        argumentList: list,
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
    const { dispatch } = this.props;
    dispatch({
      type: `taskModel/setFirstOpenParams`,
      payload: false,
    });
  }

  /**
   * 页面销毁之前清空数据
   */
  componentWillUnmount() {
    const { fromView } = this.props;
    const { dispatch } = this.props;
    if (fromView) {
      dispatch({
        type: 'taskModel/getArgumentsList',
        payload: [],
      });
    }
  }

  /**
   * 根据id查询出当前任务的参数列表
   */
  getArgumentList = () => {
    const { selectParamsId, editTaskModelId } = this.props.taskModel;
    const { fromView } = this.props;
    const { isAdd } = this.state;
    this.setState({
      loading: true,
    });
    let id = isAdd ? selectParamsId : editTaskModelId;
    if (fromView) {
      id = selectParamsId;
    }
    api
      .getTaskModelDetail(id)
      .then(res => {
        const list = res.params.map((item, index) => {
          const newItem = item;
          newItem.myId = Date.now() + index;
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

  /**
   * 获取从参数form页面传过来的一条参数数据并确定是新增还是修改
   * @param {Object} props 从参数form页面传过来的一条参数数据
   */
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
      const listkeys = [];
      const listType = [];
      const noDoubleList = ['sample_select', 'sample_group', 'sample_environment_factor'];
      list.forEach(item => {
        listkeys.push(item.paramKey);
        listType.push(item.type);
      });

      if (listkeys.includes(props.paramKey)) {
        return message.error('参数中存在相同参数key!');
      }
      if (noDoubleList.includes(props.type)) {
        if (listType.includes(props.type)) {
          return message.error(`参数中只能存在唯一的样品选择，分组方案，环境因子`);
        }
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
      payload: list,
    });
    return true;
  };

  /**
   *  开关抽屉
   * @param {Boolean} bool 是否开关
   * @param {Object} item 参数配置组件信息： {type:'input'， text:'单行输入'}...
   */
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

  /**
   * 设置参数详情抽屉的title
   */
  titleContent = () => {
    const { title, isAdd, paramName } = this.state;
    const paramname = isAdd ? '新增' : paramName;
    const spliter = paramname ? <div className="task_model_param_form_title" /> : '';
    return (
      <>
        <div style={{ fontSize: '16px', display: 'flex' }}>
          <span>{title}</span>
          {spliter}
          <span>{paramname}</span>
        </div>
      </>
    );
  };

  /**
   * 删除一条参数
   * @param {Number} index 当前数据的下标
   */
  handleDelete = index => {
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

  /**
   * 查看参数
   * @param {Object} item 将要查看的参数的type/text信息
   * @param {Number} idx 将要查看的参数下标
   */
  toViewArgumrnt = (item, idx) => {
    const { formItemType } = this.props.taskModel;
    let title = null;
    // eslint-disable-next-line array-callback-return
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

    const props = {
      fromView,
      type,
      editOriginData,
      emitArguments: this.emitArguments,
      onClose: () => {
        this.toggleChildrenDrawer(false);
      },
    };
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
                    <span className="task_model_argu_content">{item.paramName}</span>
                    {!fromView && (
                      <div style={{ float: 'right', paddingLeft: 40 }}>
                        <Popconfirm
                          overlayClassName="task_model_argu_model_pop"
                          placement={index === 0 ? 'bottom' : 'top'}
                          title="确定要删除吗?"
                          onConfirm={() => this.handleDelete(index)}
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
            <ArgumentForm {...props} />
          </Drawer>
        </Drawer>
      </div>
    );
  }
}

export default connect(({ taskModel }) => ({
  taskModel,
}))(ArgumentModel);

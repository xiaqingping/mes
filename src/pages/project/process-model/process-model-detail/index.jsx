// 详情二级抽屉
import React, { Component } from 'react';
import { Drawer, Avatar, Tag, List, Card, Badge, Spin, Empty } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { formatter, cutString } from '@/utils/utils';
import './index.less';
import api from '@/pages/project/api/taskmodel';
import processApi from '@/pages/project/api/processModel/';
import disk from '@/pages/project/api/disk';
import Parameter from '@/pages/project/process-model/components/Parameter';
import ParamPic from '@/assets/imgs/canshu@1x.png';
import { connect } from 'dva';

class DrawerTool extends Component {
  state = {
    childrenDrawer: false,
    open: false,
    visable: false,
    selectVersion: '',
    task: [],
    taskName: '',
    parameterVisible: '',
    detailValue: [],
    loading: true,
    errorPage: false,
  };

  componentDidMount() {
    const { detailId } = this.props;
    processApi
      .getProcessDetail(detailId)
      .then(res => {
        this.setState({
          detailValue: res,
          loading: false,
        });
      })
      .catch(() => {
        this.setState({
          errorPage: true,
        });
      });
  }

  onClose = () => {
    this.setState({
      selectVersion: '',
      visable: false,
    });
    this.props.onClose();
  };

  onUnPublish = () => {
    const { detailValue } = this.state;
    this.props.handleUnPublish(detailValue);
    this.props.onClose();
  };

  // 关闭参数
  handleClose = value => {
    const { detailValue } = this.state;
    if (detailValue.status !== 1) {
      this.setState({
        parameterVisible: false,
      });
      return false;
    }
    const newData = value.map((item, index) => {
      const itemLength = value.length;
      return { ...item, sortNo: itemLength - index };
    });
    const sonData = newData;
    newData.map((item, index) => {
      sonData[index].params = item.params.map((i, ind) => {
        const iLength = item.params.length;
        return { ...i, sortNo: iLength - ind };
      });
      return true;
    });
    sonData[0].sortNo = 0;
    const data = JSON.parse(JSON.stringify(detailValue));
    const taskdata = detailValue.taskModels.map(item => ({
      taskModelId: item.id,
      automatic: item.automatic,
    }));
    data.groups = sonData;
    data.taskModels = taskdata;
    // console.log(data);
    processApi.changeProcess(data);
    this.setState({
      parameterVisible: false,
    });
    // this.setState({
    //   parameterVisible: false,
    //   paramter: sonData,
    // });
    return true;
  };

  // 更换版本
  handleChangeVersion = v => {
    processApi.getProcessChangeVersion(v).then(res => {
      this.setState({
        detailValue: res,
      });
    });
  };

  // title内容
  titleContent = value => {
    const { visable, selectVersion, parameterVisible, detailValue, open } = this.state;
    return (
      <div style={{ marginTop: '25px' }} >
        <div className="titleContentImage">
          <Avatar
            src={value.picture ? disk.downloadFiles(value.picture, { view: true }) : ''}
            style={{ float: 'left' }}
            size="large"
          />
        </div>

        {/* 选择版本 */}
        <div style={{ float: 'left', marginLeft: '10px' }}>
          <div>
            {value.code}
            <div style={{ position: 'relative', display: 'inline-block', marginLeft: '30px' }}>
              <Tag
                color="default"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  this.setState({
                    visable: !visable,
                  });
                }}
              >
                {selectVersion || value.version}
              </Tag>
              {visable ? (
                <Card
                  style={{ position: 'absolute', zIndex: '100', top: '28px' }}
                  hoverable
                  className="padding-none"
                >

                  {value.versions
                    ? value.versions.map(item => (
                      <Tag
                        // color={item === value.version ? 'green' : 'default'}
                        color={value.version === 'V1.0' ? 'default' : 'green'}
                        key={item}
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          if (item !== value.version) {
                            this.handleChangeVersion({ code: value.code, version: item });
                          }
                          this.setState({
                            visable: !visable,
                            selectVersion: item,
                          });
                        }}
                      >
                        {item}
                      </Tag>
                    ))
                    : ''}
                </Card>
              ) : (
                  ''
                )}
              <div style={{ float: 'right', marginLeft: '40px' }}>
                <a
                  onClick={() =>
                    this.setState({
                      parameterVisible: true,
                    })
                  }
                >
                  <img src={ParamPic} alt="" width="16" height="16" />
                </a>
              </div>
            </div>
          </div>
          <div style={{ width: '255px', height: '50px', wordWrap: 'break-word' }}>{value.name}</div>
        </div>

        {/* 参数弹框 */}
        {parameterVisible ? (
          <Parameter
            visible={parameterVisible}
            handleClose={v => this.handleClose(v)}
            paramter={detailValue.groups}
          />
        ) : (
            ''
          )}

        <div style={{ float: 'right', marginLeft: '30px', fontSize: '14px' }}>
          {value.status === 2 ? (
            <a onClick={this.onUnPublish} style={{ color: 'red', marginBottom: '20px' }}>
              禁用
            </a>
          ) : (
              ''
            )}
          <div>
            {open ? (
              <a
                href="#"
                onClick={() =>
                  this.setState({
                    open: !open,
                  })
                }
              >
                收起
                <UpOutlined />
              </a>
            ) : (
                <a
                  href="#"
                  onClick={() =>
                    this.setState({
                      open: !open,
                    })
                  }
                >
                  展开
                  <DownOutlined />
                </a>
              )}
          </div>
        </div>
        {open ? (
          <div style={{ marginLeft: '40px', color: '#858585', fontSize: '14px' }}>
            <div style={{ clear: 'both', marginTop: '36px' }}>{value.publisherName}</div>
            <div style={{ marginBottom: '10px' }}>{value.publishDate}</div>
            <div style={{ width: '400px', wordWrap: 'break-word' }}>{value.describe}</div>
          </div>
        ) : (
            ''
          )}
      </div>
    );
  };

  // 弹出二级抽屉
  showChildrenDrawer = item => {
    this.setState({
      taskName: item.name,
    });
    api.getPreTasks(item.id).then(res => {
      this.setState({
        task: res,
      });
      const uuids = res.map(i => i.picture);
      if (uuids && uuids.length !== 0) {
        disk.getFiles({ sourceCode: uuids.join(','), sourceKey: 'project_task_model' }).then(r => {
          const newList = res.map(e => {
            if (!e.picture) return false;
            const filterItem = r.filter(it => it.sourceCode === e.picture);
            const fileId = filterItem[0] && filterItem[0].id;
            return {
              ...e,
              fileId,
            };
          });
          this.setState({
            childrenDrawer: true,
            task: newList,
          });
        });
      } else {
        this.setState({
          childrenDrawer: true,
        });
      }
    });
  };

  onChildrenDrawerClose = () => {
    this.setState({
      childrenDrawer: false,
    });
  };

  render() {
    const { detailValue, loading, taskName, childrenDrawer, task, errorPage } = this.state;
    const { status } = this.props;
    return (
      <div>
        <Drawer
          title={errorPage ? '' : this.titleContent(detailValue)}
          width={500}
          closable={false}
          onClose={this.onClose}
          visible={this.props.visible}
          className="drawer-style processModelDetail"
        >
          {errorPage ? (
            <Empty />
          ) : (
              <Spin spinning={loading}>
                <List
                  rowKey="id"
                  dataSource={detailValue.taskModels}
                  renderItem={item => (
                    <List.Item key={item}>
                      <Card hoverable style={{ width: '470px', height: '240px' }}>
                        <Avatar
                          src={item.picture ? disk.downloadFiles(item.picture, { view: true }) : ''}
                          style={{ float: 'left' }}
                          size="large"
                        />
                        <div style={{ float: 'left', marginLeft: '10px' }}>
                          <div>{item.code}</div>
                          <div style={{ width: '255px', height: '50px', wordWrap: 'break-word' }}>
                            {item.name}
                          </div>
                        </div>
                        <Tag color="green" style={{ padding: '0 10px', float: 'right' }}>
                          {item.version}
                        </Tag>
                        <div style={{ clear: 'both' }}>
                          <div>
                            <span>前置任务: </span>
                            <span style={{ marginLeft: '15px' }}>
                              {item.isHavePreTaskModel === 1 ? (
                                <a onClick={() => this.showChildrenDrawer(item)}>查看</a>
                              ) : (
                                  '无'
                                )}
                            </span>
                          </div>
                          <div style={{ margin: '8px 0' }}>
                            <span>状态: </span>
                            <span style={{ marginLeft: '45px' }}>
                              <Badge
                                status={formatter(status, item.status, 'value', 'status')}
                                text={formatter(status, item.status, 'value', 'text')}
                              />
                            </span>
                          </div>
                          <div>
                            <div style={{ float: 'left', width: '20%' }}>描述: </div>
                            <div style={{ float: 'left', width: '80%' }}>
                              {cutString(item.describe, 100)}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </List.Item>
                  )}
                  className="list-style"
                  split={false}
                />
                <Drawer
                  title={taskName}
                  width={500}
                  closable={false}
                  onClose={this.onChildrenDrawerClose}
                  visible={childrenDrawer}
                >
                  <List
                    rowKey="id"
                    dataSource={task}
                    renderItem={item => (
                      <List.Item key={item}>
                        <Card hoverable style={{ width: '470px', height: '240px' }}>
                          <Avatar
                            src={item.fileId ? disk.downloadFiles(item.fileId, { view: true }) : ''}
                            style={{ float: 'left' }}
                            size="large"
                          />
                          <div style={{ float: 'left', marginLeft: '10px' }}>
                            <div>{item.code}</div>
                            <div style={{ width: '255px', height: '50px', wordWrap: 'break-word' }}>
                              {item.name}
                            </div>
                          </div>
                          <Tag color="green" style={{ padding: '0 10px', float: 'right' }}>
                            {item.version}
                          </Tag>
                          <div style={{ clear: 'both' }}>
                            <div>
                              <span>前置任务: </span>
                              <span style={{ marginLeft: '15px' }}>
                                {item.isHavePreTaskModel === 1 ? '有' : '无'}
                              </span>
                            </div>
                            <div style={{ margin: '8px 0' }}>
                              <span>状态: </span>
                              <span style={{ marginLeft: '45px' }}>
                                <Badge
                                  status={formatter(status, item.status, 'value', 'status')}
                                  text={formatter(status, item.status, 'value', 'text')}
                                />
                              </span>
                            </div>
                            <div>
                              <div style={{ float: 'left', width: '20%' }}>描述: </div>
                              <div style={{ float: 'left', width: '80%' }}>{item.describe}</div>
                            </div>
                          </div>
                        </Card>
                      </List.Item>
                    )}
                    className="list-style"
                    split={false}
                  />
                </Drawer>
              </Spin>
            )}
        </Drawer>
      </div>
    );
  }
}

export default connect(({ project }) => ({
  status: project.status,
}))(DrawerTool);

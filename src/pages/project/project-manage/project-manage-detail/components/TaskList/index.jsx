// 任务列表 抽屉
import React, { Component } from 'react';
import { connect } from 'dva';
import api from '@/pages/project/api/projectManageDetail';
import { formatter } from '@/utils/utils';
import { Drawer, Card, List, Avatar, Tag, Table, Badge, Tooltip, Form } from 'antd';
import {
  DownOutlined,
  UpOutlined,
  SlidersOutlined,
  ClockCircleOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
} from '@ant-design/icons';
import { ModelType } from '@/pages/project/components/ModelComponents';
import disk from '@/pages/project/api/disk';
import DefaultHeadPicture from '@/assets/imgs/defaultheadpicture.jpg';
import { calculateTimeDifference } from '../../functions';
import style from './index.less';

class TaskList extends Component {
  state = {
    visibleParam: false,
    parameterList: [],
    openId: [],
  };

  // 获取此页面需要用到的基础数据
  getCacheData = () => {};

  // 是否显示执行记录表
  showTable = (id, type) => {
    const { openId } = this.state;
    const newData = openId;

    if (type === 1) {
      newData.push(id);
    }
    if (type === 2) {
      let index = null;
      openId.forEach((item, ind) => {
        if (item === id) {
          index = ind
          }
      });
      newData.splice(index, 1);
    }

    this.setState({
      openId: newData,
    });
  };

  // 提示框 时间信息
  time = row => {
    if (row.status === 1) {
      return <span>未开始</span>;
    }
    if (row.status === 4) {
      return (
        <>
          <span>开始：{row.beginDate}</span>
          <br />
          <span>结束：{row.endDate}</span>
        </>
      );
    }
    return <span>开始：{row.beginDate}</span>;
  };

  // 查看任执行记录的参数
  searchParameter = row => {
    const valueData = row.taskExecRecordParamList;
    api.getTaskParam(row.taskModelId).then(res => {
      // 对比合并参数
      const paramData = this.disposeTaskData(res);
      const parameterList = this.disposeParamData(paramData, valueData);
      this.setState({ visibleParam: true, parameterList });
    });
  };

  // 处理任务参数列表
  disposeTaskData = data => {
    const newData = [];
    data.forEach(item => {
      const newItem = JSON.parse(JSON.stringify(item));
      newItem.paramProperties.forEach(e => {
        newItem[e.paramPropertyKey] = e.paramPropertyValue;
      });
      newData.push(newItem);
    });
    return newData;
  }

  // 合并参数列表和参数值
  disposeParamData = (paramData, valueData) => {
    const newData = [];
    paramData.forEach(paramItem => {
      valueData.forEach(valueItem => {
        const newItem = JSON.parse(JSON.stringify(paramItem));
        if (paramItem.paramKey === valueItem.paramKey) {
          newItem.paramValue = valueItem.paramValue;
          newData.push(newItem);
        }
      })
    })
    return newData;
  }

  // 任务执行记录开始运行
  startExecRecord = row => {
    api.startExecRecord(row.id).then(() => {
      this.props.onClose();
    });
  };

  // 任务执行记录暂停运行
  pauseExecRecord = row => {
    api.pauseExecRecord(row.id).then(() => {
      this.props.onClose();
    });
  };

  // 关闭二级抽屉
  onCloseParam = () => {
    this.setState({
      visibleParam: false,
    });
  };

  render() {
    const {
      visibleParam,
      parameterList,
      openId,
    } = this.state;
    const { detailList, taskList, visible } = this.props;
    const { execRecordStatus } = this.props.projectDetail;

    const columns = [
      {
        title: '编号',
        dataIndex: 'code',
        width: 100,
        render: (value, row) => (
          <>
            <span>{value}</span>
            <SlidersOutlined
              className={style.marginLeft}
              onClick={() => this.searchParameter(row)}
            />
          </>
        ),
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 100,
        render: (value, row) => {
          const name = formatter(execRecordStatus, value);
          const status = formatter(execRecordStatus, value, 'id', 'status');
          return (
            <>
              <Badge status={status} text={name} />
              <Tooltip title={this.time(row)}>
                <ClockCircleOutlined className={style.marginLeft} />
              </Tooltip>
            </>
          );
        },
      },
      {
        title: '',
        dataIndex: 'status',
        width: 50,
        render: (value, row) => {
          const duration = calculateTimeDifference(row.startTime, row.endTime);
          if (value === 4) {
            return duration;
          }
          if (value === 1) {
            return <PauseCircleOutlined onClick={() => this.pauseExecRecord(row)} />;
          }
          if (value === 3) {
            return (
              <PlayCircleOutlined
                style={{ color: '#1890ff' }}
                onClick={() => this.startExecRecord(row)}
              />
            );
          }
          return '';
        },
      },
    ];
    return (
      <>
        <Drawer
          width="500px"
          title={detailList.name}
          closable={false}
          onClose={this.props.onClose}
          visible={visible}
        >
          <List
            dataSource={taskList}
            split={false}
            renderItem={item => (
              <List.Item key={item}>
                <Card hoverable style={{ width: '100%' }}>
                  <Avatar
                    // src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                    src={
                      item.processModelPicture ?
                        disk.downloadFiles(item.processModelPicture, { view: true }) : DefaultHeadPicture
                    }
                    size="large"
                    className={style.floatLeft}
                  />
                  <div className={style.FMLeft}>
                    <div>
                      <div className={style.floatLeft}>
                        <div>{item.code}</div>
                        <div className={style.name}>{item.name}</div>
                      </div>
                      <Tag className={style.version} color="green">
                        {item.taskModelVersion}
                      </Tag>
                    </div>
                    <div className={style.describe}>{item.describe}</div>
                  </div>

                  <div className={style.open}>
                    {openId.filter(i => i === item.id).length !== 0 ? (
                      <>
                        <a
                          onClick={() => this.showTable(item.id, 2)}
                          style={{ float: 'right' }}
                        >
                          收起
                          <UpOutlined />
                        </a>
                        <div className={style.taskExecRecordTable}>
                          <Table
                            size="small"
                            columns={columns}
                            rowKey="id"
                            dataSource={item.taskExecRecordList}
                            pagination={false}
                          />
                        </div>
                      </>
                    ) : (
                      <a onClick={() => this.showTable(item.id, 1)}>
                        展开
                        <DownOutlined />
                      </a>
                    )}
                  </div>
                </Card>
              </List.Item>
            )}
          />
        </Drawer>
        <Drawer
          title="参数"
          width={320}
          closable={false}
          onClose={this.onCloseParam}
          visible={visibleParam}
        >
          <List
            dataSource={parameterList}
            split={false}
            renderItem={item => (
              <List.Item key={item}>
                <Form>
                  <ModelType data={item} />
                </Form>
              </List.Item>
            )}
          />
        </Drawer>
      </>
    );
  }
}

export default connect(({ projectDetail }) => ({
  projectDetail,
}))(TaskList);

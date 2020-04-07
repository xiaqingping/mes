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
import { calculateTimeDifference, comparisonMerge } from '../../functions'
import style from './index.less';

class TaskList extends Component {

  state = {
    // selectedIds: [],      // 当前展开Table
    visibleTable: false,  // 执行记录表显示
    visibleParam: false,
    parameterList: [],
  };

  // 获取此页面需要用到的基础数据
  getCacheData = () => {};

  // 是否显示执行记录表
  showTable = (visible, id, type) => {
    const arr = [];
    if (type === 'true') arr.push(id);
    if (type === 'false') arr.filter(item => item !== id);
    console.log(arr);
    this.setState({
      visibleTable: visible,
      // selectedIds: arr,
    })
  }

  // 提示框 时间信息
  time = row => {
    if (row.status === 1) {
      return <span>未开始</span>
    } if (row.status === 4) {
      return (
        <>
          <span>开始：{row.beginDate}</span><br/>
          <span>结束：{row.endDate}</span>
        </>
      );
    }
    return <span>开始：{row.beginDate}</span>
  }

  // 查看任执行记录的参数
  searchParameter = row => {
    const valueData = row.taskExecRecordParamList;
    api.getTaskParam(row.taskModelId).then(res => {
      const paramData = [];
      // 第三级属性数据放置第二层数据中
      res.forEach((item, index) => {
        const newItem = JSON.parse(JSON.stringify(item));
        newItem.index = JSON.parse(JSON.stringify(index));
        newItem.paramProperties.forEach(e => {
          newItem[e.paramPropertyKey] = e.paramPropertyValue
        })
        paramData.push(newItem);
      })
      // 合并参数列表和参数值列表
      const parameterList = comparisonMerge(paramData, valueData);
      this.setState({ visibleParam: true, parameterList });
    })
  }

  // 任务执行记录开始运行
  startExecRecord = row => {
    console.log(row);
    api.startExecRecord(row.id).then(() => {
      this.props.onClose();
    })

  }

  // 任务执行记录暂停运行
  pauseExecRecord = row => {
    console.log(row);
    api.pauseExecRecord(row.id).then(() => {
      this.props.onClose();
    })
  }

  // 关闭二级抽屉
  onCloseParam = () => {
    this.setState({
      visibleParam: false
    })
  }

  render() {
    const {
      visibleTable,
      visibleParam,
      // selectedIds,
      parameterList,
    } = this.state;
    const { detailList, taskList, visible } = this.props;
    const { execRecordStatus } = this.props.projectDetail;

    const columns = [
      {
        title: '编号',
        dataIndex: 'code',
        width: 100,
        render: (value, row) =>(
          <>
            <span>{value}</span>
            <SlidersOutlined
              className={style.marginLeft}
              onClick={() => this.searchParameter(row)}
            />
          </>
        )
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
          )
        }
      },
      {
        title: '',
        dataIndex: 'status',
        width: 50,
        render: (value, row) => {
          const duration = calculateTimeDifference(row.startTime, row.endTime);
          if (value === 4) {
            return duration;
          } if (value === 1) {
            return <PauseCircleOutlined onClick={() => this.pauseExecRecord(row)}/>
          } if (value === 3) {
            return (
              <PlayCircleOutlined
                style={{color: '#1890ff'}}
                onClick={() => this.startExecRecord(row)}
              />
            )
          }
          return '';
        }
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
                <Card hoverable style={{ width: '100%' }} >
                  <Avatar
                    src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
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
                    {/* {visibleTable && selectedIds.indexOf(item.id) > -1 ? ( */}
                    {visibleTable? (
                      // <a onClick={() => this.showTable(false, item.id, 'fales')}>
                      <a onClick={() => this.showTable(!visibleTable)}>
                        收起<UpOutlined />
                      </a>
                    ) : (
                      <a onClick={() => this.showTable(!visibleTable)}>
                        展开<DownOutlined />
                      </a>
                    )}
                  </div>
                  {visibleTable? (
                    <>
                      <Table
                        size="small"
                        columns={columns}
                        rowKey='id'
                        dataSource={item.taskExecRecordList}
                        pagination={false}
                      />
                    </>
                  ) : (
                    ''
                  )}
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
                  <ModelType data={item}/>
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

import React, { useState } from 'react';
import { Drawer, Card, List, Avatar, Tag, Table, Badge, Tooltip } from 'antd';
import {
  DownOutlined, UpOutlined, SlidersOutlined, ClockCircleOutlined,
  PlayCircleOutlined, PauseCircleOutlined
} from '@ant-design/icons';
import { formatter } from '@/utils/utils';
import { connect } from 'dva';

/**
 * 计算时差 精确到时、分、秒
 * @param {String} startTime 开始时间
 * @param {String} endTime   结束时间
 */
const calculateTimeDifference = (startTime, endTime) => {
  // 时间差的毫秒数
  const date = new Date(endTime).getTime() - new Date(startTime).getTime();
  // 计算出小时数
  const leave1 = date%(24*3600*1000);
  const hours = Math.floor(date/(3600*1000));
  // 计算相差分钟数
  const leave2 = leave1%(3600*1000);         // 计算小时数后剩余的毫秒数
  const minutes = Math.floor(leave2/(60*1000));
  // 计算相差秒数
  const leave3 = leave2%(60*1000);           // 计算分钟数后剩余的毫秒数
  const seconds = Math.round(leave3/1000);
  if (hours === 0) {
    return `${minutes}m${seconds}s`;
  } if (hours === 0 && minutes === 0) {
    return `${seconds}s`;
  }
  return `${hours}h${minutes}m${seconds}s`;
}

/**
 * 执行记录表
 * @param {String} visible
 */
const ExecutionRecordTable = data => {
  const [open, setOpen] = useState(false);
  // 缓存数据
  const { execRecordStatus, taskList } = data.cacheList;
  // 时间信息提示内容
  const time = row => (
    <>
      <span>开始：{row.startTime}</span><br/>
      <span>结束：{row.endTime}</span>
    </>
  );

  const columns = [
    {
      title: '编号',
      dataIndex: 'code',
      width: 100,
      render: value =>(
        <>
          <span>{value}</span>
          <SlidersOutlined style={{ marginLeft: '10px' }} onClick={() => console.log(111)}/>
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
            <Tooltip title={time(row)}>
              <ClockCircleOutlined style={{ marginLeft: '10px' }} />
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
        if (value === '1') {
          return duration;
        } if (value === '2') {
          return <PauseCircleOutlined/>
        }
        return <PlayCircleOutlined style={{color: '#1890ff'}}/>
      }
    },
  ];
  return (
    <>
    <div style={{ float: 'right', marginLeft: '30px', fontSize: '14px' }}>
      {open ? (
        <a href="#" onClick={() => setOpen(!open)}>
          收起
          <UpOutlined />
        </a>
      ) : (
        <a onClick={() => setOpen(!open)}>
          展开
          <DownOutlined />
        </a>
      )}
    </div>
    {open ? (
        <Table
          size="small"
          columns={columns}
          dataSource={taskList}
          pagination={false}
        />
      ) : (
        ''
      )}
    </>
  )
}


/**
 * 任务列表抽屉
 * @param {String} visible  显示抽屉
 */
const DrawerTool = props => {

  // 关闭抽屉
  const onClose = () => {
    props.onClose();
  };

  const data = [
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    // 'Australian walks 100km after outback crash.',
    // 'Man charged over missing wedding girl.',
    // 'Los Angeles battles huge wildfires.',
  ]

  return (
    <div>
      <Drawer
        width="500px"
        title={props.detailValue.name}
        closable={false}
        onClose={onClose}
        visible={props.visible}
      >
        <List
          dataSource={data}
          split={false}
          renderItem={item => (
            <List.Item key={item}>
              <Card hoverable style={{ width: '100%' }} >
                <Avatar
                  src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                  style={{ float: 'left' }}
                  size="large"
                />
                <div style={{ float: 'left' }}>
                  <div>
                    <div style={{ float: 'left' }}>
                      <div>123123123333333333333</div>
                      <div style={{ width: '255px', height: '20px', wordWrap: 'break-word' }}>
                        肠道菌群宏基因组示例-demo2018-03-06
                      </div>
                    </div>
                    <Tag color="green" style={{ padding: '0 10px', float: 'right' }}>
                      V1.0
                    </Tag>
                  </div>
                  <div style={{ width: '340px', height: 'auto', wordWrap: 'break-word', marginTop: '10px', float: 'left' }}>
                    肠道菌群宏基因组示例 肠道菌群宏基因组示例 肠道菌群宏基因组示例 肠道菌群宏基因组示例
                  </div>
                </div>
                <ExecutionRecordTable cacheList={props.projectDetail}/>
              </Card>
            </List.Item>
          )}
        />
      </Drawer>
    </div>
  );
}

export default connect(({ projectDetail }) => ({
  projectDetail,
}))(DrawerTool);

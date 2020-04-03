import React, { useState } from 'react';
import { Drawer, Card, List, Avatar, Tag, Table, Badge, Tooltip } from 'antd';
import {
  DownOutlined, UpOutlined, SlidersOutlined, ClockCircleOutlined,
  PlayCircleOutlined, PauseCircleOutlined
} from '@ant-design/icons';
import { formatter } from '@/utils/utils';
import { connect } from 'dva';
// import api from '@/pages/project/api/projectManageDetail';
import { InputModel } from '@/pages/project/components/ModelComponents';
import style from './index.less';

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
 * 任务列表抽屉
 * @param {String} visible  显示抽屉
 */
const DrawerTool = props => {
  // 关闭抽屉
  const onClose = () => {
    props.onClose();
  };

  return (
    <div>
      <Drawer
        width="500px"
        title={props.detailList.name}
        closable={false}
        onClose={onClose}
        visible={props.visible}
      >
        <List
          dataSource={props.taskList}
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
                <ExecutionRecordTable
                  cacheList={props.projectDetail}
                  execRecordList={item.taskExecRecordList}
                  taskModelId={item.taskModelId}
                />
              </Card>
            </List.Item>
          )}
        />
      </Drawer>
    </div>
  );
}

/**
 * 执行记录表
 * @param {String} visible
 */
const ExecutionRecordTable = data => {
  const [open, setOpen] = useState(false);
  const [childrenDrawer, setChildrenDrawer] = useState(false);
  const [inputVisible, setShowIpnut] = useState(false);

  const { execRecordList, cacheList, taskModelId } = data;
  const { execRecordStatus } = cacheList;   // 缓存数据

  // 提示框 时间信息
  const time = row => {
    if (row.status === 1) {
      return ''
    } if (row.status === 4) {
      return (
        <>
          <span>开始：{row.beginDate}</span><br/>
          <span>结束：{row.endDate}</span>
        </>
      );
    }
    return (
        <>
          <span>开始：{row.beginDate}</span>
        </>
      );
  }
  const paramList = [
    {
      id: "c91703bdf38c4a49a4e8aab5aad927c8",
      paramKey: "xishiXX",
      paramValue: "123",
    },
    {
      id: "c91703bdf38c4a49a4e8aab5aad927c8",
      paramKey: "name",
      paramValue: "OTU阀值",
    }
  ];

  const resList = [
    {
      id: "b7389d7e1055405589c37ee44f2e19ca",
      paramId: "ef2b95abddf14a82a3841f4b59ebc4a2",
      paramKey: "xishiXX",
      paramName: "稀释小小",
      taskModelId: "0fb923c25c254cb3b4337b9a37eddf25",
      type: "input",
      paramProperties: [
        {
          id: "a605dcce00004fa2819efadb4846e7c9",
          paramId: "ef2b95abddf14a82a3841f4b59ebc4a2",
          paramPropertyDesc: "默认值",
          paramPropertyKey: "deafultValue",
          paramPropertyValue: "deafultValue",
        }
      ]
    },
    {
      id: "b7389d7e1055405589c37ee44f2e19ca",
      paramId: "ef2b95abddf14a82a3841f4b59ebc4a2",
      paramKey: "name",
      paramName: "名称",
      taskModelId: "0fb923c25c254cb3b4337b9a37eddf25",
      type: "input",
      paramProperties: [
        {
          id: "a605dcce00004fa2819efadb4846e7c9",
          paramId: "ef2b95abddf14a82a3841f4b59ebc4a2",
          paramPropertyDesc: "默认值",
          paramPropertyKey: "deafultValue",
          paramPropertyValue: "deafultValue",
        }
      ]
    }
  ];

  const newList = [];
  const ear = (arr1, arr2) => {
    arr1.forEach(item1 => {
      arr2.forEach(item2 => {
        const newitem = JSON.parse(JSON.stringify(item1));
        if (item1.paramKey === item2.paramKey) {
          newitem.paramKey = item2.paramKey;
          newList.push(newitem);
        }
      })
    })
  }

  // 查看任执行记录的参数
  const searchParameter = row => {
    console.log(row);
    console.log(taskModelId);
    // const paramList = row.taskExecRecordParamList
    // api.getTaskParam(taskModelId).then(res => {
    //   console.log(res);
    // })

    ear(resList, paramList);
    console.log(newList.type)
    if (newList.type === 'input') {
      setShowIpnut(true);
    }
    setChildrenDrawer(true)
  }

  const onChildrenDrawerClose = () => {
    setChildrenDrawer(false)
  };

  const columns = [
    {
      title: '编号',
      dataIndex: 'code',
      width: 100,
      render: (value, row) =>(
        <>
          <span>{value}</span>
          <SlidersOutlined className={style.marginLeft} onClick={() => searchParameter(row)}/>
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
    <div className={style.open}>
      {open ? (
        <a href="#" onClick={() => setOpen(!open)}>收起<UpOutlined /></a>
      ) : (
        <a onClick={() => setOpen(!open)}>展开<DownOutlined /></a>
      )}
    </div>
    {open ? (
        <>
          <Table
            size="small"
            columns={columns}
            rowKey='id'
            dataSource={execRecordList}
            pagination={false}
          />
            <Drawer
              title="参数"
              width={320}
              closable={false}
              onClose={onChildrenDrawerClose}
              visible={childrenDrawer}
            >
              {inputVisible ? (<InputModel data={resList} />) : ('')}
            </Drawer>
        </>
      ) : (
        ''
      )}
    </>
  )
}

export default connect(({ projectDetail }) => ({
  projectDetail,
}))(DrawerTool);

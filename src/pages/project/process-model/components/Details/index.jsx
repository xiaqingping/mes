import React, { useState } from 'react';
import { Tooltip, Drawer, Avatar, Tag, List, Card, Badge } from 'antd';
import {
  QuestionCircleOutlined,
  DownOutlined,
  UpOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { formatter } from '@/utils/utils';
import './index.less';
import api from '@/pages/project/api/taskmodel';

/**
 * 问号的说明作用
 * @param {String} title 说明内容
 */
const MarkTool = props => (
  <Tooltip title={props.title}>
    <span>
      <QuestionCircleOutlined style={{ fontSize: props.size }} />
    </span>
  </Tooltip>
);

/**
 * 抽屉的使用
 * @param {String} visible 显示抽屉
 */
const DrawerTool = props => {
  // 二级抽屉
  const [childrenDrawer, setChildrenDrawer] = useState(false);
  // 展开和收起
  const [open, setOpen] = useState(false);
  // 一级抽屉
  const [visable, setVisable] = useState(false);
  // 选择版本
  const [selectVersion, setSelectVersion] = useState('');
  // 查看前置任务
  const [task, setTask] = useState([]);
  // 任务名称，用于二级抽屉的名称显示
  const [taskName, setTaskName] = useState();
  const { status = [], detailValue } = props;

  const onClose = () => {
    setSelectVersion('');
    setVisable(false);
    props.onClose();
  };

  const CollapseTool = value => (
    <div style={{ marginTop: '25px' }}>
      <Avatar
        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        style={{ float: 'left' }}
        size="large"
      />
      {/* 选择版本 */}
      <div style={{ float: 'left' }}>
        <div>
          {value.code}
          <div style={{ position: 'relative', display: 'inline-block', marginLeft: '30px' }}>
            <Tag
              color="default"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setVisable(!visable);
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
                        color={item === value.version ? 'green' : 'default'}
                        key={item}
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          if (item !== value.version) {
                            props.handleChangeVersion({ code: value.code, version: item });
                          }
                          setVisable(!visable);
                          setSelectVersion(item);
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
            <div style={{ float: 'right', marginLeft: '25px', marginTop: ' 3px' }}>
              <SettingOutlined />
            </div>
          </div>
        </div>
        <div style={{ width: '255px', height: '50px', wordWrap: 'break-word' }}>{value.name}</div>
      </div>

      <div style={{ float: 'right', marginLeft: '30px', fontSize: '14px' }}>
        {value.status === 2 ? <div style={{ color: 'red', marginBottom: '20px' }}>禁用</div> : ''}
        <div>
          {open ? (
            <a href="#" onClick={() => setOpen(!open)}>
              收起
              <DownOutlined />
            </a>
          ) : (
            <a href="#" onClick={() => setOpen(!open)}>
              展开
              <UpOutlined />
            </a>
          )}
        </div>
      </div>
      {/* <div style={{ float: 'right' }}>
          <Tag color="green" style={{ padding: '0 10px' }}>
            V1.0
          </Tag>
        </div> */}
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

  // 弹出二级抽屉
  const showChildrenDrawer = item => {
    setTaskName(item.name);
    api.getPreTasks(item.id).then(res => {
      setTask(res);
    });
    setChildrenDrawer(true);
  };

  const onChildrenDrawerClose = () => {
    setChildrenDrawer(false);
  };
  return (
    <div>
      <Drawer
        title={CollapseTool(detailValue)}
        width={500}
        closable={false}
        onClose={onClose}
        visible={props.visible}
        className="drawer-style"
      >
        <List
          rowKey="id"
          dataSource={detailValue.taskModels}
          renderItem={item => (
            <List.Item key={item}>
              <Card hoverable style={{ width: '470px', height: '240px' }}>
                <Avatar
                  src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                  style={{ float: 'left' }}
                  size="large"
                />
                <div style={{ float: 'left' }}>
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
                        <a onClick={() => showChildrenDrawer(item)}>查看</a>
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
                    <div style={{ float: 'left', width: '80%' }}>{item.describe}</div>
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
          onClose={onChildrenDrawerClose}
          visible={childrenDrawer}
        >
          <List
            rowKey="id"
            dataSource={task}
            renderItem={item => (
              <List.Item key={item}>
                <Card hoverable style={{ width: '470px', height: '240px' }}>
                  <Avatar
                    src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                    style={{ float: 'left' }}
                    size="large"
                  />
                  <div style={{ float: 'left' }}>
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
      </Drawer>
    </div>
  );
};

export { MarkTool, DrawerTool };

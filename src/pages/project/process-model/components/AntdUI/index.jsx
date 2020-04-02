import React, { useState, useEffect } from 'react';
import { Tooltip, Drawer, Avatar, Tag, List, Card, Badge } from 'antd';
import { QuestionCircleOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { formatter } from './node_modules/@/utils/utils';
import api from './node_modules/@/pages/project/api/processModel';
import './index.less';

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

const CollapseTool = value => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginTop: '25px' }}>
      <Avatar
        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        style={{ float: 'left' }}
        size="large"
      />
      <div style={{ float: 'left' }}>
        <div>123123123333333333333</div>
        <div style={{ width: '255px', height: '50px', wordWrap: 'break-word' }}>
          肠道菌群宏基因组示例-demo2018-03-06
        </div>
      </div>

      <div style={{ float: 'right', marginLeft: '30px', fontSize: '14px' }}>
        <div style={{ color: 'red', marginBottom: '20px' }}>禁用</div>
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
      <div style={{ float: 'right' }}>
        <Tag color="green" style={{ padding: '0 10px' }}>
          V1.0
        </Tag>
      </div>
      {open ? (
        <div style={{ marginLeft: '40px', color: '#858585', fontSize: '14px' }}>
          <div style={{ clear: 'both', marginTop: '36px' }}>某某某发布人</div>
          <div style={{ marginBottom: '20px' }}>(2017-01-12 13:55:34)</div>
          <div style={{ width: '400px' }}>
            该任务旨在分析肠道微生物与肥胖之间的关系。本次实验分析共，该任务旨在分析肠道微生物与肥胖之间的关系。
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

/**
 * 抽屉的使用
 * @param {String} visible 显示抽屉
 */
const DrawerTool = props => {
  const [childrenDrawer, setChildrenDrawer] = useState(false);
  const { status = [] } = props;

  const onClose = () => {
    props.onClose();
  };

  useEffect(() => {});

  // 弹出二级抽屉
  const showChildrenDrawer = () => {
    setChildrenDrawer(true);
  };

  const onChildrenDrawerClose = () => {
    setChildrenDrawer(false);
  };

  return (
    <div>
      <Drawer
        title={CollapseTool(props.detailValue)}
        width={500}
        closable={false}
        onClose={onClose}
        visible={props.visible}
        className="drawer-style"
      >
        <List
          rowKey="id"
          dataSource={[123, 3, 4, 56]}
          renderItem={item => (
            <List.Item key={item}>
              <Card hoverable style={{ width: '470px', height: '240px' }}>
                <Avatar
                  src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                  style={{ float: 'left' }}
                  size="large"
                />
                <div style={{ float: 'left' }}>
                  <div>123123123333333333333</div>
                  <div style={{ width: '255px', height: '50px', wordWrap: 'break-word' }}>
                    肠道菌群宏基因组示例-demo2018-03-06
                  </div>
                </div>
                <Tag color="green" style={{ padding: '0 10px', float: 'right' }}>
                  V1.0
                </Tag>
                <div style={{ clear: 'both' }}>
                  <div>
                    <span>前置任务: </span>
                    <span style={{ marginLeft: '15px' }}>
                      <a onClick={showChildrenDrawer}>查看</a>
                    </span>
                  </div>
                  <div style={{ margin: '8px 0' }}>
                    <span>状态: </span>
                    <span style={{ marginLeft: '45px' }}>
                      <Badge
                        status={formatter(status, 2, 'value', 'status')}
                        text={formatter(status, 2, 'value', 'text')}
                      />
                    </span>
                  </div>
                  <div>
                    <div style={{ float: 'left', width: '20%' }}>描述: </div>
                    <div style={{ float: 'left', width: '80%' }}>
                      该任务旨在分析肠道微生物与肥胖之该任务旨在分析肠道微生物与肥胖之该任务旨在分析肠道微生物与肥胖之
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
          title={CollapseTool(props.detailValue)}
          width={500}
          closable={false}
          onClose={onChildrenDrawerClose}
          visible={childrenDrawer}
        >
          <List
            rowKey="id"
            dataSource={[123, 3, 4, 56]}
            renderItem={item => (
              <List.Item key={item}>
                <Card hoverable style={{ width: '470px', height: '240px' }}>
                  <Avatar
                    src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                    style={{ float: 'left' }}
                    size="large"
                  />
                  <div style={{ float: 'left' }}>
                    <div>123123123333333333333</div>
                    <div style={{ width: '255px', height: '50px', wordWrap: 'break-word' }}>
                      肠道菌群宏基因组示例-demo2018-03-06
                    </div>
                  </div>
                  <Tag color="green" style={{ padding: '0 10px', float: 'right' }}>
                    V1.0
                  </Tag>
                  <div style={{ clear: 'both' }}>
                    <div>
                      <span>前置任务: </span>
                      <span style={{ marginLeft: '15px' }}>无</span>
                    </div>
                    <div style={{ margin: '8px 0' }}>
                      <span>状态: </span>
                      <span style={{ marginLeft: '45px' }}>
                        <Badge
                          status={formatter(status, 2, 'value', 'status')}
                          text={formatter(status, 2, 'value', 'text')}
                        />
                      </span>
                    </div>
                    <div>
                      <div style={{ float: 'left', width: '20%' }}>描述: </div>
                      <div style={{ float: 'left', width: '80%' }}>
                        该任务旨在分析肠道微生物与肥胖之该任务旨在分析肠道微生物与肥胖之该任务旨在分析肠道微生物与肥胖之
                      </div>
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

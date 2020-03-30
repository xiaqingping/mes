import React, { useState } from 'react';
import { Tooltip, Button, Drawer, Collapse } from 'antd';
import { QuestionCircleOutlined, CaretRightOutlined } from '@ant-design/icons';
import './index.less';

const { Panel } = Collapse;
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

const CollapseTool = value => (
  <Collapse
    expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
    bordered={false}
    style={{ margin: 0 }}
  >
    <Panel header={`${value.code}/${value.name}`} style={{ border: 'none' }}>
      <p>12312312</p>
    </Panel>
  </Collapse>
);

/**
 * 抽屉的使用
 * @param {String} visible 显示抽屉
 */
const DrawerTool = props => {
  const [childrenDrawer, setChildrenDrawer] = useState(false);

  const onClose = () => {
    props.onClose();
  };

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
        width={520}
        closable={false}
        onClose={onClose}
        visible={props.visible}
        className="drawer-style"
      >
        <Button type="primary" onClick={showChildrenDrawer}>
          Two-level drawer
        </Button>
        <Drawer
          title="Two-level Drawer"
          width={320}
          closable={false}
          onClose={onChildrenDrawerClose}
          visible={childrenDrawer}
        >
          This is two-level drawer
        </Drawer>
      </Drawer>
    </div>
  );
};

export { MarkTool, DrawerTool };

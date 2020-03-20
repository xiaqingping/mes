import React from 'react';
import { Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

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

export { MarkTool };

import React from 'react';
import { Table } from 'antd';
import './index.less';
/**
 * // 创建子表格
 * @param {Array} value 资源数据
 * @param {Array} columns  表格title的字段
 */
const expandedRowRender = (value, columns) => (
  <Table
    className="setSonTable"
    columns={columns}
    dataSource={value}
    pagination={false}
    rowKey={value.rowKey || 'id'}
    style={{ marginLeft: '20px' }}
  />
);

export { expandedRowRender };

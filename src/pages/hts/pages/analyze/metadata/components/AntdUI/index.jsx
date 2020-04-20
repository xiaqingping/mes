// import React, { useState } from 'react';
import React from 'react';
import { Table, Card } from 'antd';
// import style from './index.less';

/**
 * 表格组件
 */
const TableModel = props => (
  <Card bordered={false} title={props.title} style={{ marginBottom: 30 }}>
    <Table
      // scroll={{ x: tableWidth, y: 400 }}
      rowKey="id"
      loading={props.loading}
      pagination={false}
      columns={props.columns}
      dataSource={props.data}
    />
  </Card>
);

export { TableModel };

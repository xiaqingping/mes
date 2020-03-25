import React from 'react';
import { Table, List, Card, Avatar, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
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

/**
 * // 创建list列表
 * @param {Object} item 资源数据
 */
const renderItemList = item => (
  <List.Item>
    {item.title ? (
      <Card hoverable style={{ width: '300px', height: '200px ' }}>
        <Card.Meta
          avatar={<Avatar size={50} src={item.src} />}
          title={
            <>
              <div>{item.title}</div>
              <Tag color="success">success</Tag>
            </>
          }
        />
        <br />
        <div>{item.content}</div>
      </Card>
    ) : (
      <Card
        hoverable
        onClick={() => {
          console.log(123);
        }}
        style={{
          width: '300px',
          height: '200px ',
          borderImage: 'border-image-source slice-width{1,4}',
          border: '1px dashed #E1E1E1',
          textAlign: 'center',
          lineHeight: '150px',
          fontSize: '18px',
        }}
      >
        <PlusOutlined />
        &nbsp;&nbsp;自定义
      </Card>
    )}
  </List.Item>
);

export { expandedRowRender, renderItemList };

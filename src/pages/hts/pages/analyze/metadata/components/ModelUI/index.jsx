import React from 'react';
import { Drawer, Table, List } from 'antd';

/**
 * 参数列表抽屉
 * @param {String} visible 是否显示
 */
const ParamDrawer = props => {
  const { data } = props;

  return (
    <Drawer
      title="参数"
      width={500}
      placement="right"
      closable={false}
      onClose={props.onClose}
      visible={props.visible}
    >
      {/* {data.forEach(item=> {
        console.log(item.paramKey);
        console.log(item.paramValue);
        return (
          <p>{item.paramKey}: {item.paramValue}</p>
        )
      })} */}
      <List
        bordered={false}
        dataSource={data}
        renderItem={item => (
          <List.Item>
            <div style={{ float: 'left', width: 60 }}>
              {item.paramKey} :
            </div>
            <div style={{ float: 'right', width: 400, height: 'auto' }}>
              {item.paramValue}
            </div>
          </List.Item>
        )}
      />
    </Drawer>
  )
}

/**
 * 序列文件抽屉
 * @param {String} visible 是否显示
 */
const FieldDrawer = props => {
  const columns = [
    {
      title: '文件',
      dataIndex: 'name',
    },
    {
      title: '序列',
      dataIndex: 'sequence',
    },
    {
      title: '长度',
      dataIndex: 'length',
    },
  ];
  return (
    <Drawer
      title="序列文件"
      width={500}
      placement="right"
      closable={false}
      onClose={props.onClose}
      visible={props.visible}
    >
      <Table
        rowKey="id"
        pagination={false}
        columns={columns}
        dataSource={props.data}
      />
    </Drawer>
  )
}

export { ParamDrawer, FieldDrawer };

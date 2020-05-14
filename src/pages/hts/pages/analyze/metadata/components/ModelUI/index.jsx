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
      <List
        bordered={false}
        dataSource={data}
        rowKey="id"
        renderItem={item => (
          <List.Item>
            <div style={{ float: 'left', width: 60 }}>{item.paramKey} :</div>
            <div style={{ float: 'right', width: 400, height: 'auto' }}>{item.paramValue}</div>
          </List.Item>
        )}
      />
    </Drawer>
  );
};

/**
 * 序列文件抽屉
 * @param {String} visible 是否显示
 */
const FieldDrawer = props => {
  const columns = [
    {
      title: '文件',
      dataIndex: 'sequenceFileName',
      key: 'sequenceFileName',
    },
    {
      title: '序列',
      dataIndex: 'sampleSequenceCount',
      key: 'sampleSequenceCount',
      render: (value, row) => (
        <>
          {value} ({row.sampleLengthTotal}bp)
        </>
      ),
    },
    {
      title: '长度',
      dataIndex: 'sampleLengthAve',
      key: 'sampleLengthAve',
      render: (value, row) => (
        <>
          {row.sampleLengthMin} - {row.sampleLengthMax} (avg {value})
        </>
      ),
    },
  ];
  return (
    <Drawer
      title="序列文件"
      width={500}
      placement="right"
      closable={false}
      rowKey="id"
      onClose={props.onClose}
      visible={props.visible}
    >
      <Table
        // rowKey="id"
        pagination={false}
        columns={columns}
        dataSource={props.data}
      />
    </Drawer>
  );
};

export { ParamDrawer, FieldDrawer };

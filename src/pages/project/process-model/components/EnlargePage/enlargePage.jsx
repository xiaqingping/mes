// 参数变大
import React from 'react';
import { Modal, List, Card } from 'antd';
import { ShrinkOutlined } from '@ant-design/icons';

const EnlargePage = props => {
  const titleContent = item => {
    console.log(item);
    return (
      <>
        <div>{item.groupName}</div>
        <div style={{ fontSize: '14px', color: 'rgba(0,0,0,0.45)' }}>{item.groupDescribe}</div>
      </>
    );
  };
  return (
    <Modal
      title={titleContent(props.typeEnlargeData)}
      visible={props.visible}
      onCancel={props.handleBigClose}
      footer={null}
      mask={false}
      maskClosable={false}
      width={560}
      closeIcon={<ShrinkOutlined />}
      style={{ top: 180, right: 115 }}
    >
      <List
        rowKey="id"
        style={{ height: '350px', overflowY: 'auto' }}
        dataSource={props.typeEnlargeData.params}
        renderItem={item => (
          <List.Item key={item.id}>
            <Card hoverable>
              <div>
                <div>{item.paramName}</div>
              </div>
            </Card>
          </List.Item>
        )}
        className="list-style card-item-style"
        split={false}
      />
    </Modal>
  );
};

export default EnlargePage;

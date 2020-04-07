import React from 'react';
import { Modal, List, Card } from 'antd';
import { ShrinkOutlined } from '@ant-design/icons';

const EnlargePage = props => (
  <Modal
    title={props.typeEnlargeData}
    visible={props.visible}
    onCancel={props.handleBigClose}
    footer={null}
    mask={false}
    maskClosable={false}
    width={550}
    closeIcon={<ShrinkOutlined />}
    style={{ top: 180, right: 120 }}
  >
    <List
      rowKey="id"
      style={{ height: '350px', overflowY: 'auto' }}
      dataSource={[123, 3, 4, 56, 55345345, 65645, 4232]}
      renderItem={item => (
        <List.Item key={item}>
          <Card hoverable>
            <div>
              <div>{item}</div>
            </div>
          </Card>
        </List.Item>
      )}
      className="list-style card-item-style"
      split={false}
    />
  </Modal>
);

export default EnlargePage;

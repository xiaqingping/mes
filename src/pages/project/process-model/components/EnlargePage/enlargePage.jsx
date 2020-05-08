/**
 * 参数分类点击以后变大显示页面
 * @param {boolean} visible 显示或者隐藏
 * @param {Function} handleBigClose 关闭
 * @param {object} typeEnlargeData 详情的数据
 */
import React from 'react';
import { Modal, List, Card, Button } from 'antd';
import { ShrinkOutlined } from '@ant-design/icons';

const EnlargePage = props => {
  /**
   * 标题的样式
   * @param {object} item 详情的数据
   */
  const titleContent = item => (
    <>
      <span>{item.groupName}</span>
      <Button
        icon={<ShrinkOutlined />}
        style={{ border: 'none', float: 'right', marginRight: '-10px', marginTop: '-10px' }}
        onClick={props.handleBigClose}
      />
      <div style={{ fontSize: '14px', color: 'rgba(0,0,0,0.45)' }}>{item.groupDescribe}</div>
    </>
  );
  return (
    <Modal
      title={titleContent(props.typeEnlargeData)}
      visible={props.visible}
      footer={null}
      mask={false}
      maskClosable={false}
      width={560}
      closable={false}
      style={{ top: 180, right: 115 }}
    >
      <List
        rowKey="id"
        style={{ height: '312px', overflowY: 'auto' }}
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
        className="card-item-style"
        split={false}
      />
    </Modal>
  );
};

export default EnlargePage;

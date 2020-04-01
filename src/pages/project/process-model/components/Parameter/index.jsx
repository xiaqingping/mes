import React from 'react';
import { Modal, List, Card, Button } from 'antd';
import { ArrowsAltOutlined } from '@ant-design/icons';
import EnlargePage from './enlargePage';
import './index.less';
// import { sortable } from 'react-sortable';

class Parameter extends React.Component {
  static getDerivedStateFromProps(nextProps) {
    return { visible: nextProps.visible || false };
  }

  state = {
    // activeId: null,
    visible: false,
    typeEnlargeVisible: false,
    typeEnlargeData: [],
    moveType: 0,
    data: [
      { title: 'a', data: [1, 2, 3, 4, 5, 6] },
      { title: 'b', data: [111, 211, 3111, 41, 51, 61] },
      { title: 'c', data: [12, 22, 32, 42, 52, 62] },
      { title: 'd', data: [13, 23, 33, 43, 53, 63] },
      { title: 'e', data: [14, 24, 34, 44, 54, 64] },
    ],
  };

  // 分类变大打开
  handleBigOpen = item => {
    this.setState({ typeEnlargeVisible: true, typeEnlargeData: item });
  };

  // 分类变大关闭
  handleBigClose = () => {
    this.setState({ typeEnlargeVisible: false });
  };

  titleContent = item => (
    <div style={{ padding: '0' }}>
      {`大${item}`}
      <Button
        icon={<ArrowsAltOutlined />}
        style={{ border: 'none', float: 'right', marginRight: '10px' }}
        onClick={() => {
          this.handleBigOpen(item);
        }}
      />
    </div>
  );

  dragStart = (item, items) => {
    this.setState({
      moveType: items,
    });
    console.log(item, items);
  };

  // 拖拽元素经过放置元素时
  dragOver = e => {
    e.preventDefault(); // 此处的代码是必须的  不然无法拖拽
    // console.log('拖拽中');
  };

  // 拖拽元素放到放置元素时
  drop = item => {
    // if (!item) {
    //   this.setState({
    //     moveType: 1,
    //   });
    // }
    // 放置之后的后续操作
    console.log(item);
  };

  render() {
    const { handleClose } = this.props;
    const { visible, typeEnlargeVisible, typeEnlargeData, moveType, data } = this.state;
    // const { onDragStart, cancelSelect } = this;
    return (
      <Modal
        title="参数"
        visible={visible}
        onOk={this.handleOk}
        onCancel={handleClose}
        width={871}
        footer={null}
        className="parameter-style"
      >
        <div
          style={{
            width: '630px',
            height: '500px',
            borderRight: '2px solid #E8E8E8',
            borderTop: '2px solid #E8E8E8',
            padding: '24px 0 24px 30px',
            display: 'inline-block',
            overflowY: 'auto',
          }}
        >
          {/* type列表 */}
          <List
            rowKey="id"
            dataSource={data}
            grid={{
              column: 2,
            }}
            renderItem={item => (
              <List.Item key={item}>
                <Card
                  title={this.titleContent(item.title)}
                  hoverable
                  style={{ width: '269px', height: '203px' }}
                  draggable
                  onDrop={() => this.drop(item)}
                  onDragOver={e => this.dragOver(e)}
                  onDragStart={() => this.dragStart(item, 3)}
                >
                  <div>
                    {item.data.map(v => (
                      <Card hoverable key={v} style={{ float: 'left', margin: '10px' }}>
                        <div
                          onDrop={() => this.drop(v)}
                          onDragOver={e => this.dragOver(e)}
                          draggable
                          onDragStart={() => this.dragStart(v, 1)}
                        >
                          {v}
                        </div>
                      </Card>
                    ))}
                  </div>
                </Card>
              </List.Item>
            )}
            className="list-style card-item-style"
            split={false}
          />
        </div>
        <div
          style={{
            width: '241px',
            height: '500px',
            borderTop: '2px solid #E8E8E8',
            padding: '24px 0 24px 30px',
            display: 'inline-block',
            overflowY: 'auto',
          }}
          onDrop={() => this.drop('未分组')}
          onDragOver={e => this.dragOver(e)}
        >
          {/* item列表 */}
          <List
            rowKey="id"
            dataSource={[123, 3, 4, 56, 55345345, 65645, 4232]}
            renderItem={item => (
              <List.Item key={item}>
                <Card hoverable>
                  <div>
                    <div draggable onDragStart={() => this.dragStart(item, 1)}>
                      {item}
                    </div>
                  </div>
                </Card>
              </List.Item>
            )}
            className="list-style card-item-style"
            split={false}
          />
        </div>
        <EnlargePage
          visible={typeEnlargeVisible}
          handleBigClose={this.handleBigClose}
          typeEnlargeData={typeEnlargeData}
        />
      </Modal>
    );
  }
}

export default Parameter;

import React from 'react';
import { Modal, List, Card, Button } from 'antd';
import { ArrowsAltOutlined, PlusOutlined } from '@ant-design/icons';
import EnlargePage from './enlargePage';
import AddGroup from './addGroup';
import './index.less';
// import { sortable } from 'react-sortable';

class Parameter extends React.Component {
  static getDerivedStateFromProps(nextProps) {
    return { visible: nextProps.visible || false, data: nextProps.paramter };
  }

  state = {
    // activeId: null,
    visible: false,
    typeEnlargeVisible: false,
    typeEnlargeData: [],
    addGroupVisible: false,
    moveType: 0,
    moveElement: null,
    moveIndex: 0,
    data: [],
  };

  // 分类变大打开
  handleBigOpen = item => {
    this.setState({ typeEnlargeVisible: true, typeEnlargeData: item });
  };

  // 分类变大关闭
  handleBigClose = () => {
    this.setState({ typeEnlargeVisible: false });
  };

  // 添加组分类打开
  handleAddGroup = () => {
    this.setState({ addGroupVisible: true });
  };

  // 关闭组分类
  handleCloseGroup = (v, type) => {
    const { data } = this.state;
    if (type) {
      const newData = data;
      newData.push({
        sortNo: '',
        groupName: v.groupName,
        groupDesc: v.groupDesc,
        params: [],
      });
      this.setState({
        data: newData,
      });
    }
    this.setState({ addGroupVisible: false });
  };

  titleContent = (item, index) => (
    <div
      style={{ padding: '0' }}
      draggable
      onDragStart={() => this.dragStartType(item, 2, index + 1)}
    >
      {item.groupName}
      <Button
        icon={<ArrowsAltOutlined />}
        style={{ border: 'none', float: 'right', marginRight: '10px' }}
        onClick={() => {
          this.handleBigOpen(item);
        }}
      />
      <br />
      <div
        style={{
          width: '220px',
          fontWeight: '200',
          marginTop: '5px',
        }}
      >
        {item.groupDesc}
      </div>
    </div>
  );

  /**
   * 开始拖动的对象
   * @param {Object} item 开始拖动的元素
   * @param {Int} type 元素的类型 1.元素  2.分类
   * @param {Int} index 元素移动的分类项键
   */
  dragStart = (item, type, index = null) => {
    if (type === 1) {
      this.setState({
        moveType: type,
        moveElement: item,
        moveIndex: index,
      });
    }
  };

  /**
   * 开始拖动的对象
   * @param {Object} item 开始拖动的元素
   * @param {Int} type 元素的类型 1.元素  2.分类
   * @param {Int} index 元素移动的分类项键
   */
  dragStartType = (item, type, index = null) => {
    this.setState({
      moveType: type,
      moveElement: item,
      moveIndex: index,
    });
  };

  // 拖拽元素经过放置元素时
  dragOver = e => {
    e.preventDefault(); // 此处的代码是必须的  不然无法拖拽
    // console.log('拖拽中');
  };

  /**
   * 拖到的对象
   * @param {Object} item 拖到的元素
   * @param {Int} type 元素的类型 1.元素  2.分类
   * @param {Int} index 元素的位置
   */
  drop = (value, type, index) => {
    const { data, moveType, moveElement, moveIndex } = this.state;
    const newData = data;
    // console.log(data);
    // 拖动的是元素放入分类，或者元素排序变更
    if (moveType === 1) {
      // 拖到具体分类
      if (type === 2) {
        // console.log(value, moveElement);
        // console.log(value.params.filter(item => item.paramId === moveElement.paramId).length);
        if (value.params.filter(item => item.paramId === moveElement.paramId).length === 0) {
          // 添加到新对象里
          newData.forEach((item, i) => {
            if (item.groupName === value.groupName) {
              newData[i].params.push(moveElement);
            }
          });
          console.log(moveIndex);
          // 把移动过的对象删除
          newData[moveIndex].params = newData[moveIndex].params.filter(
            item => item !== moveElement,
          );
        }
      }

      // 数据排序
      if (type === 1) {
        let move = 0;
        let old = 0;
        let typeIndex = 0;
        data.forEach((item, ind) => {
          item.params.forEach((i, sindex) => {
            if (i === moveElement) {
              move = sindex;
              typeIndex = ind;
            }

            if (i === value) {
              old = sindex;
            }
          });
        });
        if (typeof move === 'number' && typeof old === 'number' && typeof typeIndex === 'number') {
          newData[typeIndex].params.splice(move, 1, value);
          newData[typeIndex].params.splice(old, 1, moveElement);
        }
      }

      this.setState({
        data: newData,
      });
    }
    if (moveType === 2) {
      newData[moveIndex] = value;
      newData[index] = moveElement;
      this.setState({
        data: newData,
      });
    }
  };

  render() {
    const { visible, typeEnlargeVisible, typeEnlargeData, addGroupVisible, data } = this.state;

    if (!data) return false;
    if (!data.filter(item => item.groupName === 'no')[0]) {
      return false;
    }
    return (
      <Modal
        title="参数"
        visible={visible}
        onCancel={() => this.props.handleClose(data)}
        width={871}
        footer={null}
        className="parameter-style desc-title-style"
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
            position: 'relative',
          }}
        >
          <EnlargePage
            visible={typeEnlargeVisible}
            handleBigClose={this.handleBigClose}
            typeEnlargeData={typeEnlargeData}
          />
          <AddGroup
            visible={addGroupVisible}
            handleCloseGroup={(v, type = '') => this.handleCloseGroup(v, type)}
          />

          {/* 分组列表 */}
          <List
            style={{ float: 'left' }}
            rowKey="id"
            dataSource={
              data.filter(item => item.groupName !== 'no').length === 0
                ? ['noData']
                : data.filter(item => item.groupName !== 'no')
            }
            grid={{
              column: 2,
            }}
            renderItem={(item, index) => {
              if (item === 'noData') {
                return (
                  <Button
                    style={{
                      width: '269px',
                      height: '234px',
                      float: 'left',
                      padding: 0,
                      margin: '0 10px',
                    }}
                    type="dashed"
                    onClick={this.handleAddGroup}
                    icon={<PlusOutlined />}
                  >
                    新增
                  </Button>
                );
              }
              return (
                <>
                  {/* 新增卡片 */}
                  {index === 0 ? (
                    <Button
                      style={{
                        width: '269px',
                        height: '234px',
                        float: 'left',
                        padding: 0,
                        margin: '0 10px',
                      }}
                      type="dashed"
                      onClick={this.handleAddGroup}
                      icon={<PlusOutlined />}
                    >
                      新增
                    </Button>
                  ) : (
                    ''
                  )}

                  {/* {item.paramId ? (
                    <List.Item key={item.paramId}>
                      <Card hoverable>
                        <div>
                          <div draggable onDragStart={() => this.dragStart(item, 1, 0)}>
                            {item.paramName}
                          </div>
                        </div>
                      </Card>
                    </List.Item>
                  ) : (
                    <div />
                  )} */}
                  <List.Item key={index}>
                    <Card
                      title={this.titleContent(item, index)}
                      hoverable
                      style={{ width: '269px', height: '234px' }}
                      onDrop={() => this.drop(item, 2, index + 1)}
                      onDragOver={e => this.dragOver(e)}
                    >
                      {data.filter(i => i.groupName !== 'no').length === 0 ? (
                        ''
                      ) : (
                        <div>
                          {item.params.map(v =>
                            v.paramId ? (
                              <Card
                                hoverable
                                key={v.paramId}
                                style={{
                                  float: 'left',
                                  margin: '10px',
                                }}
                              >
                                <div
                                  onDrop={() => this.drop(v, 1)}
                                  // onDragOver={e => this.dragOver(e)}
                                  draggable
                                  onDragStart={() => this.dragStart(v, 1, index + 1)}
                                >
                                  {v.paramName}
                                </div>
                              </Card>
                            ) : (
                              <div key={v.paramId} />
                            ),
                          )}
                        </div>
                      )}
                    </Card>
                  </List.Item>
                </>
              );
            }}
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
          onDrop={() => this.drop(data.filter(item => item.groupName === 'no')[0], 2)}
          onDragOver={e => this.dragOver(e)}
        >
          {/* 未分组列表 */}
          <List
            rowKey="id"
            dataSource={data.filter(item => item.groupName === 'no')[0].params}
            renderItem={item =>
              item.paramId ? (
                <List.Item key={item.paramId}>
                  <Card hoverable>
                    <div>
                      <div draggable onDragStart={() => this.dragStart(item, 1, 0)}>
                        {item.paramName}
                      </div>
                    </div>
                  </Card>
                </List.Item>
              ) : (
                <div />
              )
            }
            className="list-style card-item-style"
            split={false}
          />
        </div>
      </Modal>
    );
  }
}

export default Parameter;

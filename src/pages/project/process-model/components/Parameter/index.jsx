/**
 * 参数拖动页面
 * @param {boolean} visible 是否显示隐藏
 * @param {Function} handleClose 关闭页面方法
 * @param {Array} paramter 参数
 */
import React from 'react';
import { Modal, List, Card, Button, message } from 'antd';
import { ArrowsAltOutlined, PlusOutlined } from '@ant-design/icons';
import EnlargePage from '../EnlargePage/enlargePage';
// import AddGroup from '../AddGroup/addGroup';
import './index.less';

class Parameter extends React.Component {
  static getDerivedStateFromProps(nextProps) {
    return { visible: nextProps.visible || false, data: nextProps.paramter };
  }

  state = {
    // activeId: null,
    visible: false,
    typeEnlargeVisible: false,
    typeEnlargeData: [],
    // addGroupVisible: false,
    moveType: 0,
    moveElement: null,
    moveIndex: 0,
    data: [],
    moveTitleId: null,
    moveDescId: null,
  };

  /**
   * 分类变大打开
   * @param {object} item 当前选择变大的对象
   */
  handleBigOpen = item => {
    this.setState({ typeEnlargeVisible: true, typeEnlargeData: item });
  };

  /** 分类变大关闭 */
  handleBigClose = () => {
    this.setState({ typeEnlargeVisible: false });
  };

  /** 添加组分类打开 */
  handleAddGroup = () => {
    const { data } = this.state;
    const newData = data;
    if (data.some(item => item.groupName === '分组A')) {
      message.error('已经存在了分组A');
      return false;
    }
    newData.splice(1, 0, {
      sortNo: '',
      groupName: '分组A',
      groupDescribe: '描述',
      params: [],
    });
    this.setState({
      data: newData,
    });
    return '';
    // this.setState({ addGroupVisible: true });
  };

  // // 关闭添加组分类
  // handleCloseGroup = (v, type) => {
  //   const { data } = this.state;
  //   if (type) {
  //     const newData = data;
  //     newData.push({
  //       sortNo: '',
  //       groupName: v.groupName,
  //       groupDescribe: v.groupDescribe,
  //       params: [],
  //     });
  //     this.setState({
  //       data: newData,
  //     });
  //   }
  //   // this.setState({ addGroupVisible: false });
  // };

  /**
   * 标题样式
   * @param {object} item 当前分组对象
   * @param {Int} index 当前分组的键
   */
  titleContent = (item, index) => {
    const { moveTitleId, moveDescId, data } = this.state;
    // const groups = JSON.parse(JSON.stringify(data));
    return (
      <div
        style={{ padding: '0' }}
        draggable
        onDragStart={() => this.dragStartType(item, 2, index + 1)}
      >
        <input
          onMouseEnter={() => {
            this.setState({
              moveTitleId: index,
            });
          }}
          onMouseLeave={() => {
            this.setState({
              moveTitleId: null,
            });
          }}
          onChange={e => {
            data[index + 1].groupName = e.target.value;
            this.setState({
              data: [...data],
            });
          }}
          spellCheck="false"
          style={{
            width: '180px',
            border: 'none',
            outline: 'none',
            paddingLeft: '10px',
            fontSize: '14px',
            color: 'rgba(0, 0, 0, 0.65)',
            fontWeight: 'bolder',
            background: moveTitleId === index ? '#E2E2E2' : 'white',
          }}
          value={item.groupName}
        />

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
            width: '200px',
            fontWeight: '200',
            marginTop: '5px',
          }}
        >
          <textarea
            onMouseEnter={() => {
              this.setState({
                moveDescId: index,
              });
            }}
            onMouseLeave={() => {
              this.setState({
                moveDescId: null,
              });
            }}
            onChange={e => {
              data[index + 1].groupDescribe = e.target.value;
              this.setState({
                data: [...data],
              });
            }}
            spellCheck="false"
            style={{
              width: '200px',
              minHeight: '0',
              maxHeight: '60px',
              border: 'none',
              outline: 'none',
              paddingLeft: '10px',
              fontSize: '14px',
              color: 'rgba(0, 0, 0, 0.45)',
              fontWeight: 'bolder',
              background: moveDescId === index ? '#E2E2E2' : 'white',
              resize: 'none',
            }}
            value={item.groupDescribe}
          />
        </div>
      </div>
    );
  };

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
    // 拖动的是元素放入分类，或者元素排序变更
    if (moveType === 1) {
      // 拖到具体分类
      if (type === 2) {
        if (value.params.filter(item => item.paramId === moveElement.paramId).length === 0) {
          // 添加到新对象里
          newData.forEach((item, i) => {
            if (item.groupName === value.groupName && (index === i || value.groupName === 'no')) {
              newData[i].params.push(moveElement);
            }
          });
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
    const { visible, typeEnlargeVisible, typeEnlargeData, data } = this.state;
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
        maskClosable={false}
      >
        <div className="modelParamter">
          <div
            style={{
              width: '630px',
              height: '500px',
              borderRight: '1px solid #E8E8E8',
              borderTop: '1px solid #E8E8E8',
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
            {/* <AddGroup
              visible={addGroupVisible}
              handleCloseGroup={(v, type = '') => this.handleCloseGroup(v, type)}
            /> */}

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
                    <div className="addParamter">
                      <List.Item key={index}>
                        <Card
                          title={this.titleContent(item, index)}
                          hoverable
                          style={{ width: '269px', height: '234px', overflowY: 'auto' }}
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
                    </div>
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
              borderTop: '1px solid #E8E8E8',
              padding: '12px 20px 12px 20px',
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
                  <div style={{ display: 'none' }} />
                )
              }
              className="list-style card-item-style"
              split={false}
            />
          </div>
        </div>
      </Modal>
    );
  }
}

export default Parameter;

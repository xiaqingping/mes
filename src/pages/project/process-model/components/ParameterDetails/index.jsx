/**
 * 参数拖动页面
 * @param {boolean} visible 是否显示隐藏
 * @param {Function} handleClose 关闭页面方法
 * @param {Array} paramter 参数
 */
import React from 'react';
import { Modal, List, Card, Button } from 'antd';
import { ArrowsAltOutlined } from '@ant-design/icons';
import { compare, cutString } from '@/utils/utils';
import EnlargePage from '../EnlargePage/enlargePage';
// import AddGroup from '../AddGroup/addGroup';

class Parameter extends React.Component {
  static getDerivedStateFromProps(nextProps) {
    return { visible: nextProps.visible || false, data: nextProps.paramter };
  }

  state = {
    // activeId: null,
    visible: false,
    typeEnlargeVisible: false,
    typeEnlargeData: [],
    data: [],
  };

  componentDidMount() {
    const { data } = this.state;
    const newData = data.sort(compare('sortNo'));
    const arr = [];
    newData.forEach(item => {
      const newGroupItem = JSON.parse(JSON.stringify(item));
      const { params } = item;
      newGroupItem.params = params.sort(compare('sortNo'));
      arr.push(newGroupItem);
    });
    this.setState({
      data: arr,
    });
  }

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

  /**
   * 标题样式
   * @param {object} item 当前分组对象
   * @param {Int} index 当前分组的键
   */
  titleContent = item => (
    <div style={{ marginBottom: '5px', marginTop: '2px', height: '86px' }}>
      <span
        style={{
          marginLeft: '10px',
          fontSize: '14px',
          color: 'rgba(0, 0, 0, 0.65)',
          fontWeight: 'bolder',
          background: 'white',
        }}
      >
        {item.groupName}
      </span>

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
          fontSize: '14px',
          marginLeft: '10px',
          marginTop: '10px',
          width: '230px',
          color: 'rgba(0, 0, 0, 0.45)',
        }}
      >
        {cutString(item.groupDescribe, 58)}
      </div>
    </div>
  );

  render() {
    const { visible, typeEnlargeVisible, typeEnlargeData, data } = this.state;
    if (!data) return false;
    if (!data.filter(item => item.groupName === 'no')[0]) {
      return false;
    }
    return (
      <Modal
        title="参数 - 查看"
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
              renderItem={(item, index) => (
                <>
                  <div className="addParamter">
                    <List.Item key={index}>
                      <Card
                        title={this.titleContent(item, index)}
                        style={{ width: '269px', height: '234px', overflowY: 'hidden' }}
                      >
                        {data.filter(i => i.groupName !== 'no').length === 0 ? (
                          ''
                        ) : (
                          <div>
                            {item.params.map(v =>
                              v.paramId ? (
                                <Card
                                  key={v.paramId}
                                  style={{
                                    float: 'left',
                                    margin: '10px',
                                  }}
                                  hoverable
                                >
                                  <div>{v.paramName}</div>
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
              )}
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
                        <div>{item.paramName}</div>
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

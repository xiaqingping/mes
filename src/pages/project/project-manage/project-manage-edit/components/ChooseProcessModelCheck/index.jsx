// 点击选择流程模型的模态框
import React from 'react';
import { Modal, Table, Avatar, Col, Tag, Card, Row } from 'antd';
import '../../index.less';

// 点击流程模型查看的模态框

class ChooseProcessModelCheck extends React.Component {
  tableSearchFormRef = React.createRef();

  constructor(props) {
    console.log(props);
    super(props);
  }

  vieweOk = () => {
    console.log('点击确定');
  };

  viewCancel = () => {
    this.props.onClose();
  };

  render() {
    console.log(this.props);
    const columnView = [
      {
        title: '任务',
        dataIndex: 'task',
      },
      {
        title: '描述',
        dataIndex: 'describe',
      },
      {
        title: '版本',
        dataIndex: 'version',
      },
    ];

    const data = [
      {
        key: '1',
        task: 'John Brown',
        describe: '心灵鸡汤来一碗,心灵鸡汤来两碗',
        version: 'v1.2',
      },
      {
        key: '2',
        task: 'John Brown',
        describe: '心灵鸡汤来一碗,心灵鸡汤来两碗',
        version: 'v1.2',
      },
      {
        key: '3',
        task: 'John Brown',
        describe: '心灵鸡汤来一碗,心灵鸡汤来两碗',
        version: 'v1.2',
      },
    ];

    return (
      <Card bordered={false}>
        <div>
          <Row gutter={16} style={{ margin: '0' }}>
            <Col span={7} style={{ padding: '0', marginBottom: '10px', marginRight: '10px' }}>
              <Modal
                title="查看流程模型"
                visible={this.props.visible}
                onOk={this.vieweOk}
                onCancel={this.viewCancel}
                width={600}
              >
                <div style={{ height: '320px' }}>
                  {/* 上部 */}
                  <div style={{ height: '50px' }}>
                    <Avatar
                      src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                      style={{ float: 'left', marginRight: '10px' }}
                      size="large"
                    />
                    <div
                      style={{
                        float: 'left',
                        height: '50px',
                        width: '100px',
                        textAlign: 'center',
                        marginRight: '20px',
                      }}
                    >
                      <ul style={{ padding: '0', textAlign: 'center' }}>
                        <li>565656443464</li>
                        <li style={{ height: '20px', border: '1px' }}>某某某</li>
                      </ul>
                    </div>

                    <div style={{ float: 'left' }}>
                      <Tag color="green" style={{ width: '40px', height: '20px' }}>
                        v1.2
                      </Tag>
                    </div>
                  </div>
                  {/* 描述 */}
                  <div style={{ fontSize: '14px', padding: '5px' }}>
                    心灵鸡汤来一碗,心灵鸡汤来两碗,心灵鸡汤来三碗，心灵鸡汤来四碗,心灵鸡汤来一碗,
                    心灵鸡汤来两碗,心灵鸡汤来三碗，心灵鸡汤来四碗
                  </div>
                  {/* 表格 */}
                  <div>
                    <Table columns={columnView} dataSource={data} size="small" />
                  </div>
                </div>
              </Modal>
            </Col>
          </Row>
        </div>
      </Card>
    );
  }
}

export default ChooseProcessModelCheck;

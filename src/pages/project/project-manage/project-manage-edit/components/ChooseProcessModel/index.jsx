// 点击选择流程模型的模态框
import React from 'react';
import { Modal, Avatar, Col, Tag, Card, Row, Button } from 'antd';
import '../../index.less';
import ChooseProcessModelCheck from '../ChooseProcessModelCheck';

// 选择流程模型模态框
class ChooseProcessModel extends React.Component {
  tableSearchFormRef = React.createRef();

  constructor(props) {
    console.log(props);
    super(props);

    this.state = {
      viewvisible: false,
    };
  }

  handleOk = () => {
    // this.setState({
    //   visible: false,
    // });
    // const data = {
    //   type: 'ok',
    //   id: this.props.data.id,
    //   jurisdictionValue: this.props.data.jurisdictionValue,
    // }
    // this.props.getData(data);
    // this.props.onClose();
    console.log('点击确定');
  };

  handleCancel = () => {
    this.props.onClose();
  };

  viewModal = () => {
    // console.log(123);
    this.setState({
      viewvisible: true,
    });
  };

  // 点击关闭关联
  viewClose = () => {
    this.setState({
      viewvisible: false,
    });
  };

  render() {
    const { viewvisible } = this.state;

    return (
      <Card bordered={false}>
        <div>
          <Modal
            title="选择流程模型"
            visible={this.props.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            width={1200}
          >
            <div>
              <Row gutter={16} style={{ margin: '0' }}>
                <Col span={7} style={{ padding: '0', marginBottom: '10px', marginRight: '10px' }}>
                  <Card.Grid style={{ width: '300px', padding: '0' }}>
                    <div style={{ height: '80px', width: '300px', padding: '5px' }}>
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
                        }}
                      >
                        <ul style={{ padding: '0', textAlign: 'center' }}>
                          <li>某某某</li>
                          <li>
                            <Tag color="green" style={{ width: '50px', height: '20px' }}>
                              v1.2
                            </Tag>
                          </li>
                        </ul>
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          float: 'right',
                          color: '#005bc3',
                          marginRight: '10px',
                        }}
                      >
                        <Button onClick={this.viewModal} style={{ border: '0', color: '#005bc3' }}>
                          查看
                        </Button>
                      </div>
                    </div>
                    <div style={{ fontSize: '14px', padding: '10px' }}>
                      心灵鸡汤来一碗,心灵鸡汤来两碗,心灵鸡汤来三碗，心灵鸡汤来四碗
                    </div>
                  </Card.Grid>
                </Col>
                <Col span={7} style={{ padding: '0', marginBottom: '10px', marginRight: '10px' }}>
                  <Card.Grid style={{ width: '300px', padding: '0' }}>
                    <div style={{ height: '80px', width: '300px', padding: '5px' }}>
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
                        }}
                      >
                        <ul style={{ padding: '0', textAlign: 'center' }}>
                          <li>某某某</li>
                          <li>
                            <Tag color="green" style={{ width: '50px', height: '20px' }}>
                              v1.2
                            </Tag>
                          </li>
                        </ul>
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          float: 'right',
                          color: '#005bc3',
                          marginRight: '10px',
                        }}
                      >
                        查看
                      </div>
                    </div>
                    <div style={{ fontSize: '14px', padding: '10px' }}>
                      心灵鸡汤来一碗,心灵鸡汤来两碗,心灵鸡汤来三碗，心灵鸡汤来四碗
                    </div>
                  </Card.Grid>
                </Col>
              </Row>
            </div>
          </Modal>
          <ChooseProcessModelCheck visible={viewvisible} onClose={this.viewClose} />
        </div>
      </Card>
    );
  }
}

export default ChooseProcessModel;

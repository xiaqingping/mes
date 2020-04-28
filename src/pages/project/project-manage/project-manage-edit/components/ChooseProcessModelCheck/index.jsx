// 点击选择流程模型的模态框
import React from 'react';
import { Modal, Table, Avatar, Col, Tag, Card, Row } from 'antd';
import '../../index.less';
import disk from '@/pages/project/api/disk';
import DefaultHeadPicture from '@/assets/imgs/defaultheadpicture.jpg';

class ChooseProcessModelCheck extends React.Component {
  // tableSearchFormRef = React.createRef();
  static getDerivedStateFromProps(nextProps) {
    return {
      viewlist: nextProps.viewlist || [],
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      viewlist: props.viewlist, // 带过来的查看数据
    };
  }

  // 点击确定，关闭弹框
  vieweOk = () => {
    this.props.onClose();
  };

  // 点击x，关闭弹框
  viewCancel = () => {
    this.props.onClose();
  };

  render() {
    const { viewlist } = this.state;

    const columns = [
      {
        title: '任务',
        dataIndex: 'name',
        width: 250,
        render: (value, row) => (
          <>
            <Avatar
              // src={row.fileId ? disk.downloadFiles(row.fileId,
              //   { view: true }) : DefaultHeadPicture}
              src={
                row.picture ? disk.downloadFiles(row.picture, { view: true }) : DefaultHeadPicture
              }
              style={{ float: 'left', width: '46px', height: '46px' }}
            />
            <div style={{ float: 'left' }}>
              <div>{row.code}</div>
              <div>{value}</div>
            </div>
          </>
        ),
      },
      {
        title: '描述',
        dataIndex: 'describe',
        width: 500,
      },
      {
        title: '版本',
        dataIndex: 'version',
        width: 100,
        render: value => (
          <Tag color="green" style={{ padding: '0 10px' }}>
            {value}
          </Tag>
        ),
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
                width={900}
                footer={null}
              >
                <div style={{ height: '320px', paddingLeft: '30px', overflow: 'auto' }}>
                  {/* 上部 */}
                  <div style={{ height: '80px' }}>
                    <Avatar
                      // src={
                      //   viewlist.fileId
                      //     ? disk.downloadFiles(disk.fileId, { view: true })
                      //     : DefaultHeadPicture
                      // }
                      src={
                        viewlist.picture
                          ? disk.downloadFiles(viewlist.picture, { view: true })
                          : DefaultHeadPicture
                      }
                      style={{ float: 'left', width: '60px', height: '60px' }}
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
                        <li>{viewlist.code}</li>
                        <li style={{ height: '20px', border: '1px' }}>{viewlist.name}</li>
                      </ul>
                    </div>

                    <div style={{ float: 'left' }}>
                      <Tag color="green" style={{ width: '40px', height: '20px' }}>
                        {viewlist.version}
                      </Tag>
                    </div>
                  </div>
                  {/* 描述 */}
                  <div style={{ fontSize: '14px', padding: '0 5px', marginBottom: '40px' }}>
                    {viewlist.describe}
                  </div>
                  {/* 表格 */}
                  <div>
                    <Table
                      columns={columns}
                      pagination={false}
                      dataSource={viewlist.taskModels}
                      size="small"
                    />
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

import React, { Component } from 'react';

import { connect } from 'dva';
import { Tabs, Avatar, Tag, Badge, Card, List } from 'antd';

const { TabPane } = Tabs;
// import TitleModel from './components/titleModel';

class TaskModelTabs extends Component {
  state = {};

  onChange = e => {
    console.log(e);
  };

  render() {
    // const { taskModel } = this.props;
    // const { statusObj } = taskModel;
    return (
      <>
        <Tabs defaultActiveKey="1" onChange={this.onChange}>
          <TabPane tab="前置任务" key="1">
            <List
              rowKey="id"
              dataSource={[123, 3, 4, 56]}
              renderItem={item => (
                <List.Item key={item}>
                  <Card hoverable style={{ width: '550px' }}>
                    <Avatar
                      src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                      style={{ float: 'left' }}
                      size="large"
                    />
                    <div style={{ float: 'left' }}>
                      <div>123123123333333333333</div>
                      <div style={{ wordWrap: 'break-word' }}>
                        肠道菌群宏基因组示例-demo2018-03-06
                      </div>
                    </div>
                    <Badge status="error" text="已禁用" style={{ float: 'right' }} />
                    <Tag color="green" style={{ padding: '0 10px', float: 'right' }}>
                      V1.0
                    </Tag>
                  </Card>
                </List.Item>
              )}
              className="list-style"
              split={false}
            />
          </TabPane>
          <TabPane tab="后置任务" key="2">
            <List
              rowKey="id"
              dataSource={[123, 3, 4, 56]}
              renderItem={item => (
                <List.Item key={item}>
                  <Card hoverable style={{ width: '550px' }}>
                    <Avatar
                      src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                      style={{ float: 'left' }}
                      size="large"
                    />
                    <div style={{ float: 'left' }}>
                      <div>123123123333333333333</div>
                      <div style={{ wordWrap: 'break-word' }}>
                        肠道菌群宏基因组示例-demo2018-03-06
                      </div>
                    </div>
                    <Badge status="error" text="已禁用" style={{ float: 'right' }} />
                    <Tag color="green" style={{ padding: '0 10px', float: 'right' }}>
                      V1.0
                    </Tag>
                  </Card>
                </List.Item>
              )}
              className="list-style"
              split={false}
            />
          </TabPane>
        </Tabs>
      </>
    );
  }
}

export default connect(taskModel => ({
  taskModel,
}))(TaskModelTabs);
